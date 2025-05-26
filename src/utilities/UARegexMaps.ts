/* This is derivative of ua-parser.js as per the copyright notice below */
/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.37
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
Supports browser & node.js environment. 
Demo   : https://faisalman.github.io/ua-parser-js
Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

import type { RegexMaps } from "types/RegexMapType";

import { bnd, dev, eng, os, spc, vnd } from "./UAConstants";

const lower = (str: string) => str.toLowerCase();

/** Trims all whitespace from the supplied string, including multiple whitespaces within the string */
export const clean = (str: string) => str.replace(/^\s\s*/, spc.EMPTY).trim();

/** Regex maps */
export const regexMaps: RegexMaps = {
    browser: [
        {
            desc: "Chrome for Android/iOS",
            rgxs: [/\b(?:crmo|crios)\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.CHROME]]
        },
        {
            desc: "Microsoft Edge",
            rgxs: [/edg(?:e|ios|a)?\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.EDGE]]
        },
        {
            desc: "Opera, Presto based",
            rgxs: [
                /(opera mini)\/([-\w\.]+)/i,                        // Opera Mini
                /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, // Opera Mobi/Tablet
                /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i           // Opera
            ],
            props: [spc.NAME]
        },
        {
            desc: "Opera mini on iphone >= 8.0",
            rgxs: [/opios[\/ ]+([\w\.]+)/i],
            props: [[spc.NAME, bnd.OPERA + ' Mini']]
        },
        {
            desc: "Opera Webkit",
            rgxs: [/\bopr\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.OPERA]]
        },
        {
            desc: "Baidu",
            rgxs: [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
            props: [[spc.NAME, vnd.BAIDU]]
        },
        {
            desc: "Kindle",
            rgxs: [/(kindle)\/([\w\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "Lunascape/Maxthon/Netfront/Jasmine/Blazer",
            rgxs: [/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i],
            props: [spc.NAME]
        },
        {
            desc: "Avant/IEMobile/SlimBrowser", // Trident based
            rgxs: [/(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i],
            props: [spc.NAME]
        },
        {
            desc: "Internet Explorer",
            rgxs: [/(?:ms|\()(ie) ([\w\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon", // Webkit/KHTML based
            rgxs: [/(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "Heytap/Ovi", // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            rgxs: [/(heytap|ovi)browser\/([\d\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "Weibo",
            rgxs: [/(weibo)__([\d\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "UCBrowser",
            rgxs: [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
            props: [[spc.NAME, `UC${spc.BROWSER}`]]
        },
        {
            desc: "WeChat",
            rgxs: [
                /microm.+\bqbcore\/([\w\.]+)/i, // WeChat Desktop for Windows Built-in Browser
                /\bqbcore\/([\w\.]+).+microm/i,
                /micromessenger\/([\w\.]+)/i    // WeChat        
            ],
            props: [[spc.NAME, 'WeChat']]
        },
        {
            desc: "Konqueror",
            rgxs: [/konqueror\/([\w\.]+)/i],
            props: [[spc.NAME, 'Konqueror']]
        },
        {
            desc: "IE11",
            rgxs: [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
            props: [[spc.NAME, 'IE']]
        },
        {
            desc: "Yandex",
            rgxs: [/ya(?:search)?browser\/([\w\.]+)/i],
            props: [[spc.NAME, 'Yandex']]
        },
        {
            desc: "Smart Lenovo Browser",
            rgxs: [/slbrowser\/([\w\.]+)/i],
            props: [[spc.NAME, `Smart ${vnd.LENOVO} ${spc.BROWSER}`]]
        },
        {
            desc: "Avast/AVG Secure Browser",
            rgxs: [/(avast|avg)\/([\w\.]+)/i],
            props: [[spc.NAME, /(.+)/, `$1 Secure ${spc.BROWSER}`]]
        },
        {
            desc: "Firefox Focus",
            rgxs: [/\bfocus\/([\w\.]+)/i],
            props: [[spc.NAME, `${bnd.FIREFOX} Focus`]]
        },
        {
            desc: "Opera Touch",
            rgxs: [/\bopt\/([\w\.]+)/i],
            props: [[spc.NAME, `${bnd.OPERA} Touch`]]
        },
        {
            desc: "Coc Coc Browser",
            rgxs: [/coc_coc\w+\/([\w\.]+)/i],
            props: [[spc.NAME, 'Coc Coc']]
        },
        {
            desc: "Dolphin",
            rgxs: [/dolfin\/([\w\.]+)/i],
            props: [[spc.NAME, 'Dolphin']]
        },
        {
            desc: "Opera Coast",
            rgxs: [/coast\/([\w\.]+)/i],
            props: [[spc.NAME, `${bnd.OPERA} Coast`]]
        },
        {
            desc: "Xiaomi MIUI Browser",
            rgxs: [/miuibrowser\/([\w\.]+)/i],
            props: [[spc.NAME, `MIUI ${spc.BROWSER}`]]
        },
        {
            desc: "Firefox for iOS",
            rgxs: [/fxios\/([-\w\.]+)/i],
            props: [[spc.NAME, bnd.FIREFOX]]
        },
        {
            desc: "360",
            rgxs: [/\bqihu|(qi?ho?o?|360)browser/i],
            props: [[spc.NAME, `360 ${spc.BROWSER}`]]
        },
        {
            desc: "Oculus/Sailfish/HuaweiBrowser/VivoBrowser",
            rgxs: [/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i],
            props: [[spc.NAME, /(.+)/, `$1 ${spc.BROWSER}`]]
        },
        {
            desc: "Samsung Internet",
            rgxs: [/samsungbrowser\/([\w\.]+)/i],
            props: [[spc.NAME, `${vnd.SAMSUNG} Internet`]]
        },
        {
            desc: "Comodo Dragon",
            rgxs: [/(comodo_dragon)\/([\w\.]+)/i],
            props: [[spc.NAME, /_/g, ' ']]
        },
        {
            desc: "Sogou Explorer",
            rgxs: [/metasr[\/ ]?([\d\.]+)/i],
            props: [[spc.NAME, 'Sogou Explorer']]
        },
        {
            desc: "Sogou Mobile",
            rgxs: [/(sogou)mo\w+\/([\d\.]+)/i],
            props: [[spc.NAME, 'Sogou Mobile']]
        },
        {
            desc: "Electron based",
            rgxs: [
                /(electron)\/([\w\.]+) safari/i,                    // Electron-based App
                /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,   // Tesla
                /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i        // QQBrowser/2345 Browser        
            ],
            props: [spc.NAME]
        },
        {
            desc: "LieBao Browser",
            rgxs: [/(lbbrowser)/i],
            props: [spc.NAME]
        },
        {
            desc: "LinkedIn App for iOS & Android",
            rgxs: [/\[(linkedin)app\]/i],
            props: [spc.NAME]
        },
        // WebView
        {
            desc: "Facebook App for iOS & Android",
            rgxs: [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
            props: [[spc.NAME, vnd.FACEBOOK]]
        },
        {
            desc: "WebView based",
            rgxs: [
                /(Klarna)\/([\w\.]+)/i,                         // Klarna Shopping Browser for iOS & Android
                /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,         // Kakao App
                /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,              // Naver InApp
                /safari (line)\/([\w\.]+)/i,                    // Line App for iOS
                /\b(line)\/([\w\.]+)\/iab/i,                    // Line App for Android
                /(alipay)client\/([\w\.]+)/i,                   // Alipay
                /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i // Chromium/Instagram/Snapchat        
            ],
            props: [spc.NAME]
        },
        {
            desc: "Google Search Appliance on iOS",
            rgxs: [/\bgsa\/([\w\.]+) .*safari\//i],
            props: [[spc.NAME, 'GSA']]
        },
        {
            desc: "TikTok",
            rgxs: [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
            props: [[spc.NAME, 'TikTok']]
        },
        {
            desc: "Chrome Headless",
            rgxs: [/headlesschrome(?:\/([\w\.]+)| )/i],
            props: [[spc.NAME, bnd.CHROME + ' Headless']]
        },
        {
            desc: "Chrome WebView",
            rgxs: [/ wv\).+(chrome)\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.CHROME + ' WebView']]
        },
        {
            desc: "Android Browser",
            rgxs: [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
            props: [[spc.NAME, `Android ${spc.BROWSER}`]]
        },
        {
            desc: "Chrome/OmniWeb/Arora/Tizen/Nokia",
            rgxs: [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "Mobile Safari",
            rgxs: [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
            props: [[spc.NAME, 'Mobile Safari']]
        },
        {
            desc: "Safari & Safari Mobile",
            rgxs: [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
            props: [spc.VERSION, spc.NAME]
        },
        {
            desc: "Safari < 3.0",
            rgxs: [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
            props: [spc.NAME]
        },
        {
            desc: "webkit|khtml",
            rgxs: [/(webkit|khtml)\/([\w\.]+)/i],
            props: [spc.NAME]
        },
        // Gecko based
        {
            desc: "Netscape",
            rgxs: [/(navigator|netscape\d?)\/([-\w\.]+)/i],
            props: [[spc.NAME, 'Netscape']]
        },
        {
            desc: "Firefox Reality",
            rgxs: [/mobile vr; rv:([\w\.]+)\).+firefox/i],
            props: [[spc.NAME, bnd.FIREFOX + ' Reality']]
        },
        {
            desc: "Firefox based",
            rgxs: [
                /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
                /(swiftfox)/i,                                                      // Swiftfox
                /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
                /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
                /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
                /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla        
            ],
            props: [spc.NAME]
        },
        {
            desc: "Other",
            rgxs: [
                /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
                /(links) \(([\w\.]+)/i,                                             // Links
                /panasonic;(viera)/i                                                // Panasonic Viera
            ],
            props: [spc.NAME]
        },
        {
            desc: "Cobalt",
            rgxs: [/(cobalt)\/([\w\.]+)/i],
            props: [spc.NAME]
        },
    ],

    cpu: [
        {
            desc: "AMD64 (x64)",
            rgxs: [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
            props: [[spc.ARCHITECTURE, 'amd64']]
        },
        {
            desc: "IA32 (quicktime)",
            rgxs: [/(ia32(?=;))/i],
            props: [[spc.ARCHITECTURE, lower]]
        },
        {
            desc: "IA32 (x86)",
            rgxs: [/((?:i[346]|x)86)[;\)]/i],
            props: [[spc.ARCHITECTURE, 'ia32']]
        },
        {
            desc: "ARM64",
            rgxs: [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
            props: [[spc.ARCHITECTURE, 'arm64']]
        },
        {
            desc: "ARMHF",
            rgxs: [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
            props: [[spc.ARCHITECTURE, 'armhf']]
        },
        {
            desc: "PocketPC mistakenly identified as PowerPC",
            rgxs: [/windows (ce|mobile); ppc;/i],
            props: [[spc.ARCHITECTURE, 'arm']]
        },
        {
            desc: "PowerPC",
            rgxs: [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
            props: [[spc.ARCHITECTURE, /ower/, spc.EMPTY, lower]]
        },
        {
            desc: "SPARC",
            rgxs: [/(sun4\w)[;\)]/i],
            props: [[spc.ARCHITECTURE, 'sparc']]
        },
        {
            desc: "IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC",
            rgxs: [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],
            props: [[spc.ARCHITECTURE, lower]]
        },
    ],

    device: [
        // MOBILES & TABLETS
        {
            desc: "Samsung Tablet",
            rgxs: [/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SAMSUNG], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Samsung Mobile",
            rgxs: [
                /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
                /samsung[- ]([-\w]+)/i,
                /sec-(sgh\w+)/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.SAMSUNG], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Apple iPod/iPhone",
            rgxs: [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.APPLE], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Apple iPad",
            rgxs: [
                /\((ipad);[-\w\),; ]+apple/i,
                /applecoremedia\/[\w\.]+ \((ipad)/i,
                /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.APPLE], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Apple Mac",
            rgxs: [/(macintosh);/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.APPLE]]
        },
        {
            desc: "Sharp",
            rgxs: [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SHARP], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Huawei Tablet",
            rgxs: [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.HUAWEI], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Huawei Mobile",
            rgxs: [
                /(?:huawei|honor)([-\w ]+)[;\)]/i,
                /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.HUAWEI], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Xiaomi Mobile",
            rgxs: [
                /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
                /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
                /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
                /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
                /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
                /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ],
            props: [[spc.MODEL, /_/g, ' '], [spc.VENDOR, vnd.XIAOMI], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Xiaomi Tablet",
            rgxs: [
                /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
                /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],
            props: [[spc.MODEL, /_/g, ' '], [spc.VENDOR, vnd.XIAOMI], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "OPPO",
            rgxs: [
                /; (\w+) bui.+ oppo/i,
                /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.OPPO], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Vivo",
            rgxs: [
                /vivo (\w+)(?: bui|\))/i,
                /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.VIVO], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Realme",
            rgxs: [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.REALME], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Motorola Mobile",
            rgxs: [
                /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
                /\bmot(?:orola)?[- ](\w*)/i,
                /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.MOTOROLA], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Motorola Tablet",
            rgxs: [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
            props: [spc.MODEL, [spc.VENDOR, vnd.MOTOROLA], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "LG Tablet",
            rgxs: [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.LG], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "LG Mobile",
            rgxs: [
                /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
                /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
                /\blg-?([\d\w]+) bui/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.LG], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Lenovo",
            rgxs: [
                /(ideatab[-\w ]+)/i,
                /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.LENOVO], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Nokia",
            rgxs: [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
            props: [[spc.MODEL, /_/g, ' '], [spc.VENDOR, vnd.NOKIA], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Google Pixel C",
            rgxs: [/(pixel c)\b/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.GOOGLE], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Google Pixel",
            rgxs: [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.GOOGLE], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Sony Mobile",
            rgxs: [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SONY], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Sony Tablet",
            rgxs: [
                /sony tablet [ps]/i,
                /\b(?:sony)?sgp\w+(?: bui|\))/i
            ],
            props: [[spc.MODEL, 'Xperia Tablet'], [spc.VENDOR, vnd.SONY], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "OnePlus",
            rgxs: [
                / (kb2005|in20[12]5|be20[12][59])\b/i,
                /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.ONEPLUS], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Amazon",
            rgxs: [
                /(alexa)webm/i,
                /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, // Kindle Fire without Silk / Echo Show
                /(kf[a-z]+)( bui|\)).+silk\//i          // Kindle Fire HD
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.AMAZON], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Fire Phone",
            rgxs: [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
            props: [[spc.MODEL, /(.+)/g, 'Fire Phone $1'], [spc.VENDOR, vnd.AMAZON], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "BlackBerry PlayBook",
            rgxs: [/(playbook);[-\w\),; ]+(rim)/i],
            props: [spc.MODEL, spc.VENDOR, [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "BlackBerry 10",
            rgxs: [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.BLACKBERRY], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Asus Tablet",
            rgxs: [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ],
            props: [spc.MODEL, [spc.VENDOR, vnd.ASUS], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Asus Mobile",
            rgxs: [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ASUS], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "HTC Nexus 9",
            rgxs: [/(nexus 9)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.HTC], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "HTC/ ZTE/ Alcatel/GeeksPhone/Nexian/Panasonic/Sony",
            rgxs: [
                /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC
                // ZTE
                /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
                /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ],
            props: [spc.VENDOR, [spc.MODEL, /_/g, ' '], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Acer",
            rgxs: [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
            props: [spc.MODEL, [spc.VENDOR, 'Acer'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Meizu",
            rgxs: [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
            props: [spc.MODEL, [spc.VENDOR, 'Meizu'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Ulefone",
            rgxs: [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
            props: [spc.MODEL, [spc.VENDOR, 'Ulefone'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Mixed Mobile",
            rgxs: [
                /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
                /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
                /(asus)-?(\w+)/i,                                                   // Asus
                /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
                /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
                /(jolla)/i,                                                         // Jolla
                /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Mixed Tablet",
            rgxs: [
                /(kobo)\s(ereader|touch)/i,                                         // Kobo
                /(archos) (gamepad2?)/i,                                            // Archos
                /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
                /(kindle)\/([\w\.]+)/i,                                             // Kindle
                /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
                /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
                /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
                /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
                /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
                /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Surface Duo",
            rgxs: [/(surface duo)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.MICROSOFT], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Fairphone",
            rgxs: [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
            props: [spc.MODEL, [spc.VENDOR, 'Fairphone'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "AT&T",
            rgxs: [/(u304aa)/i],
            props: [spc.MODEL, [spc.VENDOR, 'AT&T'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Siemens",
            rgxs: [/\bsie-(\w*)/i],
            props: [spc.MODEL, [spc.VENDOR, 'Siemens'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "RCA Tablets",
            rgxs: [/\b(rct\w+) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'RCA'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Dell Venue Tablets",
            rgxs: [/\b(venue[\d ]{2,7}) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Dell'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Verizon Tablet",
            rgxs: [/\b(q(?:mv|ta)\w+) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Verizon'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Barnes & Noble Tablet",
            rgxs: [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Barnes & Noble'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "NuVision",
            rgxs: [/\b(tm\d{3}\w+) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'NuVision'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "ZTE K Series Tablet",
            rgxs: [/\b(k88) b/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ZTE], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "ZTE Nubia",
            rgxs: [/\b(nx\d{3}j) b/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ZTE], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Swiss GEN Mobile",
            rgxs: [/\b(gen\d{3}) b.+49h/i],
            props: [spc.MODEL, [spc.VENDOR, 'Swiss'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Swiss ZUR Tablet",
            rgxs: [/\b(zur\d{3}) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Swiss'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Zeki Tablets",
            rgxs: [/\b((zeki)?tb.*\b) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Zeki'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Dragon Touch Tablet",
            rgxs: [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
            props: [[spc.VENDOR, 'Dragon Touch'], spc.MODEL, [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Insignia Tablets",
            rgxs: [/\b(ns-?\w{0,9}) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Insignia'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "NextBook Tablets",
            rgxs: [/\b((nxa|next)-?\w{0,9}) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'NextBook'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Voice Xtreme Phones",
            rgxs: [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
            props: [[spc.VENDOR, 'Voice'], spc.MODEL, [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "LvTel Phones",
            rgxs: [/\b(lvtel\-)?(v1[12]) b/i],
            props: [[spc.VENDOR, 'LvTel'], spc.MODEL, [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Essential PH-1",
            rgxs: [/\b(ph-1) /i],
            props: [spc.MODEL, [spc.VENDOR, 'Essential'], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Envizen Tablets",
            rgxs: [/\b(v(100md|700na|7011|917g).*\b) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Envizen'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "MachSpeed Tablets",
            rgxs: [/\b(trio[-\w\. ]+) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'MachSpeed'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Rotor Tablets",
            rgxs: [/\btu_(1491) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Rotor'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Nvidia Shield Tablets",
            rgxs: [/(shield[\w ]+) b/i],
            props: [spc.MODEL, [spc.VENDOR, 'Nvidia'], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Sprint Phones",
            rgxs: [/(sprint) (\w+)/i],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Microsoft Kin",
            rgxs: [/(kin\.[onetw]{3})/i],
            props: [[spc.MODEL, /\./g, ' '], [spc.VENDOR, vnd.MICROSOFT], [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Zebra Tablet",
            rgxs: [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ZEBRA], [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Zebra Mobile",
            rgxs: [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ZEBRA], [spc.TYPE, dev.MOBILE]]
        },
        // SMARTTVS
        {
            desc: "Samsung",
            rgxs: [/smart-tv.+(samsung)/i],
            props: [spc.VENDOR, [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Samsung",
            rgxs: [/hbbtv.+maple;(\d+)/i],
            props: [[spc.MODEL, /^/, 'SmartTV'], [spc.VENDOR, vnd.SAMSUNG], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "LG SmartTV",
            rgxs: [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
            props: [[spc.VENDOR, vnd.LG], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Apple TV",
            rgxs: [/(apple) ?tv/i],
            props: [spc.VENDOR, [spc.MODEL, vnd.APPLE + ' TV'], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Google Chromecast",
            rgxs: [/crkey/i],
            props: [[spc.MODEL, bnd.CHROME + 'cast'], [spc.VENDOR, vnd.GOOGLE], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Fire TV",
            rgxs: [/droid.+aft(\w+)( bui|\))/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.AMAZON], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Sharp",
            rgxs: [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SHARP], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Sony",
            rgxs: [/(bravia[\w ]+)( bui|\))/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SONY], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Xiaomi",
            rgxs: [/(mitv-\w{5}) bui/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.XIAOMI], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "TechniSAT",
            rgxs: [/Hbbtv.*(technisat) (.*);/i],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "Roku / HbbTV devices",
            rgxs: [
                /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
                /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
            ],
            props: [[spc.VENDOR, clean], [spc.MODEL, clean], [spc.TYPE, dev.SMARTTV]]
        },
        {
            desc: "SmartTV from Unidentified Vendors",
            rgxs: [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
            props: [[spc.TYPE, dev.SMARTTV]]
        },
        // CONSOLES
        {
            desc: "Ouya / Nintendo",
            rgxs: [
                /(ouya)/i,
                /(nintendo) ([wids3utch]+)/i
            ],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.CONSOLE]]
        },
        {
            desc: "Nvidia",
            rgxs: [/droid.+; (shield) bui/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.NVIDIA], [spc.TYPE, dev.CONSOLE]]
        },
        {
            desc: "Playstation",
            rgxs: [/(playstation [345portablevi]+)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.SONY], [spc.TYPE, dev.CONSOLE]]
        },
        {
            desc: "Microsoft Xbox",
            rgxs: [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.MICROSOFT], [spc.TYPE, dev.CONSOLE]]
        },
        // WEARABLES
        {
            desc: "Pebble",
            rgxs: [/((pebble))app/i],
            props: [spc.VENDOR, spc.MODEL, [spc.TYPE, dev.WEARABLE]]
        },
        {
            desc: "Apple Watch",
            rgxs: [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.APPLE], [spc.TYPE, dev.WEARABLE]]
        },
        {
            desc: "Google Glass",
            rgxs: [/droid.+; (glass) \d/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.GOOGLE], [spc.TYPE, dev.WEARABLE]]
        },
        {
            desc: "Zebra",
            rgxs: [/droid.+; (wt63?0{2,3})\)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.ZEBRA], [spc.TYPE, dev.WEARABLE]]
        },
        {
            desc: "Oculus Quest",
            rgxs: [/(quest( 2| pro)?)/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.FACEBOOK], [spc.TYPE, dev.WEARABLE]]
        },
        // EMBEDDED
        {
            desc: "Tesla",
            rgxs: [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
            props: [spc.VENDOR, [spc.TYPE, dev.EMBEDDED]]
        },
        {
            desc: "Echo Dot",
            rgxs: [/(aeobc)\b/i],
            props: [spc.MODEL, [spc.VENDOR, vnd.AMAZON], [spc.TYPE, dev.EMBEDDED]]
        },
        // MIXED (GENERIC)
        {
            desc: "Android Phones from Unidentified Vendors",
            rgxs: [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],
            props: [spc.MODEL, [spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Android Tablets from Unidentified Vendors",
            rgxs: [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
            props: [spc.MODEL, [spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Unidentifiable Tablet",
            rgxs: [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
            props: [[spc.TYPE, dev.TABLET]]
        },
        {
            desc: "Unidentifiable Mobile",
            rgxs: [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],
            props: [[spc.TYPE, dev.MOBILE]]
        },
        {
            desc: "Generic Android Device",
            rgxs: [/(android[-\w\. ]{0,9});.+buil/i],
            props: [spc.MODEL, [spc.VENDOR, 'Generic']]
        }
    ],

    /** Rendering engine */
    engine: [
        {
            desc: "EdgeHTML",
            rgxs: [/windows.+ edge\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.EDGE + 'HTML']]
        },
        {
            desc: "Blink",
            rgxs: [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
            props: [[spc.NAME, eng.BLINK]]
        },
        {
            desc: "Others",
            rgxs: [
                /(presto)\/([\w\.]+)/i,                                             // Presto
                /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
                /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
                /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
                /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
                /\b(libweb)/i
            ],
            props: [spc.NAME]
        },
        {
            desc: "Gecko",
            rgxs: [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
            props: [[spc.NAME, eng.GECKO]]
        },
    ],

    os: [
        {
            desc: "Windows (iTunes)",
            rgxs: [/microsoft (windows) (vista|xp)/i],
            props: [spc.NAME]
        },
        {
            desc: "Windows Phone",
            rgxs: [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],
            props: [spc.NAME]
        },
        {
            desc: "Windows RT/XBox/Other",
            rgxs: [
                /windows nt 6\.2; (arm)/i,                  // Windows RT
                /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
                /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ],
            props: [[spc.NAME, 'Windows']]
        },
        // iOS/macOS
        {
            desc: "iOS/macOS",
            rgxs: [
                /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,  // iOS
                /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
                /cfnetwork\/.+darwin/i
            ],
            props: [[spc.NAME, 'iOS']]
        },
        {
            desc: "Mac",
            rgxs: [
                /(mac os x) ?([\w\. ]*)/i,
                /(macintosh|mac_powerpc\b)(?!.+haiku)/i // Mac OS
            ],
            props: [[spc.NAME, os.MAC_OS]]
        },
        // Mobile OSes
        {
            desc: "Android-x86/HarmonyOS",
            rgxs: [/droid [\w\.]+\b.+(android[- ]x86|harmonyos)/i],
            props: [spc.NAME]
        },
        {
            desc: "Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS",
            rgxs: [
                /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
                /(blackberry)\w*\/([\w\.]*)/i,  // Blackberry
                /(tizen|kaios)[\/ ]([\w\.]+)/i, // Tizen/KaiOS
                /\((series40);/i                // Series 40
            ],
            props: [spc.NAME]
        },
        {
            desc: "BlackBerry 10",
            rgxs: [/\(bb(10);/i],
            props: [[spc.NAME, vnd.BLACKBERRY]]
        },
        {
            desc: "Symbian",
            rgxs: [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
            props: [[spc.NAME, 'Symbian']]
        },
        {
            desc: "Firefox OS",
            rgxs: [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],
            props: [[spc.NAME, bnd.FIREFOX + ' OS']]
        },
        {
            desc: "WebOS",
            rgxs: [
                /web0s;.+rt(tv)/i,
                /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i  // WebOS
            ],
            props: [[spc.NAME, 'webOS']]
        },
        {
            desc: "watchOS",
            rgxs: [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
            props: [[spc.NAME, 'watchOS']]
        },
        // Google Chromecast
        {
            desc: "Google Chromecast",
            rgxs: [/crkey\/([\d\.]+)/i],
            props: [[spc.NAME, bnd.CHROME + 'cast']]
        },
        {
            desc: "Chromium OS",
            rgxs: [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
            props: [[spc.NAME, os.CHROMIUM_OS]]
        },
        // Smart TVs / Consoles / Other
        {
            desc: "Smart TVs / Consoles / Linux / Other",
            rgxs: [
                // Smart TVs
                /panasonic;(viera)/i,                                               // Panasonic Viera
                /(netrange)mmh/i,                                                   // Netrange
                /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV
                // Console
                /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
                /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)
                // Other
                /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
                /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
                /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
                /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
                /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
                /(gnu) ?([\w\.]*)/i,                                                // GNU
                /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
                /(haiku) (\w+)/i                                                    // Haiku
            ],
            props: [spc.NAME]
        },
        {
            desc: "Solaris",
            rgxs: [/(sunos) ?([\w\.\d]*)/i],
            props: [[spc.NAME, 'Solaris']]
        },
        {
            desc: "Solaris / AIX / Unix / Other",
            rgxs: [
                /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
                /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
                /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
                /(unix) ?([\w\.]*)/i                                                // UNIX
            ],
            props: [spc.NAME]
        },
    ]
};
