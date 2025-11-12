import React, { useState, useEffect, useCallback } from 'react';
import './styles/app.css';

declare global {
  interface Window {
    [key: string]: any;
  }
}

// Environment variables - NO DEFAULTS
const UID_JS_SDK_URL = process.env.REACT_APP_UID_JS_SDK_URL;
const UID_JS_SDK_NAME = process.env.REACT_APP_UID_JS_SDK_NAME;
const UID_BASE_URL = process.env.REACT_APP_UID_CLIENT_BASE_URL;
const IDENTITY_NAME = process.env.REACT_APP_IDENTITY_NAME;
const DOCS_BASE_URL = process.env.REACT_APP_DOCS_BASE_URL;

const clientSideIdentityOptions = {
  subscriptionId: process.env.REACT_APP_UID_CSTG_SUBSCRIPTION_ID,
  serverPublicKey: process.env.REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY,
};

const ClientSideApp = () => {
  const [email, setEmail] = useState('');
  const [targetedAdvertisingReady, setTargetedAdvertisingReady] = useState('no');
  const [advertisingToken, setAdvertisingToken] = useState('undefined');
  const [loginRequired, setLoginRequired] = useState('yes');
  const [hasOptedOut, setHasOptedOut] = useState('no');
  const [updateCounter, setUpdateCounter] = useState(0);
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
      if (
        payload?.identity &&
        (eventType === 'InitCompleted' || eventType === 'IdentityUpdated')
      ) {
        setUpdateCounter((prev) => prev + 1);
      }
      updateGuiElements(payload);
    },
    [updateGuiElements]
  );

  // Load SDK script dynamically and initialize
  useEffect(() => {
    if (window[UID_JS_SDK_NAME]) {
      // SDK already loaded, initialize it
      const sdk = window[UID_JS_SDK_NAME];
      sdk.callbacks = sdk.callbacks || [];
      sdk.callbacks.push(onIdentityUpdated);
      if (sdk.init) {
        sdk.init({ baseUrl: UID_BASE_URL });
      }
      return;
    }

    // Load SDK script
    const script = document.createElement('script');
    script.src = UID_JS_SDK_URL;
    script.onload = () => {
      const sdk = window[UID_JS_SDK_NAME];
      if (sdk) {
        sdk.callbacks = sdk.callbacks || [];
        sdk.callbacks.push(onIdentityUpdated);
        sdk.init({ baseUrl: UID_BASE_URL });
      }
    };
    document.head.appendChild(script);
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
    <div>
      <h1>React Client-Side {IDENTITY_NAME} Integration Example using JavaScript SDK</h1>
      <p>
        This example demonstrates how a content publisher can follow the{' '}
        <a href={`${DOCS_BASE_URL}/guides/integration-javascript-client-side`}>
          Client-Side Integration Guide for JavaScript
        </a>{' '}
        to implement {IDENTITY_NAME} integration and generate {IDENTITY_NAME} tokens.{' '}
        <strong>Note:</strong> This is a <em>test-only</em> integration environment—not for production
        use. It does not perform real user authentication or generate production-level tokens. Do not
        use real user data on this page.
      </p>

      <table id="uid2_state">
        <tbody>
          <tr>
            <td className="label">Ready for Targeted Advertising:</td>
            <td className="value">
              <pre>{targetedAdvertisingReady}</pre>
            </td>
          </tr>
          <tr>
            <td className="label">Advertising Token:</td>
            <td className="value">
              <pre>{advertisingToken}</pre>
            </td>
          </tr>
          <tr>
            <td className="label">Is Login Required?</td>
            <td className="value">
              <pre>{loginRequired}</pre>
            </td>
          </tr>
          <tr>
            <td className="label">Has opted out?</td>
            <td className="value">
              <pre>{hasOptedOut}</pre>
            </td>
          </tr>
          <tr>
            <td className="label">Identity Updated Counter:</td>
            <td className="value">
              <pre>{updateCounter}</pre>
            </td>
          </tr>
          <tr>
            <td className="label">Identity Callback State:</td>
            <td className="value">
              <pre>{identityState}</pre>
            </td>
          </tr>
        </tbody>
      </table>

      {showLoginForm ? (
        <div id="login_form" className="form">
          <div className="email_prompt">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter an email address"
              style={{ borderStyle: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button type="button" className="button" onClick={handleLogin}>
              Generate {IDENTITY_NAME}
            </button>
          </div>
        </div>
      ) : (
        <div id="logout_form" className="form">
          <button type="button" className="button" onClick={handleLogout}>
            Clear {IDENTITY_NAME}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientSideApp;

