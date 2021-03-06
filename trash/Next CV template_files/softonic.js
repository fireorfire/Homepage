(function (window, undefined) {

    var def = {"appNameSpace":"softonicmpvNS","entryPointId":"softonicmpvep","srf":"xtn.srf","prdct":"softonicmpv","loader":"pagePlatformLoader","lmlwndhttps":"https://montiera.hs.llnwd.net/e1/widgets","cnfgDomain":"http://cnfg.montiera.com/cnfg","widgetsDomain":"http://widgets.xrosview.com/widgets","reportsDomain":"http://reports1.montiera.com/reports","weightsURL":"http://wghts.montiera.com/weights/weights.srf","disableAppURL":"http://boot.montiera.com/boot/tools.asmx","storageURL":"https://montiera.hs.llnwd.net/e1/widgets","version":"1.4.2","mapfile":"softonicBaseMap1.js","allowOnGlobalBlackList":true,"prdctLabel":"softonic","maxPageLogics":1000,"cookiesDetectionDomains":["widgets.xrosview.com"],"realEstateCapp":{"toaster":{"mindiff":"1","daily":"99999"},"toolbar":{"mindiff":"0","daily":"99999"},"inpage":{"mindiff":"0","daily":"99999"},"webToolbar":{"mindiff":"0","daily":"99999"},"searchSuggest":{"mindiff":"0","daily":"99999"},"transAdon":{"mindiff":"0","daily":"99999"},"learn":{"mindiff":"0","daily":"99999"},"popunder":{"mindiff":"30","daily":"99999"},"other":{"mindiff":"0","daily":"99999"},"default":{"mindiff":"0","daily":"999"}},"cappRealEstate":{"toaster":0,"toolbar":0,"inpage":0,"webToolbar":0,"searchSuggest":0,"transAdon":0,"learn":0,"popunder":0,"other":0,"default":0},"filters":{"levelOne":{"countries":{"type":"black","values":{}},"smplGrp":{"type":"black","values":{}},"tlbrId":{"type":"black","values":{}},"isActive":true}},"r":2349,"mr":436,"dr":11},

            entryPoint = {

                "loadScript": function (url, id) {
                    try {
                        var prefix = url.indexOf("?") > -1 ? "&" : "?";
                        url += def.r !== "undefined" ? (prefix + "random=" + def.r) : "";
                        url += "&namespace=" + def.appNameSpace;
                        url = /^https/i.test(location.href) && url.replace(def.widgetsDomain, def.lmlwndhttps) || url;
                        var scrpt = document.createElement("script");
                        scrpt.setAttribute("type", "text/javascript");
                        scrpt.setAttribute("src", url);
                        scrpt.setAttribute("id", id);
                        document.getElementsByTagName("head")[0].appendChild(scrpt);


                    } catch (e) {

                        try {
                            mmErrorReporter.sendErrorReport({


                                "err_desc": e,
                                "err_location": "entryPoint.loadScript()",
                                "extra": "softonic.js"

                            });
                        } catch (e) {

                        }

                    }


                },

                "boot": function () {
                    try {
                        var url, myParams, myElement;
                        if (typeof window[def.appNameSpace] === "undefined") {

                            window[def.appNameSpace] = {};
                            window[def.appNameSpace].def = def;
                            this.setCacheBusters();
                            myElement = document.getElementById(def.entryPointId);
                            myParams = myElement && myElement.getAttribute("src");
                            myParams = myParams && /[?].+/.exec(myParams)[0];
                            this.checkSecure(myParams);
                            def.loader = /[?&]loader=/.test(myParams) ? /[?&]loader=([^?&]+)/.exec(myParams)[1] : def.loader;
                            if (/[?&]adapter=/.test(myParams)) {
                                def.adapter = /[?&]adapter=([^?&]+)/.exec(myParams)[1];
                            }
                            url = def.widgetsDomain + "/" + def.version + "/loaders/" + def.loader + ".js?v=2";
                            this.loadScript(url, "mpvBootScript");


                        }



                    } catch (e) {

                        try {

                            try {
                                mmErrorReporter.sendErrorReport({


                                    "err_desc": e,
                                    "err_location": "entryPoint.boot()",
                                    "extra": "softonic.js"

                                });
                            } catch (e) {

                            }
                        } catch (e) {

                        }
                    }

                },

                "checkSecure": function (scriptParams) {

                    try {

                        if (/ssl=true/.test(scriptParams)) {

                            def.cnfgDomain = def.cnfgDomain.replace(/http:\/\/[^\/]+/i, def.sslDomain);
                            def.widgetsDomain = def.widgetsDomain.replace(/http:\/\/[^\/]+/i, def.sslDomain);
                            def.reportsDomain = def.reportsDomain.replace(/http:\/\/[^\/]+/i, def.sslDomain);
                            def.weightsURL = def.weightsURL.replace(/http:\/\/[^\/]+/i, def.sslDomain);
                        }

                    } catch (e) {


                    }


                },

                "setCacheBusters": function () {

                    try {

                        def.r = def.appNameSpace + (def.r || 0);
                        def.mr = def.appNameSpace + (def.mr || 0);
                        def.dr = def.appNameSpace + (def.dr || 0);

                    } catch (e) { }


                }

            };

    entryPoint.boot();


} (window));