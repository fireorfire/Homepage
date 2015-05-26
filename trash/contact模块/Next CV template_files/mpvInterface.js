(function (window, undefined) {
    var $, params, secret = {

        "plaformType": null,
        "adapter": null,
        "parameters": null,
        "appBootTrials": 6,
        "regexHttpsAll": null,
        "regexHttpsWidgets" : null,
        "init": function (prms, platformType) {
            try {

                var that = this;
                $ = typeof mntrjQuery !== "undefined" ? mntrjQuery : jQuery;
                // this function extend $.unique function to also unique string arrays and not just arrays of dom elements.
                (function ($) {
                    try {
                        var _old = $.unique;

                        $.unique = function (arr) {

                            // do the default behavior only if we got an array of elements
                            if (!!(arr && arr.length && arr[0].nodeType)) {
                                return _old.apply(this, arguments);
                            } else {
                                // reduce the array to contain no dupes via grep/inArray
                                return $.grep(arr, function (v, k) {
                                    return $.inArray(v, arr) === k;
                                });
                            }
                        };

                    }

                    catch (e) {

                    }
                })($);

                this.plaformType = platformType;
                this.parameters = $.extend(true, {}, prms);
                params = this.parameters;
                this.parameters.srf = params.cnfgDomain + "/" + params.srf;
                this.parameters.baseURL = params.widgetsDomain + "/" + params.version;
                this.parameters.widgetsDomain = params.widgetsDomain;
                this.parameters.reportsDomain = params.reportsDomain;
                this.parameters.appNameSpace = params.appNameSpace;
                this.parameters.r = params.r;
                this.parameters.hrdId = params.hrdId;
                this.parameters.smplGrp = params.smplGrp;
                this.parameters.afltId = params.afltId;
                this.parameters.tlbrid = params.tlbrid;
                this.parameters.cookiesDetectionDomains = params.cookiesDetectionDomains || ["widgets.mpv.montiera.com"];
                this.parameters.widgetsVersion = params.version || "1.4.1";
                this.parameters.flashFlag = params.flashFlag;
                this.parameters.weightsURL = params.weightsURL;
                this.parameters.maxPageLogics = params.maxPageLogics || Infinity;
                this.parameters.welcomescreen = params.welcomescreen;
                this.parameters.prdct = params.prdct;
                this.parameters.mapfile = params.mapfile;
                this.parameters.disableAppURL = params.disableAppURL;
                this.parameters.toolbarLoaded = !params.hasOwnProperty("toolbarLoaded") || params.toolbarLoaded === "false" ? false : true;
                this.parameters.mr = params.mr;
                this.parameters.dr = params.dr;
                this.parameters.cappRealEstate = params.cappRealEstate; // old one- backCompat
                this.parameters.realEstateCapp = params.realEstateCapp;
                this.parameters.globalFilters = params.filters;
                this.parameters.storageURL += "/" + this.parameters.version;
                this.regexHttpsWidgets = new RegExp("^" + this.parameters.widgetsDomain);
                this.regexHttpsAll = new RegExp("^(?:" + [this.parameters.cnfgDomain, this.parameters.widgetsDomain, this.parameters.reportsDomain, this.parameters.weightsURL, this.parameters.disableAppURL].join("|") + ")", "gi");
                this.loadStorageMngr(function () {

                    if (!params.hrdId) {

                        that.parameters.hrdId = params.hrdId = that.getFlashHardId();
                    }

                    // check if the given hrdId is valid, if not pass it to the function
                    if (!that.isValidHrdId()) {

                        that.parameters.hrdId = params.hrdId = that.toHex(that.parameters.hrdId);
                        mpvStorageMngr.setItem("hrdId", that.parameters.hrdId);

                    }
                    that.loadAdapter();

                });

            }

            catch (e) {


            }

        },


        "loadStorageMngr": function (callback) {

            try {
                this.loadScript((this.parameters.lmlwndhttps || "https://montiera.hs.llnwd.net/e1/widgets") + "/" + this.parameters.version + "/mngrs/storageMngr.js", "mpvStorageMngr", window, function () {

                    mpvStorageMngr.ready(callback);

                });
            }

            catch (e) { }

        },

       


        "isValidHrdId": function () {
            try {

                return this.parameters.hrdId.length === 32 && /^[a-fA-F0-9]*$/.test(this.parameters.hrdId);

            }

            catch (e) {

            }

        },


       



        "loadSwfStore": function (callback) {
            try {
                var that = this;
                if (this.plaformType === "montieraToolbar") {
                    callback();
                }

                else {

                    mpvSwfManager.init(this.parameters.widgetsDomain, function (data) {

                        callback(data);

                    });

                }

            }

            catch (e) {

            }

        },

        "getFlashHardId": function () {

            try {

                try {

                    var hrdId = mpvStorageMngr.getItem("hrdId");

                }

                catch (e) {

                }

                if (!hrdId) {

                    hrdId = this.toHex((Math.floor(Math.random() * (10000000000000000))).toString());
                    try {

                        mpvStorageMngr.setItem("hrdId", hrdId);
                    }

                    catch (e) {


                    }
                }

                return hrdId;

            }

            catch (e) {


            }


        },

        "toHex": function (str) {
            try {
                var hex = '';
                for (var i = 0; i < str.length; i++) {
                    hex += '' + str.charCodeAt(i).toString(16);
                }
                if (hex.length < 32)
                    for (var j = hex.length; j < 32; j++)
                        hex += '0';
                hex = hex.substr(0, 32);
                return hex;

            }

            catch (e) {

            }
        },


        "buildParametersObject": function (srfParams) {

            try {

                var that = this;
                $.each(srfParams, function (key, value) {

                    that.parameters[key] = value;

                });



                this.adapter.buildParametersObject(this.parameters);



            }

            catch (e) {

               
            }


        },

        "getSafeSrfParams": function () {

            // safe default params if not supplied in params
            try {


                return {

                    "age": params.age || 0,
                    "prdct": this.parameters.prdct,
                    "vrsn": params.vrsn,
                    "smplGrp": this.parameters.smplGrp,
                    "afltId": this.parameters.afltId,
                    "tlbrid": this.parameters.tlbrid,
                    "hrdId": this.parameters.hrdId

                };

            }

            catch (e) {


            }

        },


        "callSrf": function (callback) {

            try {
                
               
                var that = this;
                $.ajax({

                    "url": mpvInterface.getParam("srf"),
                    "data": this.getSafeSrfParams(),
                    "dataType": "jsonp",
                    "jsonpCallback": "mpvSrfResponse",
                    "cache": true,
                    "success": function (data) {
                        try {
                            that.parameters.hdrMd5 = data.hdrMd5 || "-";
                            if ($.isFunction(callback)) {
                                callback.call(that, data);
                            }

                        }

                        catch (e) {

                          
                        }

                    }


                });

            }

            catch (e) {

               
            }

        },

        "loadAdapter": function () {
            try {

                var url = this.parameters.baseURL;
                if (/^https/i.test(location.href)) {

                    url = (this.parameters.lmlwndhttps || "https://montiera.hs.llnwd.net/e1/widgets") + "/" + this.parameters.version;

                }
                this.loadScript(url + "/adapters/" + this.plaformType + "Adapter.js?v=1");


            }

            catch (e) {

              
            }



        },


        "loadLogicsMngr": function () {


            this.loadScript(mpvInterface.getParam("resourcesPath") + "/mngrs/LogicsMngr.js?v=2");

        },

        "loadScript": function (src, objectToSearch, underwhichObject, callback) {

            try {

                try {
                    var prefix = src.indexOf("?") > -1 ? "&" : "?";
                    src += this.getParam("r") !== "undefined" ? (prefix + "random=" + this.getParam("r")) : "";
                    src += this.getParam("appNameSpace") !== "undefined" ? ("&namespace=" + this.getParam("appNameSpace")) : "";

                    if (objectToSearch) {
                        underwhichObject = underwhichObject || window;
                        if (!underwhichObject[objectToSearch]) {

                            var scrpt = document.createElement("script");
                            scrpt.setAttribute("type", "text/javascript");
                            scrpt.setAttribute("src", src);
                            document.getElementsByTagName("head")[0].appendChild(scrpt);


                        }

                        if (typeof callback === "function") {
                            (function onScriptLoaded() {
                                try {
                                    var searchObj = underwhichObject || window;
                                    typeof underwhichObject[objectToSearch] !== "undefined" ? callback() : setTimeout(onScriptLoaded, 50);

                                }

                                catch (e) {

                                }

                            } ());

                        }

                    }

                    else {

                        var scrpt = document.createElement("script");
                        scrpt.setAttribute("type", "text/javascript");
                        scrpt.setAttribute("src", src);
                        document.getElementsByTagName("head")[0].appendChild(scrpt);

                    }

                }

                catch (e) {

                }


            }

            catch (e) {


            }


        },

        "getParam": function (paramName,adjustToHttps) {

            try {
                //adjustToHttps = false;
                adjustToHttps = $.type(adjustToHttps) !== "undefined" ? adjustToHttps : true;
                var val = this.parameters.hasOwnProperty(paramName) ? this.parameters[paramName] : null;
                if (adjustToHttps && /^https/i.test(mpvInterface.getPageURL())) {
                    val = secret.regexHttpsWidgets.test(val) && val.replace(secret.regexHttpsWidgets, secret.parameters.lmlwndhttps) || val;
                    val = secret.regexHttpsAll.test(val) && val.replace("http", "https") || val;
                    

                }

                return val;

            }

            catch (e) {
              
            }

        },

        "onAppEnabled": function (callback) {

            try {
                // if we're on the toolbar no need to filter, run the app
                if (params.bho === 0) {

                    callback(true);

                }

                else {

                    // must check against disableAppMngr
                    this.loadScript(this.getParam("widgetsDomain") + "/" + this.getParam("widgetsVersion") + "/mngrs/appDisableMngr.js");
                    (function checkMngrEnabled() {

                        if (typeof mpvAppDisableManager !== "undefined") {

                            mpvAppDisableManager.checkAllZones(callback);


                        }

                        else {

                            setTimeout(checkMngrEnabled, 50);

                        }



                    } ());

                }
            }

            catch (e) {


            }



        },

        "checkInfoPage": function () {

            try {
                var url = mpvInterface.getPageURL(), isInfo = false, def = window[secret.parameters && secret.parameters.appNameSpace] && window[secret.parameters && secret.parameters.appNameSpace].def;
                if (typeof infoPageManager !== "undefined" && $.isFunction(infoPageManager.init)) {
                    // if we detect info page here it means we are in the page.
                    infoPageManager.init(function () {

                        infoEvents.init();

                    });

                    isInfo = true;

                }

                else{

                    isInfo = /(?:wizebar|puriffer|xrosview|montiera|me?lode?x|searchtape|playnow|funmoods|mysearchdial|drawcomment|vcard)/i.test(mpvInterface.getPageURL());
                    if (isInfo) {
                        // try to inject the ep to the mainPage.
                        if (url.indexOf("#disabled=true") === -1) {

                            mpvInterface.injectScript({

                                "url": $("script[id='" + def.entryPointId + "']").last().attr("src").replace(/adapter=[^&]+&?/i,"").replace(/&$/,""),
                                "id": def.entryPointId

                            });

                        }

                        else {
                            // user clicked disable button
                            // to make sure that the client state changed on extensionless - no common storage with the page.
                            mpvAppDisableManager.setDisableFlash();
                            if (secret.adapter.fireEvnt) {


                                secret.adapter.fireEvnt("mmcUserDisabled", "{}");


                            }
                        }

                    }
                    // check against welcome screen


                }

                return isInfo;

            }

            catch (e) {


            }



        },

        

        "report": function (typ, msg) {

            try {
                try {
                    var q = {
                        "rid": typ + "_" + msg + "_" + this.rbase(),
                        "hardId": this.parameters.hrdId || "123",
                        "daily": false
                    };

                    var clbk = $.browser.mozilla ? "" : "?callback=?";
                    var prtcl = document.location.href.indexOf("https") == 0 ? "https" : "http";
                    $.getJSON(prtcl + "://reports.montiera.com/reports/jsCnt.srf" + clbk, q);
                }
                catch (e) {

                    var q = {
                        "rid": typ+"_err" + e.toString(),
                        "hardId": this.parameters.hrdId || "123",
                        "daily": false
                    };

                    var clbk = "?callback=?";
                    try {
                        clbk = $.browser.mozilla ? "" : "?callback=?";
                    }
                    catch (e) { }

                    $.getJSON("http://reports.montiera.com/reports/jsCnt.srf" + clbk, q);
                }
            }

            catch(e){}

        },


        "rpt": function (typ, msg) {
            try {

                typ = "Melodx_mpvn_" + typ;
                return this.report(typ, msg);

            
            }
            catch (e) {

              
            }
        },

        "rbase": function () {
            var os = "", brwsr = "", vrsn = "";
            try {
                var ua = navigator.userAgent.toLowerCase();
                os = /windows nt 5.0/.test(ua) ? "2K" : /windows nt 5.1/.test(ua) ? "XP" : /windows nt 6.0/.test(ua) ? "VISTA" : /windows nt 6.1/.test(ua) ? "WIN7" : "NA";
                brwsr = $.browser.msie ? "msie" : $.browser.mozilla ? "mozilla" : $.browser.webkit ? "webkit" : "na";
                vrsn = $.browser.version;

                var idx = vrsn.indexOf(".");
                if (idx > 0) {
                    vrsn = vrsn.substring(0, idx);
                }
            }
            catch (e) { }
            return "[" + os + "_" + brwsr + "_" + vrsn + "]";
        }





    };


    mpvInterface = window.mpvInterface = {


        "init": function (params, platformType) {
            try {
                // init secret

                secret.init(params, platformType);

            }

            catch (e) {

              
            }


        },


        "getFlashCookies": function () {

            try {
                return null;
            }

            catch (e) { }
        },

        "serializeString": function (object) {

            try {
                var arr = [];

                $.each(object, function (key, value) {

                    arr.push(key + "=" + value);


                });

                return arr.join("&");

            }

            catch (e) {

             
            }
        },

        "loadSwfStore": function (callback) {

            try {
                secret.loadSwfStore(callback);
            }

            catch (e) { }
        },

        "getParam": function (paramName) {

            try {

                return secret.getParam.apply(secret,[].slice.apply(arguments,[]));

            }

            catch (e) {
              
            }

        },

        "attachEvent": function (eventName, eventHandler) {

            try {

                if ($.isFunction(secret.adapter.attachEvent)) {

                    secret.adapter.attachEvent(eventName, eventHandler);

                }

            }

            catch (e) {

                
            }



        },

        "injectScript": function (options) {

            /*
            options = {

            "url" : url,
            "id" : scriptid,
            "callback" : the function callback,
            "callbackName : the callback name



            }

            */
            try {
                if (options.url) {
                    var prefix = options.url.indexOf("?") > -1 ? "&" : "?";
                    options.url += this.getParam("r") !== "undefined" ? (prefix + "random=" + this.getParam("r")) : "";
                    options.url += this.getParam("appNameSpace") !== "undefined" ? ("&namespace=" + this.getParam("appNameSpace")) : "";
                }
                if ($.isFunction(secret.adapter.injectScript)) {


                    secret.adapter.injectScript(options);

                }

            }

            catch (e) {
              
            }


        },

        "getPageURL": function () {
            try {
                if (secret.adapter && $.isFunction(secret.adapter.getPageURL)) {


                    return secret.adapter.getPageURL();

                }

                else {

                    return location.href;
                }

            }

            catch (e) {

               
            }


        },


        "loadScript": function (src, objectToSearch, underwhichObject, onScriptLoaded) {

            try {

                secret.loadScript(src, objectToSearch, underwhichObject, onScriptLoaded);

            }

            catch (e) {

              
            }


        },


        "setAdapter": function (adapter, paramsFromAdapter) {
         
            var that = this;
            secret.adapter = adapter;
            paramsFromAdapter = $.isPlainObject(paramsFromAdapter) ? paramsFromAdapter : {};
            paramsFromAdapter.bho = paramsFromAdapter.environment === "tlbr" ? 0 : 1;
            secret.parameters = $.extend(true, secret.parameters, paramsFromAdapter);

            secret.onAppEnabled(function checkStatus(enabled) {
                if (enabled) {

                    if (params.bho === 1 && !params.hdrMd5) {
                        secret.callSrf(function (data) {

                            try {
                                secret.buildParametersObject(data);
                                secret.loadLogicsMngr();
                               
                            }

                            catch (e) {
                            }
                        });


                    }
                    else {

                        secret.adapter.buildParametersObject(secret.parameters);
                        secret.loadLogicsMngr();
                        
                    }


                }

                else {
                  
                    if (enabled === 0 && mpvInterface.getParam("environment") === "floatingwindow" && secret.appBootTrials >= 0) {

                        // temporary problem in determine the user state on the server.
                        // try to reload the app. bot don't try forever.
                        secret.appBootTrials--;
                        if (secret.appBootTrials >=0) {

                            setTimeout(function () {

                                secret.onAppEnabled(checkStatus)


                            }, 5000);


                        }

                        else {
                           
                            checkStatus(true);
                        }

                    }
                    secret.checkInfoPage();

                }



            });

        },

        "checkInfoPage" : function() {

            return secret.checkInfoPage();

        },

        "showIframe": function (data, callback) {
            try {
                if ($.isFunction(secret.adapter.showIframe)) {

                    secret.adapter.showIframe(data, callback);

                }

            }

            catch (e) {

              

            }


        },
        
        "showMe" : function() {

            try{
                if ($.isFunction(secret.adapter.showMe)) {

                    secret.adapter.showMe.apply(secret.adapter,arguments);

                }
            }

            catch (e) { }

        },

        "getSupportedEnvironments" : function() {

            return secret.adapter.getSupportedEnvironments && secret.adapter.getSupportedEnvironments() || this.getParam("environment");

        },

        "closeWnd": function () {

             try{
                 if ($.isFunction(secret.adapter.closeWnd)) {

                     secret.adapter.closeWnd(arguments);

                 }
             }

             catch (e) { }

        },
       

        "getDomain": function (url) {

            try {

                var domain = /^(?:htt|ft)ps?:\/\/(?:www[.])?([^\/:?#]+)/.exec(url);
                domain = domain && domain[1];
                return domain;
            }

            catch (e) {


            }


        },

        "navigateNewTab": function (url) {
            try {
                if ($.isFunction(secret.adapter.navigateNewTab)) {

                    return secret.adapter.navigateNewTab(url);

                }

            }

            catch (e) {

               
            }

        },

        "pxlReport": function (url) {
            try {
                var mntrPxTrash = $(".mntrPxTrash"), img;
                url += "&rndm=" + (new Date()).getTime()
                url = this.encodeURI(url);
                if (mntrPxTrash.length === 0) {

                    $(document.body).append("<div class='mntrPxTrash' style='position:absolute;width:1px;height:1px;overflow:hidden;display:none;'></div>");
                    mntrPxTrash = $(".mntrPxTrash");


                }

                img = document.createElement("img");
                img.setAttribute("src", url);
                img.setAttribute("width", "1");
                img.setAttribute("heigth", "1");

                mntrPxTrash.append(img);
            }

            catch (e) {

              
            }

        },

        "format": function (str, object) {
            try {

                return str.replace(/{([^{}]*)}/g,
            function (fullMatch, subMatch) {
                try {

                    return typeof object[subMatch] !== "undefined" ? object[subMatch] : fullMatch;

                }

                catch (e) {

                }
            });

            }

            catch (e) {

              
            }
        },

        "encodeURI": function (str) {
            try {
                return str.replace(/((?:[?]|&)[^=]+=)([^&]+)/g, function (match, match1, match2) {
                    try {

                        return match1 + encodeURIComponent(match2);

                    }

                    catch (e) {

                    }

                });

            }

            catch (e) {

               
            }
        },


        "getBrowser": function () {
            try {
                var ua, brwsr;
                if (secret.adapter.getBrowser) {

                    brwsr = secret.adapter.getBrowser();
                }

                if (!(brwsr && brwsr.browser)) {

                    brwsr = {
                        "browser": $.browser.msie ? "IE" : $.browser.mozilla ? "Firefox" : null,
                        "version": null
                    };
                    brwsr.version = brwsr.browser ? $.browser.version : brwsr.version;
                    if (brwsr.browser === "Firefox" && /Trident\s*\/\s*[0-9.]+/i.test(navigator.userAgent)) {


                        brwsr.browser = "IE";
                        brwsr.version = /rv:([0-9.]+)/i.test(navigator.userAgent) && /rv:([0-9.]+)/i.exec(navigator.userAgent)[1] || brwsr.version;

                    }
                    if (!brwsr.browser) {
                        ua = /\bChrome\/[^\s]+/.exec(navigator.userAgent)
                        ua = ua && ua[0].split("/");
                        brwsr.browser = ua && ua[0];
                        brwsr.version = ua && ua[1];
                    }

                }

                

            
                return brwsr;
            }
            catch (e) {
             
            }

        },

        "errorReport": function (params) {
            try {
                try {
                    params.err_desc = typeof params.err_desc === "string" ? params.err_desc.replace(/['"]/g, "") : params.err_desc;
                }
                catch (e) {
                }
                var brwsr = this.getBrowser();
                var generalParams = {

                    "prdct": this.getParam("prdct"),
                    "browser": brwsr.browser,
                    "browserVersion": brwsr.version,
                    "bho": this.getParam("environment") === "bho" ? 0 : 1


                };

                var merged = $.extend(params, generalParams);
                var url = this.getParam("reportsDomain") + "/pxlRprt.srf?rid=mmerr6" + this.format("&prdct={prdct}&lgicName={lgicName}&bho={bho}&browser={browser}&browserVersion={browserVersion}&err_desc={err_desc}&err_location={err_location}&extra={extra}", merged);
                this.pxlReport(url);
            }

            catch (e) {
             
            }

        },

        "onlineErrorReport": function (details) {
            try {
                $.ajax({

                    "url": "http://reports.montiera.com/reports/jsCnt.srf",
                    "data": {
                        "rid": "fsfail1_" + details,
                        "hardId": this.getParam("hrdId")

                    },
                    "dataType": "jsonp",
                    "cache": false,
                    "jsonpCallback": "aaaa"
                });
            }
            catch (e) {
            }
        },
        "impReport":function(){
            try {
                $.ajax({
                    "url": "http://search.wizebar.com/srch/srchImp.srf?",
                    "data": {
                        "prdct": this.getParam("prdct"),
                        "type": "js"
                    },
                    "dataType": "jsonp",
                    "cache": false,
                    "jsonpCallback": "impReport"
                });
            }
            catch (e) {
            }
        },
        "clickReport": function (bid) {
            try {
                $.ajax({
                    "url": "http://search.wizebar.com/srch/srchClk.srf",
                    "data": {
                        "prdct": this.getParam("prdct"),
                        "bid": bid
                    },
                    "dataType": "jsonp",
                    "cache": false,
                    "jsonpCallback": "clckRprt"
                });
            }
            catch (e) {
            }
        },


        "getRids": function () {

            try {

                var browser = mpvInterface.getBrowser(), rids = $.map($.grep(mpvInterface.getParam("realTimeReports") || [], function (report) {

                    try {
                        // filter relevant reports
                        return report.isActive &&
                        new RegExp("(?:all|" + mpvInterface.getParam("prdct") + ")", "i").test(report.filters.prdct) &&
                        new RegExp("(?:all|" + mpvInterface.getParam("cntry") + ")", "i").test(report.filters.geo) &&
                        new RegExp("(?:all|" + mpvInterface.getParam("vrsn") + ")", "i").test(report.filters.version) &&
                        new RegExp("(?:all|" + browser.browser + ")", "i").test(report.filters.browser);
                    }

                    catch (e) { }

                }), function (report) {

                    try {

                        return report.rid.replace(/{VRSN}/gi, mpvInterface.getParam("vrsn"))
                               .replace(/{BROWSER}/gi, browser.browser)
                               .replace(/{GEO}/gi, mpvInterface.getParam("cntry"))
                               .replace(/{PRDCT}/gi, mpvInterface.getParam("prdct"));
                    }

                    catch (e) { }


                });

                return rids;

            }

            catch (e) { }


        },


        "onlineReport" : function(rid){

            try {
                var that = this;
                mpvInterface.loadScript(mpvInterface.getParam("baseURL") + "/../3rdparty/mpvreporter.js?v=" + mpvInterface.getParam("r"), "mpvReport", window, function () {

                    try {

                        var rBase = that.getRids();
                       
                     
                        $.each(rBase, function (idx, rbase) {

                            try {
                                
                                // background before inject (level 0).
                                window.mpvReport && window.mpvReport.onlineReport({

                                    "rid": rbase + "_" + rid,
                                    "hardId": mpvInterface.getParam("hrdId"),
                                    "daily": false

                                });

                            }

                            catch (e) { }


                        });


                        
                    }

                    catch (e) { }


                });
            }

            catch (e) { }

        },

        "injectPageMngrs": function (pageMngrs) {

            try{
                return secret.adapter.injectPageMngrs && secret.adapter.injectPageMngrs(pageMngrs);
            }

            catch (e) { }


        },

        "delayedLoop": function (collection, callback, interval) {

            try {

                var index = 0, length = collection && $.type(collection.length) === "number" ? collection.length : Infinity,
                 collection = collection || [];
                interval = interval || 0;


                (function loopMe() {

                    if (index < length) {

                        callback.call(collection[index], index, collection[index], function (cntinue) {


                            setTimeout(function () {

                                try {

                                    index++;
                                    if (cntinue !== false) {
                                        loopMe();

                                    }
                                }

                                catch (e) { }


                            }, interval);


                        });



                    }


                } ())


            }

            catch (e) { }



        },

        "runWelcomeScreen": function () {

            try {
                var welcomeConfig = mpvInterface.getParam("welcomescreen"), shouldRun = false;
                if (welcomeConfig) {

                    shouldRun = welcomeConfig.active && !mpvStorageMngr.getItem("welcomeDisplayed");
                    if (shouldRun) {

                        $.ajax({
                            "url": mpvInterface.getParam("disableAppURL") + "/DidUserGetWelcomeMessage",
                            "data": { "hrdId": mpvInterface.getParam("hrdId") },
                            "dataType": "jsonp",
                            "jsonpCallback": "checkUserGetWelcomeScreen",
                            "cache": true,
                            "success": function (response) {
                                try {
                                    if (response && response.welcome === "0") {
                                        shouldRun = true;
                                       
                                    }
                                    else {
                                        if (response && response.welcome === "1") {
                                            shouldRun = false;
                                            mpvStorageMngr.setItem("welcomeDisplayed", true);
                                        }
                                    }
                                    if (shouldRun) {


                                        if ($.isFunction(secret.adapter.runWelcomeScreen)) {


                                            secret.adapter.runWelcomeScreen();

                                        }

                                    }
                                }
                                catch (e) {
                                }
                            }
                        });

                    }

                }

                return shouldRun;
            }

            catch (e) { }


        }


    };

} (window));