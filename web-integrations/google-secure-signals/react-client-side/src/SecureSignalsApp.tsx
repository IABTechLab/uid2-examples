import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles/app.css';
import './styles/ads.css';
declare global {
  interface Window {
    [key: string]: any;
    getAdvertisingToken: any;
    google: any;
    googletag: any;
  }
}

// Declare global variables
declare const google: any;

// Environment variables
const UID_JS_SDK_NAME = process.env.REACT_APP_UID_JS_SDK_NAME;
const UID_BASE_URL = process.env.REACT_APP_UID_CLIENT_BASE_URL;
const SECURE_SIGNALS_SDK_URL = process.env.REACT_APP_UID_SECURE_SIGNALS_SDK_URL;
const SECURE_SIGNALS_STORAGE_KEY = process.env.REACT_APP_UID_SECURE_SIGNALS_STORAGE_KEY;
const IDENTITY_NAME = process.env.REACT_APP_IDENTITY_NAME;
const DOCS_BASE_URL = process.env.REACT_APP_DOCS_BASE_URL;

const clientSideIdentityOptions = {
  subscriptionId: process.env.REACT_APP_UID_CSTG_SUBSCRIPTION_ID,
  serverPublicKey: process.env.REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY,
};

const SecureSignalsApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [secureSignalsLoaded, setSecureSignalsLoaded] = useState(false);
  const [secureSignalsValue, setSecureSignalsValue] = useState('undefined');
  const [targetedAdvertisingReady, setTargetedAdvertisingReady] = useState(false);
  const [advertisingToken, setAdvertisingToken] = useState('undefined');
  const [loginRequired, setLoginRequired] = useState(true);
  const [identityState, setIdentityState] = useState('');
  const [email, setEmail] = useState('');
  const [identity, setIdentity] = useState(null);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [isOptedOut, setIsOptedOut] = useState(false);

  // useRef hook to directly access DOM elements on the page
  const videoElementRef = useRef(null);
  const adContainerRef = useRef(null);
  const adDisplayContainerRef = useRef(null);
  const adsLoaderRef = useRef(null);
  const adsManagerRef = useRef(null);
  // Track whether user has attempted to generate a token
  const loginAttemptedRef = useRef(false);

  // Helper function to get SDK instance
  const getSDK = () => window[UID_JS_SDK_NAME];

  const updateElements = useCallback((status) => {
    const sdk = getSDK();
    const token = sdk.getAdvertisingToken();
    
    // Check for opt-out: only if user attempted login, and we got identity null with no token
    const optedOut = loginAttemptedRef.current && !token && status?.identity === null;
    setIsOptedOut(optedOut);

    if (sdk.getAdvertisingToken()) {
      setTargetedAdvertisingReady(true);
    } else {
      setTargetedAdvertisingReady(false);
    }
    setAdvertisingToken(String(sdk.getAdvertisingToken()));

    if (sdk.isLoginRequired() === true) {
      setLoginRequired(true);
      setIsLoggedIn(false);
    } else {
      setLoginRequired(false);
      setIsLoggedIn(true);
    }

    setIdentityState(String(JSON.stringify(status, null, 2)));

    // allow secure signals time to load
    setTimeout(updateSecureSignals, 500);
  }, []);

  const onIdentityUpdated = useCallback(
    (eventType, payload) => {
          console.log(`${IDENTITY_NAME} Callback`, payload);
      updateElements(payload);
    },
    [updateElements]
  );

  const initializeIMA = useCallback(() => {
    console.log('initializing IMA');

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
      // Instantiate the AdsManager from the adsLoader response and pass it the video element.
      let adsManager = adsManagerLoadedEvent.getAdsManager(videoElementRef.current);
      adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested
      );
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested
      );
      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdLoaded);
      adsManagerRef.current = adsManager;
    }

    //adContainerRef.current!.addEventListener('click', adContainerClick);
    adDisplayContainerRef.current = new google.ima.AdDisplayContainer(
      adContainerRef.current!,
      videoElementRef.current!
    );
    let adsLoader = new google.ima.AdsLoader(adDisplayContainerRef.current);
    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded,
      false
    );
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

    // Let the AdsLoader know when the video has ended
    videoElementRef.current!.addEventListener('ended', function () {
      adsLoader.contentComplete();
    });

    let adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl =
      'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElementRef.current!.clientWidth;
    adsRequest.linearAdSlotHeight = videoElementRef.current!.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElementRef.current!.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElementRef.current!.clientHeight / 3;

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);
    adsLoaderRef.current = adsLoader;
  }, []);

  const loadAds = useCallback(
    (event) => {
      // Prevent this function from running on if there are already ads loaded
      if (adsLoaded) {
        return;
      }
      setAdsLoaded(true);

      // Prevent triggering immediate playback when ads are loading
      event.preventDefault();

      console.log('loading ads');

      // Initialize the container. Must be done via a user action on mobile devices.
      videoElementRef.current!.load();
      adDisplayContainerRef.current!.initialize();

      let width = videoElementRef.current!.clientWidth;
      let height = videoElementRef.current!.clientHeight;
      try {
        adsManagerRef.current!.init(width, height, google.ima.ViewMode.NORMAL);
        adsManagerRef.current!.start();
      } catch (adError) {
        // Play the video without ads, if an error occurs
        console.log('AdsManager could not be started');
        videoElementRef.current!.play();
      }
    },
    [adsLoaded]
  );

  useEffect(() => {
    // Add callbacks for UID2/EUID JS SDK
    let sdk = getSDK();
    sdk = sdk || { callbacks: [] };
    sdk.callbacks.push(onIdentityUpdated);
    sdk.callbacks.push((eventType, payload) => {
      if (eventType === 'SdkLoaded') {
        sdk.init({
          baseUrl: UID_BASE_URL,
        });
      }
      if (eventType === 'InitCompleted') {
        if (sdk.isLoginRequired()) {
          sdk.setIdentity(identity);
          setIdentity(identity);
        }
      }
    });
  }, [identity, onIdentityUpdated]);

  useEffect(() => {
    // initialize ads manager
    initializeIMA();
    // videoElementRef.current!.addEventListener('play', function (event) {
    //   loadAds(event);
    // });

    // add event listener for resize
    window.addEventListener('resize', function (event) {
      console.log('window resized');
      if (adsManagerRef.current) {
        let width = videoElementRef.current!.clientWidth;
        let height = videoElementRef.current!.clientHeight;
        adsManagerRef.current.resize(width, height, google.ima.ViewMode.NORMAL);
      }
    });
  }, [initializeIMA, loadAds]);

  function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if (adsManagerRef.current) {
      adsManagerRef.current.destroy();
    }
  }

  function onContentPauseRequested() {
    videoElementRef.current!.pause();
  }

  function onContentResumeRequested() {
    videoElementRef.current!.play();
  }

  function handleAdContainerClick(event) {
    console.log('ad container clicked');
    if (videoElementRef.current!.paused) {
      videoElementRef.current!.play();
    } else {
      videoElementRef.current!.pause();
    }
  }

  function onAdLoaded(adEvent) {
    let ad = adEvent.getAd();
    if (!ad.isLinear()) {
      videoElementRef.current!.play();
    }
  }

  const loadSecureSignals = () => {
    const script2 = document.createElement('script');
    script2.src = SECURE_SIGNALS_SDK_URL;
    script2.async = true;
    script2.onload = () => {
      console.log('secure signals script loaded');
    };
    document.body.append(script2);
  };

  const handleLogin = async () => {
    window.googletag.secureSignalProviders.clearAllCache();
    loginAttemptedRef.current = true; // Mark that user attempted to generate a token

    try {
      const sdk = getSDK();
      await sdk.setIdentityFromEmail(email, clientSideIdentityOptions);
      loadSecureSignals();
    } catch (e) {
      console.error('setIdentityFromEmail failed', e);
    }
  };

  const handleLogout = () => {
    window.googletag.secureSignalProviders.clearAllCache();
    const sdk = getSDK();
    sdk.disconnect();
    loginAttemptedRef.current = false; // Reset flag
    setIsOptedOut(false);
  };

  const handleTryAnother = () => {
    window.googletag.secureSignalProviders.clearAllCache();
    const sdk = getSDK();
    sdk.disconnect();
    setEmail('');
    loginAttemptedRef.current = false; // Reset flag
    setIsOptedOut(false);
  };

  const handlePlay = () => {
    // Handle play button functionality for video
    videoElementRef.current!.play();
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const updateSecureSignals = () => {
    const secureSignalsStorage = localStorage[SECURE_SIGNALS_STORAGE_KEY];
    const secureSignalsStorageJson = secureSignalsStorage && JSON.parse(secureSignalsStorage);
    if (secureSignalsStorageJson && secureSignalsStorageJson[1]) {
      setSecureSignalsLoaded(true);
      setSecureSignalsValue(JSON.stringify(secureSignalsStorageJson, null, 2));
    } else {
      setSecureSignalsLoaded(false);
      setSecureSignalsValue('undefined');
    }
  };

  return (
    <div>
      <h1>
        React Client-Side {IDENTITY_NAME} SDK Integration Example with Google Secure Signals
      </h1>
      <p>
        This example demonstrates how a content publisher can follow the{' '}
        <a href={`${DOCS_BASE_URL}/guides/integration-javascript-client-side`}>
          Client-Side Integration Guide for JavaScript
        </a>{' '}
          to implement {IDENTITY_NAME} integration and generate {IDENTITY_NAME} tokens. Secure Signals is updated when the
        page is reloaded. Reload the page in order to update Secure Signals in local storage.
      </p>

      <div id='page-content'>
        <div id='video-container'>
          <video id='video-element' ref={videoElementRef} onClick={handlePlay}>
            <source src='https://storage.googleapis.com/interactive-media-ads/media/android.mp4' />
            <source src='https://storage.googleapis.com/interactive-media-ads/media/android.webm' />
          </video>
          <div id='ad-container' ref={adContainerRef} onClick={handleAdContainerClick}></div>
        </div>
        <button id='play-button' onClick={handlePlay}>
          Play
        </button>
      </div>

      <div className='product-tables'>
        <table id='uid2_state'>
          <thead>
            <tr>
              <th>{IDENTITY_NAME} Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='label'>Ready for Targeted Advertising:</td>
              <td className='value'>
                <pre>{targetedAdvertisingReady ? 'yes' : 'no'}</pre>
              </td>
            </tr>
            <tr>
                      <td className='label'>{IDENTITY_NAME} Advertising Token:</td>
              <td className='value'>
                <pre>{advertisingToken}</pre>
              </td>
            </tr>
            <tr>
                      <td className='label'>Is {IDENTITY_NAME} Login Required?</td>
              <td className='value'>
                <pre>{loginRequired ? 'yes' : 'no'}</pre>
              </td>
            </tr>
            <tr>
                      <td className='label'>{IDENTITY_NAME} Identity Callback State:</td>
              <td className='value'>
                <pre>{identityState}</pre>
              </td>
            </tr>
            <tr>
              <td className='label'>Secure Signals Loaded?</td>
              <td className='value'>
                <pre>{secureSignalsLoaded ? 'yes' : 'no'}</pre>
              </td>
            </tr>
            <tr>
              <td className='label'>Secure Signals Value:</td>
              <td className='value'>
                <pre>{secureSignalsValue}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isOptedOut ? (
        <>
          <div id='optout_banner' style={{ border: '3px solid #ffc107', padding: '15px', margin: '20px 0' }}>
                <p style={{ margin: 0 }}>The email address you entered has opted out of {IDENTITY_NAME}.</p>
          </div>
          <div id='optout_message' className='form'>
            <button type='button' className='button' onClick={handleTryAnother}>
              Try Another Email
            </button>
          </div>
        </>
      ) : !isLoggedIn ? (
        <div id='login_form' className='form'>
          <div className='email_prompt'>
            <input
              type='text'
              id='email'
              name='email'
              placeholder='Enter an email address'
              style={{ borderStyle: 'none' }}
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <button type='button' className='button' onClick={handleLogin}>
                  Generate {IDENTITY_NAME}
            </button>
          </div>
        </div>
      ) : (
        <div id='logout_form' className='form'>
          <form>
            <button type='button' className='button' onClick={handleLogout}>
                  Clear {IDENTITY_NAME}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SecureSignalsApp;
