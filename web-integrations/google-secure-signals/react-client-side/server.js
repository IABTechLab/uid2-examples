// Load environment variables from .env file (for local development)
// In Docker, env_file in docker-compose.yml already provides these, so this is optional
try {
  require('dotenv').config({ path: '../../../.env' });
} catch (error) {
  // Silently fail if .env file doesn't exist (e.g., in Docker where env vars are provided via env_file)
  // This is expected behavior when running in Docker
}

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 3044;

// Healthcheck endpoint for Kubernetes probes - must be before all other routes and middleware
app.get('/ops/healthcheck', (req, res) => {
  res.type('text/plain');
  res.status(200).send('healthy\n');
  return; // Explicit return to prevent further processing
});

// Helper function to serve index.html with environment variable replacement
function serveIndexHtml(req, res) {
  // Try build directory first (production), then public (development)
  const buildPath = path.join(__dirname, 'build');
  const buildIndexPath = path.join(buildPath, 'index.html');
  const publicIndexPath = path.join(__dirname, 'public', 'index.html');
  
  let indexPath;
  if (fs.existsSync(buildIndexPath)) {
    indexPath = buildIndexPath;
  } else if (fs.existsSync(publicIndexPath)) {
    console.warn('Warning: build directory not found. Serving from public directory. Run "npm run build" to build the React app.');
    indexPath = publicIndexPath;
  } else {
    res.status(500).send('Error: Neither build nor public index.html found. Please run "npm run build" first.');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Replace environment variable placeholders
  const uidJsSdkUrl = process.env.REACT_APP_UID_JS_SDK_URL || 'https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js';
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Replace placeholders (using __PLACEHOLDER__ format to avoid React build processing)
  html = html.replace(/__UID_JS_SDK_URL_PLACEHOLDER__/g, uidJsSdkUrl);
  html = html.replace(/__PUBLIC_URL_PLACEHOLDER__/g, publicUrl);
  
  // Verify replacement worked - if placeholder still exists, log error
  if (html.includes('__UID_JS_SDK_URL_PLACEHOLDER__')) {
    console.error('ERROR: Placeholder __UID_JS_SDK_URL_PLACEHOLDER__ was not replaced in', indexPath);
  }
  
  // Inject runtime environment variables as a script tag
  // This allows the React app to read environment variables at runtime (for Kubernetes)
  const runtimeEnv = {
    REACT_APP_UID_JS_SDK_NAME: process.env.REACT_APP_UID_JS_SDK_NAME,
    REACT_APP_UID_CLIENT_BASE_URL: process.env.REACT_APP_UID_CLIENT_BASE_URL,
    REACT_APP_UID_SECURE_SIGNALS_SDK_URL: process.env.REACT_APP_UID_SECURE_SIGNALS_SDK_URL,
    REACT_APP_UID_SECURE_SIGNALS_STORAGE_KEY: process.env.REACT_APP_UID_SECURE_SIGNALS_STORAGE_KEY,
    REACT_APP_IDENTITY_NAME: process.env.REACT_APP_IDENTITY_NAME,
    REACT_APP_DOCS_BASE_URL: process.env.REACT_APP_DOCS_BASE_URL,
    REACT_APP_UID_CSTG_SUBSCRIPTION_ID: process.env.REACT_APP_UID_CSTG_SUBSCRIPTION_ID,
    REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY: process.env.REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY,
  };
  
  // Inject script tag before closing </head> tag
  const envScript = `<script>window.__REACT_APP_ENV__ = ${JSON.stringify(runtimeEnv)};</script>`;
  html = html.replace('</head>', `${envScript}</head>`);
  
  // Set content type explicitly
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}

// Route handlers for index - must be before static middleware
// These must be registered BEFORE express.static() to ensure they intercept index.html requests
app.get('/', serveIndexHtml);
app.get('/index.html', serveIndexHtml);

// Serve static files from build directory (production) or public (development)
// IMPORTANT: This must come AFTER the route handlers to ensure index.html is processed by serveIndexHtml
const buildPath = path.join(__dirname, 'build');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(buildPath)) {
  // Production: serve from build directory (but exclude index.html to use our handler)
  app.use(express.static(buildPath, {
    index: false // Don't serve index.html automatically
  }));
} else {
  // Development: serve from public directory
  app.use(express.static(publicPath, {
    index: false // Don't serve index.html automatically
  }));
}

// Catch-all handler for React Router (must be last, but excludes /ops/* routes)
app.get('*', (req, res, next) => {
  // Don't serve index.html for /ops/* routes
  if (req.path.startsWith('/ops/')) {
    console.log('Catch-all skipping /ops/ route:', req.path);
    return next();
  }
  serveIndexHtml(req, res);
});

app.listen(port, () => {
  const buildPath = path.join(__dirname, 'build');
  if (fs.existsSync(buildPath)) {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('Serving production build from build/ directory');
  } else {
    console.log(`Example app listening at http://localhost:${port}`);
    console.warn('WARNING: build/ directory not found. Serving from public/ directory.');
    console.warn('For production, run "npm run build" first.');
    console.warn('For development, use "npm run dev" instead.');
  }
});
