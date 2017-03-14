var app = {
    // global vars
    autoShowInterstitial: false,
    progressDialog: document.getElementById("progressDialog"),
    spinner: document.getElementById("spinner"),
    weinre: {
        enabled: false,
        ip: '', // ex. http://192.168.1.13
        port: '', // ex. 9090
        targetApp: '' // ex. see weinre docs
    },

    // Application Constructor
    initialize: function () {
        if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    },
    // Must be called when deviceready is fired so AdMobAds plugin will be ready
    initAds: function () {
        var isAndroid = (/(android)/i.test(navigator.userAgent));
        var adPublisherIds = {
            android: {
                banner: 'ca-app-pub-5115586663575592/2138601865',
                interstitial: 'ca-app-pub-5115586663575592/6708402266'
            }
        };
        var admobid;

        if (isAndroid) {
            admobid = adPublisherIds.android;
        } else {
            admobid = adPublisherIds.ios;
        }
        if (window.admob) {
            admob.setOptions({
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                bannerAtTop: true, // set to true, to put banner at top
                overlap: false, // set to true, to allow banner overlap webview
                offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
                isTesting: true, // receiving test ads (do not test with real ads as your account will be banned)
                autoShowBanner: true, // auto show banners ad when loaded
                autoShowInterstitial: true // auto show interstitials ad when loaded
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    // Bind Event Listeners
    bindAdEvents: function () {
        if (window.admob) {
            document.addEventListener("orientationchange", this.onOrientationChange, false);
            document.addEventListener(admob.events.onAdLoaded, this.onAdLoaded, false);
            document.addEventListener(admob.events.onAdFailedToLoad, this.onAdFailedToLoad, false);
            document.addEventListener(admob.events.onAdOpened, function (e) { }, false);
            document.addEventListener(admob.events.onAdClosed, function (e) {document.getElementById("container").setAttribute('style', 'display:block;');
        }, false);
            document.addEventListener(admob.events.onAdLeftApplication, function (e) { }, false);
            document.addEventListener(admob.events.onInAppPurchaseRequested, function (e) { }, false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },

    // -----------------------------------
    // Events.
    // The scope of 'this' is the event.
    // -----------------------------------
    onOrientationChange: function () {
        app.onResize();
    },
    onDeviceReady: function () {
        var weinre,
            weinreUrl;

        document.removeEventListener('deviceready', app.onDeviceReady, false);

        if (app.weinre.enabled) {
            console.log('Loading weinre...');
            weinre = document.createElement('script');
            weinreUrl = app.weinre.ip + ":" + app.weinre.port;
            weinreUrl += '/target/target-script-min.js';
            weinreUrl += '#' + app.weinre.targetApp;
            weinre.setAttribute('src', weinreUrl);
            document.head.appendChild(weinre);
        }

        if (window.admob) {
            console.log('Binding ad events...');
            app.bindAdEvents();
            console.log('Initializing ads...');
            app.initAds();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    onAdLoaded: function (e) {
        if (window.admob && e.adType === window.admob.AD_TYPE.INTERSTITIAL) {
            if (app.autoShowInterstitial) {
                window.admob.showInterstitialAd();
            } else {
                alert("Interstitial is available. Click on 'Show Interstitial' to show it.");
            }
        }
    },
    onAdFailedToLoad: function (e) {
        alert("Could not load ad: " + JSON.stringify(e));
    },
    onResize: function () {
    },

    // -----------------------------------
    // App buttons functionality
    // -----------------------------------
    startBannerAds: function () {
        if (window.admob) {
            window.admob.createBannerView(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    removeBannerAds: function () {
        if (window.admob) {
            window.admob.destroyBannerView();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showBannerAds: function () {
        if (window.admob) {
            window.admob.showBannerAd(true, function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    hideBannerAds: function () {
        if (window.admob) {
            window.admob.showBannerAd(false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    requestInterstitial: function (autoshow) {
        if (window.admob) {
            app.autoShowInterstitial = autoshow;
            window.admob.requestInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showInterstitial: function () {
        if (window.admob) {
            window.admob.showInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showProgress: function (show) {
    }
};

