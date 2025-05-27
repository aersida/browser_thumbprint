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

/// <reference types="user-agent-data-types" />

import type { RegexMap, RegexMaps, RegexPropFunc } from "types/RegexMapType";

import {
    // bnd,
    dev,
    os,
    spc,
    types,
    // vnd
} from "./UAConstants";
import { clean, regexMaps } from "./UARegexMaps";
import type { UAParseResult } from "types/UAParseResultType";

export class UAParser {
    /** The user agent string, either
     * as supplied to the constructor or if that's undefined or empty,
     * as returned by the browser */
    ua!: string;

    /** The merged RegexMaps of regexMaps and supplied extensions */
    rgxMaps!: RegexMaps;

    /* Constants */
    LIBVERSION = "1.0.37";

    extend = (regexes: RegexMaps, extensions: RegexMaps): RegexMaps => {
        return {
            browser: extensions.browser.concat(regexes.browser),
            cpu: extensions.cpu.concat(regexes.cpu),
            device: extensions.device.concat(regexes.device),
            engine: extensions.engine.concat(regexes.engine),
            os: extensions.os.concat(regexes.os)
        };
    };

    /** Return a record derived from the supplied array, where each key is the upper cased form of each array value */
    enKey = (arr: string[]) => {
        const enums: Record<string, string> = {};
        for (let ix = 0; ix < arr.length; ix++) {
            enums[arr[ix].toUpperCase()] = arr[ix];
        }
        return enums;
    };

    major = (version: any) => typeof (version) === types.STR ? version.replace(/[^\d\.]/g, spc.EMPTY).split('.')[0] : undefined;

    rgxMapper = (detail: Record<string, any>, arrays: RegexMap[]) => {
        let i = 0, matches, match;

        // loop through all regex maps
        while (i < arrays.length && !matches) {
            const rgxs = arrays[i].rgxs;
            const props = arrays[i].props;
            let j = 0, k = 0;

            // try matching uastring with regexes
            while (j < rgxs.length && !matches) {
                if (!rgxs[j]) {
                    break;
                }

                matches = rgxs[j++].exec(this.ua);

                if (!!matches) {
                    for (let pX = 0; pX < props.length; pX++) {
                        match = matches[++k];
                        const prop = props[pX];
                        // check if given property is actually array
                        if (Array.isArray(prop) && prop.length > 0) {
                            const propName = prop[0] as string;
                            if (prop.length === 2) {
                                detail[propName] = typeof prop[1] == types.FUNC
                                    ? detail[propName] = (prop[1] as RegexPropFunc).call(detail, match)
                                    : detail[propName] = prop[1];
                            } else if (prop.length === 3) {
                                // check whether function or regex
                                // if (typeof prop[1] === types.FUNC && !("exec" in (prop[1] as RegexPropFunc) && "test" in (prop[1] as RegexPropFunc))) {
                                //     // call function (usually string mapper)
                                //     detail[propName] = match ? (prop[1] as RegexPropFunc).call(detail, match, prop[2]) : undefined;
                                // } else {
                                    // sanitize match using given regex
                                    detail[propName] = match ? match.replace(prop[1] as RegExp, prop[2] as string) : undefined;
                                // }
                            } else if (prop.length === 4) {
                                detail[propName] = match ? (prop[3] as RegexPropFunc).call(detail, match.replace(prop[1] as RegExp, prop[2] as string)) : undefined;
                            }
                        } else {
                            detail[prop as string] = match ? match : undefined;
                        }
                    }
                }
            }
            i++;
        }

        return detail;
    };

    get navigator(): Navigator | undefined {
        return (typeof window !== types.UNDEF && window.navigator) ? window.navigator : undefined;
    }

    get navUserAgent(): string {
        return this.navigator ? clean(this.navigator.userAgent) : spc.EMPTY;
    }

    get navUserAgentData(): NavigatorUAData | undefined {
        return (this.navigator && this.navigator.userAgentData) ? this.navigator.userAgentData : undefined;
    }

    /** Either the trimmed user agent string as supplied or the user agent string from the browser */
    appUserAgent = (ua: string | undefined) => ("" + ua).trim() ? ("" + ua).trim() : this.navUserAgent;

    /** This test for brave browser will only work if running in that browser. It therefore assumes that `isSelfUA` is true. */
    get isBrave(): boolean {
        if (!(this.navigator && "brave" in this.navigator)) {
            return false;
        }
        return typeof ((this.navigator.brave as any).isBrave) === types.FUNC;
    }

