<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>UID2 Publisher Standard Integration Example</title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/app.css" />
    <link rel="shortcut icon" href="/images/favicon.png" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://prod.uidapi.com/static/js/uid2-sdk-2.0.0.js"></script>
    <script>
      $(document).ready(() => {
        let callbackCounter = 0;

        function updateGuiElements(state) {
          $("#targeted_advertising_ready").html(__uid2.getAdvertisingToken() ? "yes" : "no");
          $("#advertising_token").html(String(__uid2.getAdvertisingToken()));
          $("#login_required").html(__uid2.isLoginRequired() ? "yes" : "no");
          $("#update_counter").html(callbackCounter);
          $("#identity_state").html(String(JSON.stringify(state, null, 2)));

          if (__uid2.isLoginRequired()) {
            $("#login_form").show();
            $("#logout_form").hide();
          } else {
            $("#login_form").hide();
            $("#logout_form").show();
          }
        }

        function onUid2IdentityUpdated(state) {
          ++callbackCounter;
          updateGuiElements(state);
        }

        $("#logout").click(() => {
          __uid2.disconnect();
          updateGuiElements(undefined);
        });

        updateGuiElements(undefined);

        __uid2.init({
          callback: onUid2IdentityUpdated,
          baseUrl: "${uid2BaseUrl}"
        });
      });
    </script>
  </head>
  <body>
      <#include "intro.html">
      <table id="uid2_state">
      <tr><td class="label">Ready for Targeted Advertising:</td><td class="value"><pre id="targeted_advertising_ready"></pre></td></tr>
      <tr><td class="label">UID2 Advertising Token:</td><td class="value"><pre id="advertising_token"></pre></td></tr>
      <tr><td class="label">Is UID2 Login Required?</td><td class="value"><pre id="login_required"></pre></td></tr>
      <tr><td class="label">UID2 Identity Updated Counter:</td><td class="value"><pre id="update_counter"></pre></td></tr>
      <tr><td class="label">UID2 Identity Callback State:</td><td class="value"><pre id="identity_state"></pre></td></tr>
    </table>
    <div id="login_form" style="display:none" class="form"><form action="/standard/login" method="POST">
      <div class="email_prompt"><input type="text" id="email" name="email" placeholder="Enter an email address" style="border-style: none;"></div>
      <div><input type="submit" value="Log In" class="button"></div>
    </form></div>
    <div id="logout_form" style="display:none" class="form"><form>
      <button type="button" class="button" id="logout">Log Out</button>
    </form></div>
  </body>
</html>
