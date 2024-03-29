<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Error</title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/app.css" />
    <link rel="shortcut icon" href="/images/favicon.png" />
</head>
<body>
<#include "intro.html">
<p>Something went wrong:</p>
<pre><%= error %></pre>
<p>Response from the UID2 operator:</p>
<pre><%= response ? JSON.stringify(response.data) : '' %></pre>
<p>HTTP error:</p>
<pre><%= response ? (response.status + ' ' + response.statusText) : '' %></pre>
<p><a href="/standard/">Back to the main page</a></p>
</body>
</html>
