import React, { useState, useEffect, useCallback } from 'react';
import './styles/app.css';

declare global {
  interface Window {
    [key: string]: any;
  }
}

// Extend Window interface for runtime environment variables
interface ReactAppEnv {
  [key: string]: string | undefined;
}

// Helper function to get environment variables from runtime (Kubernetes) or build-time
function getEnvVar(key: string): string | undefined {
  // First try runtime environment (injected by server.js for Kubernetes)
  if (typeof window !== 'undefined' && (window as any).__REACT_APP_ENV__) {
    const env = (window as any).__REACT_APP_ENV__ as ReactAppEnv;
    const value = env[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  // Fallback to build-time environment variable
  return process.env[key];
}

// Environment variables (read from runtime or build-time)
const UID_JS_SDK_NAME = getEnvVar('REACT_APP_UID_JS_SDK_NAME') || '__uid2';
const UID_BASE_URL = getEnvVar('REACT_APP_UID_CLIENT_BASE_URL');
const IDENTITY_NAME = getEnvVar('REACT_APP_IDENTITY_NAME') || 'UID2';
const DOCS_BASE_URL = getEnvVar('REACT_APP_DOCS_BASE_URL') || 'https://unifiedid.com/docs';

const clientSideIdentityOptions = {
  subscriptionId: getEnvVar('REACT_APP_UID_CSTG_SUBSCRIPTION_ID'),
  serverPublicKey: getEnvVar('REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY'),
};

const ClientSideApp = () => {
  const [email, setEmail] = useState('');
  const [targetedAdvertisingReady, setTargetedAdvertisingReady] = useState('no');
  const [advertisingToken, setAdvertisingToken] = useState('undefined');
  const [loginRequired, setLoginRequired] = useState('yes');
  const [hasOptedOut, setHasOptedOut] = useState('no');
  const [identityState, setIdentityState] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);

  const getSDK = () => window[UID_JS_SDK_NAME];

  const updateGuiElements = useCallback((state: any) => {
    const sdk = getSDK();
    
    setTargetedAdvertisingReady(sdk.getAdvertisingToken() ? 'yes' : 'no');
    setAdvertisingToken(String(sdk.getAdvertisingToken()));
    setLoginRequired(sdk.isLoginRequired() || sdk.isLoginRequired() === undefined ? 'yes' : 'no');
    setHasOptedOut(sdk.hasOptedOut() ? 'yes' : 'no');
    setIdentityState(String(JSON.stringify(state, null, 2)));
    
    if (sdk.isLoginRequired()) {
      setShowLoginForm(true);
    } else {
      setShowLoginForm(false);
    }
  }, []);

  // Callback for identity updates
  const onIdentityUpdated = useCallback(
    (eventType: string, payload: any) => {
      updateGuiElements(payload);
    },
    [updateGuiElements]
  );

  // Initialize SDK
  useEffect(() => {
    let sdk = getSDK();
    sdk = sdk || { callbacks: [] };
    sdk.callbacks.push(onIdentityUpdated);
    
    sdk.callbacks.push((eventType: string) => {
      if (eventType === 'SdkLoaded') {
        sdk.init({ baseUrl: UID_BASE_URL });
      }
    });

    if (sdk.init) {
      sdk.init({ baseUrl: UID_BASE_URL });
    }
  }, [onIdentityUpdated]);

  const handleLogin = async () => {
    try {
      await getSDK().setIdentityFromEmail(email, clientSideIdentityOptions);
    } catch (e) {
      console.error('setIdentityFromEmail failed', e);
    }
  };

  const handleLogout = () => {
    getSDK().disconnect();
    updateGuiElements(undefined);
  };

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <h1>React Client-Side {IDENTITY_NAME} Integration Example using JavaScript SDK</h1>
        <p>
          This example demonstrates how a content publisher can integrate {IDENTITY_NAME} using client-side token generation with React, where the SDK generates tokens directly in the browser using public credentials. For documentation, see the{' '}
          <a href={`${DOCS_BASE_URL}/guides/integration-javascript-client-side`}>
            Client-Side Integration Guide for JavaScript
          </a>. [<a href="https://github.com/IABTechLab/uid2-examples/tree/main/web-integrations/javascript-sdk/react-client-side">Source Code</a>]
        </p>

        {/* Generate/Clear buttons at the top for easy access */}
        {showLoginForm ? (
          <div id="login_form" className="form top-form">
            <div className="email_prompt">
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter an email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="button" className="button" onClick={handleLogin}>
                Generate {IDENTITY_NAME}
              </button>
            </div>
          </div>
        ) : (
          <div id="logout_form" className="form top-form">
            <button type="button" className="button" onClick={handleLogout}>
              Clear {IDENTITY_NAME}
            </button>
          </div>
        )}

        <h2>{IDENTITY_NAME} Integration Status</h2>
        <table id="uid_state">
          <tbody>
            <tr>
              <td className="label">
                <div className="tooltip-wrapper">
                  Ready for Targeted Advertising:
                  <div className="tooltip">
                    <span className="tooltip-trigger">?</span>
                    <div className="tooltip-content">
                      Indicates whether a valid {IDENTITY_NAME} token is present and can be used for personalized ad targeting.
                    </div>
                  </div>
                </div>
              </td>
              <td className="value">
                <pre>{targetedAdvertisingReady}</pre>
              </td>
            </tr>
            <tr>
              <td className="label">
                <div className="tooltip-wrapper">
                  Advertising Token:
                  <div className="tooltip">
                    <span className="tooltip-trigger">?</span>
                    <div className="tooltip-content">
                      The encrypted {IDENTITY_NAME} token that is passed to ad systems without exposing raw user identity. It is automatically refreshed by the SDK in the background when expired.
                    </div>
                  </div>
                </div>
              </td>
              <td className="value">
                <pre>{advertisingToken}</pre>
              </td>
            </tr>
            <tr>
              <td className="label">
                <div className="tooltip-wrapper">
                  Is Login Required?
                  <div className="tooltip">
                    <span className="tooltip-trigger">?</span>
                    <div className="tooltip-content">
                      Indicates whether a new {IDENTITY_NAME} token needs to be generated. Returns "yes" when no valid identity exists or the current identity has expired.
                    </div>
                  </div>
                </div>
              </td>
              <td className="value">
                <pre>{loginRequired}</pre>
              </td>
            </tr>
            <tr>
              <td className="label">
                <div className="tooltip-wrapper">
                  Has opted out?
                  <div className="tooltip">
                    <span className="tooltip-trigger">?</span>
                    <div className="tooltip-content">
                      Shows whether the user has exercised opt-out, in which case no advertising token may be generated or used.
                    </div>
                  </div>
                </div>
              </td>
              <td className="value">
                <pre>{hasOptedOut}</pre>
              </td>
            </tr>
            <tr>
              <td className="label">
                <div className="tooltip-wrapper">
                  Identity Callback State:
                  <div className="tooltip">
                    <span className="tooltip-trigger">?</span>
                    <div className="tooltip-content">
                      The complete identity object returned by the SDK. Contains the full {IDENTITY_NAME} identity data including refresh tokens and metadata.
                    </div>
                  </div>
                </div>
              </td>
              <td className="value">
                <pre>{identityState}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <aside className="sidebar">
        <h3>📋 How to Test</h3>
        
        <div className="section">
          <h4>Step 1: Generate {IDENTITY_NAME}</h4>
          <ul>
            <li>Enter an email address in the input field</li>
            <li>Click "Generate {IDENTITY_NAME}" button</li>
            <li>The SDK will initialize and request a token</li>
          </ul>
        </div>

        <div className="section">
          <h4>Step 2: Observe Token State</h4>
          <ul>
            <li>Watch "Ready for Targeted Advertising" change to "yes"</li>
            <li>Check the advertising token appears in the table</li>
            <li>Note "Is Login Required?" becomes "no"</li>
          </ul>
        </div>

        <div className="section">
          <h4>Step 3: Monitor Updates</h4>
          <ul>
            <li>Keep the page open to observe automatic token refreshes</li>
            <li>The SDK maintains the token in the background</li>
            <li>Identity state updates automatically as needed</li>
          </ul>
        </div>

        <div className="section">
          <h4>Step 4: Test Opt-Out</h4>
          <ul>
            <li>Try the special email: <strong>test@example.com</strong></li>
            <li>Observe "Has opted out?" changes to "yes"</li>
            <li>No advertising token is generated</li>
          </ul>
        </div>

        <div className="section">
          <h4>What's Happening?</h4>
          <ul>
            <li><strong>Client-Side Token Generation:</strong> The SDK generates tokens directly in the browser using your public credentials</li>
            <li><strong>Auto-Refresh:</strong> Tokens are automatically refreshed by the SDK in the background when expired</li>
            <li><strong>Local Storage:</strong> The SDK stores identity in localStorage (__uid2_advertising_token or __euid_advertising_token) for persistence across page loads</li>
          </ul>
        </div>

        <div className="note">
          <strong>Note:</strong> This is a test-only environment. Do not use real user data.
        </div>
      </aside>
    </div>
  );
};

export default ClientSideApp;
