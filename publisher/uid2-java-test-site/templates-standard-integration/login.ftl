<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>UID2 Publisher Standard Integration Example Login Result</title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/app.css" />
    <link rel="shortcut icon" href="/images/favicon.png" />
    <script src="https://prod.uidapi.com/static/js/uid2-sdk-2.0.0.js"></script>
    <script>
      function onUid2IdentityUpdated(state) {
        // can automatically redirect user to index page here
      }

      __uid2.init({
        callback: onUid2IdentityUpdated,
        baseUrl: "${uid2BaseUrl}",
        identity: ${identity}
      });
    </script>
</head>
<body>
<#include "intro.html">
<p class="message">Login completed</p>
<p>UID2 identity:</p>
<pre>${identity}</pre>
<p><a href="/standard/">Back to the main page</a></p>
<p>Normally user would be redirected automatically, but this example demonstrates one way UID2 login could be handled.</p>
</body>
</html>
