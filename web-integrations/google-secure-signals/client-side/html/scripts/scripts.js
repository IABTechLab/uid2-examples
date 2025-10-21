const clientSideIdentityOptions = {
  subscriptionId: '${SUBSCRIPTION_ID}',
  serverPublicKey: '${SERVER_PUBLIC_KEY}',
};

// Track whether user has attempted to generate a token
let loginAttempted = false;

function updateGuiElements(state) {
  $('#targeted_advertising_ready').text(__uid2.getAdvertisingToken() ? 'yes' : 'no');
  const token = __uid2.getAdvertisingToken();
  $('#advertising_token').text(String(token));
  $('#login_required').text(
    __uid2.isLoginRequired() || __uid2.isLoginRequired() === undefined ? 'yes' : 'no'
  );
  $('#identity_state').text(String(JSON.stringify(state, null, 2)));

  const uid2LoginRequired = __uid2.isLoginRequired();
  
  // Check for opt-out: only if user attempted login, and we got identity null with no token
  const isOptedOut = loginAttempted && !token && state?.identity === null;
  
  if (isOptedOut) {
    $('#login_form').hide();
    $('#logout_form').hide();
    $('#optout_message').show();
    $('#optout_banner').show();
  } else if (uid2LoginRequired) {
    $('#login_form').show();
    $('#logout_form').hide();
    $('#optout_message').hide();
    $('#optout_banner').hide();
  } else {
    $('#login_form').hide();
    $('#logout_form').show();
    $('#optout_message').hide();
    $('#optout_banner').hide();
  }

  const secureSignalsStorage = localStorage['_GESPSK-uidapi.com'];
  if (token && !secureSignalsStorage) {
    //Token is valid but Secure Signals has not been refreshed. Reload the page.
    location.reload();
  }
  const secureSignalsStorageJson = secureSignalsStorage && JSON.parse(secureSignalsStorage);
  if (secureSignalsStorageJson && secureSignalsStorageJson[1]) {
    $('#secure_signals_loaded').text('yes');
    $('#secure_signals_value').text(JSON.stringify(secureSignalsStorageJson, null, 2));
  } else {
    $('#secure_signals_loaded').text('no');
    $('#secure_signals_value').text('undefined');
  }
}

function onUid2IdentityUpdated(eventType, payload) {
  console.log('UID2 Callback', payload);
  // allow secure signals time to load
  setTimeout(() => updateGuiElements(payload), 1000);
}

function onDocumentReady() {
  $('#logout').click(() => {
    window.googletag.secureSignalProviders.clearAllCache();
    __uid2.disconnect();
    loginAttempted = false; // Reset flag
  });

  $('#login').click(async () => {
    window.googletag.secureSignalProviders.clearAllCache();
    const email = $('#email').val();
    loginAttempted = true; // Mark that user attempted to generate a token

    try {
        await __uid2.setIdentityFromEmail(email, clientSideIdentityOptions);
    } catch (e) {
      console.error('setIdentityFromEmail failed', e);
    }
  });

  $('#try_another').click(() => {
    window.googletag.secureSignalProviders.clearAllCache();
    __uid2.disconnect();
    $('#email').val('');
    loginAttempted = false; // Reset flag
  });
}

window.__uid2 = window.__uid2 || {};
window.__uid2.callbacks = window.__uid2.callbacks || [];

window.__uid2.callbacks.push(onUid2IdentityUpdated);
window.__uid2.callbacks.push((eventType, payload) => {
  if (eventType === 'SdkLoaded') {
    window.__uid2.init({
      baseUrl: '${UID_BASE_URL}',
    });
    $(document).ready(() => {
      // Clear any existing identity on page load for clean state
      __uid2.disconnect();
      loginAttempted = false;
      
      onDocumentReady();
      // Always show login form on initial page load
      $('#login_form').show();
      $('#logout_form').hide();
      $('#optout_message').hide();
      $('#optout_banner').hide();
    });
  }
});
