package com.uid2.uid2_java_test_site;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.Session;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.common.template.TemplateEngine;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.sstore.cookie.CookieSessionStore;
import io.vertx.ext.web.templ.freemarker.FreeMarkerTemplateEngine;


public class MainVerticle extends AbstractVerticle {

  private void render(RoutingContext ctx, String templateFileName, JsonObject jsonObject) { //similar to https://github.com/openpass-sso/openpass-vertx-test-site/blob/master/src/main/java/com/myopenpass/vertx_test_site/handlers/DefaultTemplateHandler.java
    //from https://github.com/vert-x3/vertx-examples/blob/4.x/web-examples/src/main/java/io/vertx/example/web/templating/freemarker/Server.java#L44
    engine.render(jsonObject, templateFileName, res -> {
      if (res.succeeded()) {
        ctx.response().end(res.result());
      } else {
        ctx.fail(res.cause());
      }
    });
  }



  final String UID2_OPERATOR_HOST = System.getenv("UID2_OPERATOR_HOST");
  final int UID2_OPERATOR_PORT = Integer.parseInt(System.getenv("UID2_OPERATOR_PORT"));
  final String UID2_API_KEY = System.getenv("UID2_API_KEY");
  final String UID2_SECRET_KEY = System.getenv("UID2_SECRET_KEY");

  private void renderError(HttpResponse<Buffer> response, String errorMessage, RoutingContext ctx) {
    JsonObject json = new JsonObject().put("error", errorMessage);
    if (response != null) {
      json.put("responseStatus", response.statusCode()).put("response", response.bodyAsString());
    } else {
      json.put("responseStatus", "<null>").put("response", "<null>");
    }

    render(ctx, "templates/error.ftl", json);
  }

  private void generateTokenV1(RoutingContext ctx, String email) { //todo - this probably should be a test instead (ie, that a refresh response that is unencrypted still works)
    WebClient client = WebClient.create(vertx); //todo - create once on application startup and then reuse
    client
      .get(UID2_OPERATOR_PORT, UID2_OPERATOR_HOST, "/v1/token/generate")
      .addQueryParam("email", email)
      .putHeader("Authorization", "Bearer " + UID2_API_KEY)
      .send()
      .onSuccess(response -> {
        System.out.println("Received response with status code " + response.statusCode());
        if (response.statusCode() != 200) {
          renderError(response, "HTTP status code is not 200", ctx);
          return;
        }

        String responseString = response.bodyAsString();
        JsonObject identity = new JsonObject(responseString);

        if (!identity.getString("status").equals("success")) {
          renderError(response, "Got unexpected token generate status in decrypted response:\n" + identity.encodePrettily(), ctx);
          return;
        }

        setIdentity(ctx, responseString);
        ctx.redirect("/");
      })
      .onFailure(err -> {
          renderError(null, err.getMessage(), ctx);
        }
      );
  }

    private void generateToken(RoutingContext ctx, String email)
  {
    final boolean testV1Tokens = false; //change this to true to test that stored v1 sessions will still work when we upgrade to /v2/token/refresh.
    if (testV1Tokens) {
      generateTokenV1(ctx, email);
      return;
    }

    //final String jsonRequest = new JsonObject().put("email", email).toString();
    //1. final String jsonRequest = Envelope.createJsonRequest(email_hash, "superbla@bla.com");
    //2. final String jsonRequest = IdentityType.EmailHash Envelope.createJsonRequest(emailHash, "superbla@bla.com");

    //final String jsonRequest = createJsonRequestForGenerateToken(IdentityType.Email, email);
    //final String jsonRequest = createJsonRequestForGenerateToken(IdentityType.Phone, email);
    final String jsonRequest = EncryptionUtils.createJsonRequestForGenerateToken(IdentityType.Email, email);
    Envelope envelope = EncryptionUtils.createEnvelope(UID2_SECRET_KEY, jsonRequest);

    WebClient client = WebClient.create(vertx); //todo - create once on application startup and then reuse
    client
      .post(UID2_OPERATOR_PORT, UID2_OPERATOR_HOST, "/v2/token/generate")
      .putHeader("Authorization", "Bearer " + UID2_API_KEY)
      .sendBuffer(Buffer.buffer(envelope.getEnvelope()))
      .onSuccess(response -> {
        System.out.println("Received response with status code " + response.statusCode());
        if (response.statusCode() != 200) {
          renderError(response, "HTTP status code is not 200", ctx);
          return;
        }

        try {
          IdentityTokens identity = EncryptionUtils.createIdentityfromTokenGenerateResponse(response.bodyAsString(), envelope.getNonce(), UID2_SECRET_KEY);

          setIdentity(ctx, identity.getJsonString());
          ctx.redirect("/");
        } catch (RuntimeException e) {
          renderError(null, e.getMessage(), ctx);
        }
      })
      .onFailure(err -> {
          renderError(null, err.getMessage(), ctx);
        }
      );
  }

  private IdentityTokens getIdentity(RoutingContext ctx) {
    Session session = ctx.session();

    String identityJsonString = session.get("identity");
    return identityJsonString == null ? null : IdentityTokens.createFromJsonString(identityJsonString);
  }


  private void setIdentity(RoutingContext ctx, String jsonResponse) {
    Session session = ctx.session();
    session.put("identity", jsonResponse);
  }