    getBrowser = (isSelfUA: boolean) => {
        const browser: Record<string, any> = {};
        browser[spc.NAME] = undefined;
        browser[spc.VERSION] = undefined;
        this.rgxMapper(browser, this.rgxMaps.browser);
        browser[spc.MAJOR] = this.major(browser[spc.VERSION]);

        // Brave-specific detection
        if (isSelfUA && this.isBrave) {
            browser[spc.NAME] = "Brave";
        }

        return browser;
    };

    getEngine = () => {
        const engine: Record<string, any> = {};
        engine[spc.NAME] = undefined;
        engine[spc.VERSION] = undefined;
        this.rgxMapper(engine, this.rgxMaps.engine);

        return engine;
    };

    getOS = (isSelfUA: boolean) => {
        const _os: Record<string, any> = {};
        _os[spc.NAME] = undefined;
        this.rgxMapper(_os, this.rgxMaps.os);

        if (isSelfUA) {
            if (!_os[spc.NAME] && this.navUserAgentData && this.navUserAgentData.platform !== "Unknown") {
                _os[spc.NAME] = this.navUserAgentData.platform
                    .replace(/chrome os/i, os.CHROMIUM_OS)
                    .replace(/macos/i, os.MAC_OS);           // backward compatibility
            }
        }

        return _os;
    };

    getDevice = (isSelfUA: boolean) => {
        const device: Record<string, any> = {};
        device[spc.VENDOR] = undefined;
        device[spc.MODEL] = undefined;
        device[spc.TYPE] = undefined;
        this.rgxMapper(device, this.rgxMaps.device);

        if (!isSelfUA) {
            return device;
        }

        if (!device[spc.TYPE] && this.navUserAgentData && this.navUserAgentData.mobile) {
            device[spc.TYPE] = dev.MOBILE;
        }
        // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
        // navigator.standalone tells us if PWA is supported, but here we're only detecting if it is present in the navigator object
        if (device[spc.MODEL] == "Macintosh" && this.navigator && typeof "standalone" in this.navigator && this.navigator.maxTouchPoints && this.navigator.maxTouchPoints > 2) {
            device[spc.MODEL] = "iPad";
            device[spc.TYPE] = dev.TABLET;
        }
        return device;
    };

    getCPU = () => {
        const cpu: Record<string, any> = {};
        cpu[spc.ARCHITECTURE] = undefined;
        this.rgxMapper(cpu, this.rgxMaps.cpu);

        return cpu;
    };

    parseUA = () => {
        const parsedUA: UAParseResult = {
            ua: "",
            browser: "",
            engine: "",
            os: "",
            device: "",
            cpu: ""
        };
        if (!this.ua) {
            return parsedUA;
        }

        parsedUA["ua"] = this.ua;

        const isSelfUA = !!this.navigator && this.navigator.userAgent == this.ua;

        parsedUA["browser"] = this.getBrowser(isSelfUA);
        parsedUA["engine"] = this.getEngine();
        parsedUA["os"] = this.getOS(isSelfUA);
        parsedUA["device"] = this.getDevice(isSelfUA);
        parsedUA["cpu"] = this.getCPU();

        return parsedUA;
    }

    get result(): UAParseResult {
        return this.parseUA();
    }

    public constructor(ua: string | undefined, extensions: RegexMaps);
    public constructor(ua: string | undefined);
    public constructor(extensions: RegexMaps);
    public constructor();
    constructor(...consArgs: any[]) {
        let extensions = {browser: [], cpu: [], device: [], engine: [], os: []};
        if (consArgs.length > 2) {
            consArgs = consArgs.slice(0, 2);
        }
        if (consArgs.length === 2) {
            this.ua = this.appUserAgent(consArgs[0]);
            extensions = consArgs[1];
        } else if (consArgs.length === 1) {
            if (typeof consArgs[0] === types.STR) {
                this.ua = this.appUserAgent(consArgs[0]);
            } else if (typeof consArgs[0] === types.OBJ) {
                this.ua = this.appUserAgent("");
                // consArgs[0] is assumed to be a fit for RegexMaps
                extensions = consArgs[0];
            }
        } else {
            // No constructor arguments
            this.ua = this.appUserAgent("");
        }

        this.rgxMaps = this.extend(regexMaps, extensions);
    }
}
