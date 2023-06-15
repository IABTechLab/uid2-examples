package com.uid2.testsite;

import com.uid2.client.*;
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

  private void render(RoutingContext ctx, String templateFileName, JsonObject jsonObject) {
    //from https://github.com/vert-x3/vertx-examples/blob/4.x/web-examples/src/main/java/io/vertx/example/web/templating/freemarker/Server.java#L44
    engine.render(jsonObject, templateFileName, res -> {
      if (res.succeeded()) {
        ctx.response().end(res.result());
      } else {
        ctx.fail(res.cause());
      }
    });
  }


  private static final String UID2_BASE_URL = System.getenv("UID2_BASE_URL");
  private static final String UID2_API_KEY = System.getenv("UID2_API_KEY");
  private static final String UID2_SECRET_KEY = System.getenv("UID2_SECRET_KEY");
  private static final String PREFIX_STANDARD = "/standard";
  private static final String PREFIX_BASIC = "/basic";
  private final PublisherUid2Helper publisherUid2Helper = new PublisherUid2Helper(UID2_SECRET_KEY); //for advanced usage (Do your own HTTP)
  private final PublisherUid2Client publisherUid2Client = new PublisherUid2Client(UID2_BASE_URL, UID2_API_KEY, UID2_SECRET_KEY); //for basic usage (SDK does HTTP)


  private int GetPort() {
    try {
      return Integer.parseInt(System.getenv("UID2_PORT"));
    }
    catch (NumberFormatException e) {
      return 3000;
    }
  }

  private void renderError(HttpResponse<Buffer> response, String errorMessage, RoutingContext ctx, String prefix) {
    JsonObject json = new JsonObject().put("error", errorMessage);
    if (response != null) {
      json.put("prefix", prefix).put("responseStatus", response.statusCode()).put("response", response.bodyAsString());
    } else {
      json.put("prefix", prefix).put("responseStatus", "<null>").put("response", "<null>");
    }

    render(ctx, "templates/error.ftl", json);
  }

  private WebClient webClient;

  private void generateTokenBasicUsage(RoutingContext ctx, String email) {
    try {
      TokenGenerateResponse tokenGenerateResponse = publisherUid2Client.generateTokenResponse(TokenGenerateInput.fromEmail(email).doNotGenerateTokensForOptedOut()); //UID2
      // EUID's input would look like this:
      // TokenGenerateInput.fromEmail(email).withTransparencyAndConsentString("CPhJRpMPhJRpMABAMBFRACBoALAAAEJAAIYgAKwAQAKgArABAAqAAA").doNotGenerateTokensForOptedOut();

      setIdentity(ctx, tokenGenerateResponse.getIdentityJsonString());
      ctx.redirect(PREFIX_BASIC + "/");
    } catch (RuntimeException e) {
      renderError(null, e.getMessage(), ctx, PREFIX_BASIC);
    }
  }


  private void generateTokenAdvancedUsage(RoutingContext ctx, String email, String redirect, String prefix) {
    try {
      EnvelopeV2 envelope = publisherUid2Helper.createEnvelopeForTokenGenerateRequest(TokenGenerateInput.fromEmail(email).doNotGenerateTokensForOptedOut()); //UID2
      // EUID's input would look like this:
      // TokenGenerateInput.fromEmail(email).withTransparencyAndConsentString("CPhJRpMPhJRpMABAMBFRACBoALAAAEJAAIYgAKwAQAKgArABAAqAAA").doNotGenerateTokensForOptedOut();

      webClient
        .postAbs(UID2_BASE_URL + "/v2/token/generate")
        .putHeader("Authorization", "Bearer " + UID2_API_KEY)
        .putHeader("X-UID2-Client-Version", PublisherUid2Helper.getVersionHttpHeader())
        .sendBuffer(Buffer.buffer(envelope.getEnvelope()))
        .onSuccess(response -> {
          if (response.statusCode() != 200) {
            renderError(response, "HTTP status code is not 200", ctx, "");
            return;
          }

          try {
            TokenGenerateResponse tokenGenerateResponse = publisherUid2Helper.createTokenGenerateResponse(response.bodyAsString(), envelope);

            setIdentity(ctx, tokenGenerateResponse.getIdentityJsonString());
            if (tokenGenerateResponse.getIdentityJsonString() != null)
              ctx.redirect(redirect);
            else
              renderError(null, "User has opted out", ctx, "");
          } catch (RuntimeException e) {
            renderError(null, e.getMessage(), ctx, "");
          }
        })
        .onFailure(err -> renderError(null, err.getMessage(), ctx, prefix));
    } catch (RuntimeException e) {
      renderError(null, e.getMessage(), ctx, prefix);
    }
  }

  private IdentityTokens getIdentity(RoutingContext ctx) {
    Session session = ctx.session();

    String identityJsonString = session.get("identity");
    if (identityJsonString == null) {
      return null;
    }
    return IdentityTokens.fromJsonString(identityJsonString);
  }


  private void setIdentity(RoutingContext ctx, String jsonResponse) {
    Session session = ctx.session();
    session.put("identity", jsonResponse);
  }


  private void processRefreshIdentityResponse(HttpResponse<Buffer> encryptedResponse, RoutingContext ctx, IdentityTokens identity, String prefix) {
    if (encryptedResponse.statusCode() != 200) {
        renderError(encryptedResponse, "HTTP status code is not 200", ctx, prefix);
        return;
    }

    try {
      TokenRefreshResponse tokenRefreshResponse = PublisherUid2Helper.createTokenRefreshResponse(encryptedResponse.bodyAsString(), identity);
      setIdentity(ctx, tokenRefreshResponse.getIdentityJsonString());
    } catch (RuntimeException e) {
      renderError(null, e.getMessage(), ctx, prefix);
    }
  }

  private Future<Void> refreshIdentity(RoutingContext ctx, boolean basicUsage) {
    Promise<Void> promise = Promise.promise();

    final IdentityTokens identity = getIdentity(ctx);
    final String prefix = basicUsage ? PREFIX_BASIC : "";

    if (basicUsage) {
      try {
        TokenRefreshResponse tokenRefreshResponse = publisherUid2Client.refreshToken(identity);
        String identityJsonString = tokenRefreshResponse.getIdentityJsonString();
        setIdentity(ctx, identityJsonString);

        if (identityJsonString == null)
          promise.fail("no identity"); //eg opt out
        else
          promise.complete();
      } catch (RuntimeException e) {
        renderError(null, e.getMessage(), ctx, prefix);
      }
    } else { //advanced usage
      String refreshToken = identity.getRefreshToken();

      webClient
        .postAbs(UID2_BASE_URL + "/v2/token/refresh")
        .putHeader("Authorization", "Bearer " + UID2_API_KEY)
        .putHeader("X-UID2-Client-Version", PublisherUid2Helper.getVersionHttpHeader())
        .sendBuffer(Buffer.buffer(refreshToken))
        .onSuccess(encryptedResponse -> {
          processRefreshIdentityResponse(encryptedResponse, ctx, identity, prefix);
          if (getIdentity(ctx) == null)
            promise.fail("no identity"); //eg opt out
          else
            promise.complete();
        })
        .onFailure(err -> {
          renderError(null, err.getMessage(), ctx, prefix);
          promise.fail("something went wrong" + err.getMessage());
        });
    }

    return promise.future();
  }


  private Future<Void> verifyIdentity(RoutingContext ctx, boolean basicUsage) {
    Promise<Void> promise = Promise.promise();

    IdentityTokens identity = getIdentity(ctx);
    if (identity == null || !identity.isRefreshable()) {
      promise.fail("identity is not refreshable");
      return promise.future();
    }

    if (identity.isDueForRefresh()) {
      return refreshIdentity(ctx, basicUsage);
    }

    if (getIdentity(ctx) != null)
      promise.complete();
    else
      promise.fail("no identity");

    return promise.future();
  }

  void protect(RoutingContext ctx, boolean basicUsage) {
    final String redirect = basicUsage ? PREFIX_BASIC + "/login" : "/login";

    verifyIdentity(ctx, basicUsage)
      .onSuccess(v ->  ctx.next())
      .onFailure(err -> {
        setIdentity(ctx, null);
        ctx.redirect(redirect);
      });
  }

  private JsonObject getIdentityForTemplate(RoutingContext ctx, String prefix) {
    IdentityTokens identity = getIdentity(ctx);
    return new JsonObject().put("prefix", prefix).put("identity", new JsonObject(identity.getJsonString()).encodePrettily());
  }

  private TemplateEngine engine;

  private Router createRoutesSetupForAdvancedUsageServerOnly() {
    final Router router = Router.router(vertx);

    router.route().handler(BodyHandler.create());
    router.route().handler(SessionHandler.create(CookieSessionStore.create(vertx, "my-secret")));
    router.route().handler(StaticHandler.create("webroot"));

    router.get("/login").handler(ctx ->
      verifyIdentity(ctx, false)
        .onSuccess(v -> ctx.redirect("/"))
        .onFailure(v -> {
          setIdentity(ctx, null);
          render(ctx, "templates/login.ftl", new JsonObject().put("redirect", "/login"));
        })
    );

    router.post("/login").handler(ctx ->
      generateTokenAdvancedUsage(ctx, ctx.request().getFormAttribute("email"), "/", "")
    );

    router.get("/logout").handler(ctx -> {
      setIdentity(ctx, null);
      ctx.redirect("/login");
    });

    router.get("/").handler(ctx -> protect(ctx, false));
    router.get("/content1").handler(ctx -> protect(ctx, false));
    router.get("/content2").handler(ctx -> protect(ctx, false));

    router.get("/").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, "");
      render(ctx, "templates/index.ftl", jsonObject);
    });

    router.get("/content1").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, "").put("content", "First Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    router.get("/content2").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, "").put("content", "Second Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    return router;
  }

    private Router createRoutesSetupForAdvancedUsageStandardIntegration() {
    Router standardIntegration = Router.router(vertx);

    standardIntegration.get("/").handler(ctx ->
      render(ctx, "templates-standard-integration/index.ftl", new JsonObject().put("uid2BaseUrl", UID2_BASE_URL)));

    standardIntegration.post("/login").handler(ctx ->
      generateTokenAdvancedUsage(ctx, ctx.request().getFormAttribute("email"), PREFIX_STANDARD + "/login", PREFIX_STANDARD));

    standardIntegration.get("/login").handler(ctx ->
      render(ctx, "templates-standard-integration/login.ftl", getIdentityForTemplate(ctx, PREFIX_STANDARD).put("uid2BaseUrl", UID2_BASE_URL)));

    return standardIntegration;
  }

  private Router createRouteSetupForBasicUsageServerOnly() {
    final Router router = Router.router(vertx);

    router.route().handler(BodyHandler.create());
    router.route().handler(SessionHandler.create(CookieSessionStore.create(vertx, "my-secret")));
    router.route().handler(StaticHandler.create("webroot"));

    router.get("/login").handler(ctx ->
      verifyIdentity(ctx, true)
        .onSuccess(v -> ctx.redirect("/"))
        .onFailure(v -> {
          setIdentity(ctx, null);
          render(ctx, "templates/login.ftl", new JsonObject().put("redirect", PREFIX_BASIC + "/login"));
        })
    );

    router.post("/login").handler(ctx -> generateTokenBasicUsage(ctx, ctx.request().getFormAttribute("email")));

    router.get("/logout").handler(ctx -> {
      setIdentity(ctx, null);
      ctx.redirect(PREFIX_BASIC + "/login");
    });

    router.get("/").handler(ctx -> protect(ctx, true));
    router.get("/content1").handler(ctx -> protect(ctx, true));
    router.get("/content2").handler(ctx -> protect(ctx, true));

    router.get("/").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, PREFIX_BASIC);
      render(ctx, "templates/index.ftl", jsonObject);
    });

    router.get("/content1").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, PREFIX_BASIC).put("content", "First Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    router.get("/content2").handler(ctx -> {
      JsonObject jsonObject = getIdentityForTemplate(ctx, PREFIX_BASIC).put("content", "Second Sample Content");
      render(ctx, "templates/content.ftl", jsonObject);
    });

    return router;

  }

  @Override
  public void start(Promise<Void> startPromise) {
    webClient = WebClient.create(vertx);
    engine = FreeMarkerTemplateEngine.create(vertx);

    Router serverOnlyRouter = createRoutesSetupForAdvancedUsageServerOnly();
    Router standardIntegrationRouter = createRoutesSetupForAdvancedUsageStandardIntegration();
    Router serverOnlyWithBasicUsage = createRouteSetupForBasicUsageServerOnly();

    Router parentRouter = Router.router(vertx);
    parentRouter.route("/*").subRouter(serverOnlyRouter);
    parentRouter.route(PREFIX_STANDARD + "/*").subRouter(standardIntegrationRouter);
    parentRouter.route(PREFIX_BASIC +"/*").subRouter(serverOnlyWithBasicUsage);

    vertx.createHttpServer().requestHandler(parentRouter).listen(GetPort())
      .onSuccess(server -> System.out.println("HTTP server started on http://localhost:" + server.actualPort()))
      .onFailure(failure -> System.out.println("Error: " + failure.getMessage()));
  }
}