  private void processRefreshIdentityResponse(HttpResponse<Buffer> encryptedResponse, RoutingContext ctx, IdentityTokens identity) {
    System.out.println("Received response with status code " + encryptedResponse.statusCode());
    if (encryptedResponse.statusCode() != 200) {
        renderError(encryptedResponse, "HTTP status code is not 200", ctx);
        return;
    }

    try {
      IdentityTokens refreshedIdentity = EncryptionUtils.createIdentityFromTokenRefreshResponse(encryptedResponse.bodyAsString(), identity); //returns null if user has opted out
      setIdentity(ctx, refreshedIdentity == null ? null : refreshedIdentity.getJsonString());
    } catch (RuntimeException e) {
      renderError(null, e.getMessage(), ctx);
    }
  }

  private Future<Void> refreshIdentity(RoutingContext ctx) {
    System.out.println("refreshIdentity()");

    Promise<Void> promise = Promise.promise();

    final IdentityTokens identity = getIdentity(ctx);
    String refreshToken = identity.getRefreshToken();

    WebClient client = WebClient.create(vertx); //todo - fix copy/paste . 2) create once on application startup and then reuse. But check if multithreading is ok with that.
    client
      .post(UID2_OPERATOR_PORT, UID2_OPERATOR_HOST, "/v2/token/refresh")
      .putHeader("Authorization", "Bearer " + UID2_API_KEY)
      .sendBuffer(Buffer.buffer(refreshToken))
      .onSuccess(encryptedResponse -> {
        processRefreshIdentityResponse(encryptedResponse, ctx, identity);
        if (getIdentity(ctx) == null)
          promise.fail("no identity"); //eg opt out
        else
          promise.complete();
      })
      .onFailure(err -> {
        renderError(null, err.getMessage(), ctx);
        //TODO set identity based on: return Date.now() >= identity.identity_expires ? undefined : identity;
        promise.fail("something went wrong" + err.getMessage());
      });

    return promise.future();
  }


  private Future<Void> verifyIdentity(RoutingContext ctx) {
    System.out.println("verifyIdentity()");
    Promise<Void> promise = Promise.promise();

    IdentityTokens identity = getIdentity(ctx);
    if (identity == null || !identity.isRefreshable()) {
      promise.fail("identity is not refreshable");
      return promise.future();
    }

    if (identity.isDueForRefresh()) {
      return refreshIdentity(ctx);
    }

    if (getIdentity(ctx) != null)
      promise.complete();
    else
      promise.fail("no identity");

    return promise.future();
  }

  void protect(RoutingContext ctx) {
    System.out.println("calling protect()");

    verifyIdentity(ctx)
      .onSuccess(v ->  {
        System.out.println("protect succeeded");
        ctx.next();
      })
      .onFailure(err -> {
        setIdentity(ctx, null);
        ctx.redirect("/login");
      });
  }

  private JsonObject getIdentityForTemplate(RoutingContext ctx) {
    IdentityTokens identity = getIdentity(ctx);
    return new JsonObject().put("identity", new JsonObject(identity.getJsonString()).encodePrettily());
  }

  private TemplateEngine engine;

  private Router createRoutesSetup() {
    engine = FreeMarkerTemplateEngine.create(vertx);
    final Router router = Router.router(vertx);

    router.route().handler(BodyHandler.create());
    router.route().handler(SessionHandler.create(CookieSessionStore.create(vertx, "my-secret")));
    router.route().handler(StaticHandler.create("webroot"));
    /*router.route().failureHandler(failureRoutingContext -> {
      int statusCode = failureRoutingContext.statusCode();

      HttpServerResponse response = failureRoutingContext.response();
      response.setStatusCode(statusCode).end("Sorry! Not today");
    });
    router.errorHandler(500, routingContext -> {
      routingContext.end("i want this to be displayed");
    });*/

    router.get("/login").handler(ctx -> {
      System.out.println("GET /login");
      verifyIdentity(ctx)
        .onSuccess(v -> ctx.redirect("/"))
        .onFailure(v -> {
          setIdentity(ctx, null);
          render(ctx, "templates/login.ftl", new JsonObject());
        });
    });

    router.post("/login").handler(ctx -> {
      generateToken(ctx, ctx.request().getFormAttribute("email"));
    });

    router.get("/logout").handler(ctx -> {
      setIdentity(ctx, null);
      ctx.redirect("/login");
    });

    router.get("/").handler(this::protect);
    router.get("/content1").handler(this::protect);
    router.get("/content2").handler(this::protect);

    router.get("/").handler(ctx -> {
      System.out.println("GET /");
      JsonObject jsonObject = getIdentityForTemplate(ctx);
      render(ctx, "templates/index.ftl", jsonObject);
    });

    router.get("/content1").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx).put("content", "First Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    router.get("/content2").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx).put("content", "Second Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    return router;
  }


    @Override
  public void start(Promise<Void> startPromise) {
    Router router = createRoutesSetup();

    vertx.createHttpServer().requestHandler(router).listen(8888)
      .onSuccess(server -> System.out.println("HTTP server started on http://localhost:" + server.actualPort()))
      .onFailure(failure -> System.out.println("Error: " + failure.getMessage()));
  }
}
