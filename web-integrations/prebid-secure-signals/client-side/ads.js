var videoElement;
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;

window.addEventListener('load', function(event) {
  videoElement = document.getElementById('video-element');
  if (videoElement) {
    initializeIMA();
    videoElement.addEventListener('play', function(event) {
      loadAds(event);
    });
    var playButton = document.getElementById('play-button');
    if (playButton) {
      playButton.addEventListener('click', function(event) {
        videoElement.play();
      });
    }
  }
});

window.addEventListener('resize', function(event) {
  if(adsManager) {
    var width = videoElement.clientWidth;
    var height = videoElement.clientHeight;
    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
  }
});

function initializeIMA() {
  console.log("Initializing Google IMA");
  adContainer = document.getElementById('ad-container');
  if (!adContainer) return;
  
  adContainer.addEventListener('click', adContainerClick);
  adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded,
    false);
  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError,
    false);

  videoElement.addEventListener('ended', function() {
    adsLoader.contentComplete();
  });

  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

  adsRequest.linearAdSlotWidth = videoElement.clientWidth;
  adsRequest.linearAdSlotHeight = videoElement.clientHeight;
  adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
  adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

  adsLoader.requestAds(adsRequest);
}

function loadAds(event) {
  if(adsLoaded) {
    return;
  }
  adsLoaded = true;

  event.preventDefault();

  console.log("Loading ads");

  videoElement.load();
  adDisplayContainer.initialize();

  var width = videoElement.clientWidth;
  var height = videoElement.clientHeight;
  try {
    adsManager.init(width, height, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    console.log("AdsManager could not be started");
    videoElement.play();
  }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  adsManager = adsManagerLoadedEvent.getAdsManager(videoElement);
  adsManager.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      onContentPauseRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      onContentResumeRequested);
  adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdLoaded);
}

function onAdError(adErrorEvent) {
  console.log(adErrorEvent.getError());
  if(adsManager) {
    adsManager.destroy();
  }
}

function onContentPauseRequested() {
  videoElement.pause();
}

function onContentResumeRequested() {
  videoElement.play();
}

function adContainerClick(event) {
  if(videoElement.paused) {
    videoElement.play();
  } else {
    videoElement.pause();
  }
}

function onAdLoaded(adEvent) {
  var ad = adEvent.getAd();
  if (!ad.isLinear()) {
    videoElement.play();
  }
}

