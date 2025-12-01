require('dotenv').config({ path: '../../../.env' });

console.log('process.env', process.env);

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 3044;

// Healthcheck endpoint for Kubernetes probes - must be before all other routes and middleware
app.get('/ops/healthcheck', (req, res) => {
  console.log('Healthcheck endpoint hit');
  res.type('text/plain');
  res.status(200).send('healthy\n');
  return; // Explicit return to prevent further processing
});

// Helper function to serve index.html with environment variable replacement
function serveIndexHtml(req, res) {
  // Try build directory first (production), then public (development)
  let indexPath = path.join(__dirname, 'build', 'index.html');
  if (!fs.existsSync(indexPath)) {
    indexPath = path.join(__dirname, 'public', 'index.html');
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Replace environment variable placeholders
  const uidJsSdkUrl = process.env.REACT_APP_UID_JS_SDK_URL || 'https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js';
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Replace placeholders (using __PLACEHOLDER__ format to avoid React build processing)
  html = html.replace(/__UID_JS_SDK_URL_PLACEHOLDER__/g, uidJsSdkUrl);
  html = html.replace(/__PUBLIC_URL_PLACEHOLDER__/g, publicUrl);
  
  // Debug: log if replacement happened
  if (html.includes('__UID_JS_SDK_URL_PLACEHOLDER__')) {
    console.warn('Warning: Placeholder __UID_JS_SDK_URL_PLACEHOLDER__ was not replaced in', indexPath);
  }
  
  res.send(html);
}

// Route handler for index - must be before static middleware
app.get('/', serveIndexHtml);

// Serve static files from build directory (production) or public (development)
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
  console.log(`Example app listening at http://localhost:${port}`);
});
