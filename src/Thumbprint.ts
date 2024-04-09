/*
 * This software is derived from Fingerprintjs2 2.1.5
 * Fingerprintjs2 2.1.5 - Modern & flexible browser fingerprint library v2
 * https://github.com/fingerprintjs/fingerprintjs
 * Copyright (c) FingerprintJS, Inc, 2020 (https://fingerprintjs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

import type { tpComponent, tpComponentFunction } from "./types/PlatformTypes";

import { FontTest } from "./minutiae/FontTest";
import { CanvasKey, WebGlKey } from "./minutiae/GraphicsTestsAdvanced";
import { WebGlInfo, WebGlVendorAndRenderer } from "./minutiae/GraphicsTestsBasic";
import { HardwareConcurrency, PreferredLanguage, PreferredLanguageMatch, UserAgent, WebDriver } from "./minutiae/NavigatorTests";
import { AvailableScreenResolution, ColorDepth, ScreenResolution, ScreenResolutionsValid } from "./minutiae/ScreenTests";
import { HasIndexedDB, HasLocalStorage, HasSessionStorage } from "./minutiae/StorageTests";
import { Timezone, TimezoneOffset } from "./minutiae/TimezoneTests";

export class Thumbprint {
    private defaultOptions = {
        preprocessor: null,
        audio: {
            timeout: 1000,
            // On iOS 11, audio context can only be used in response to user interaction.
            // We require users to explicitly enable audio fingerprinting on iOS 11.
            // See https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
            excludeIOS11: true,
        },
        fonts: {
            userDefinedFonts: [],
            extendedJsFonts: false,
        },
        components: {} as tpComponentFunction,
        extraComponents: {} as tpComponentFunction,
        excludes: {},
    };

    private components: tpComponentFunction = {
        userAgent: UserAgent,
        webdriver: WebDriver,
        hardwareConcurrency: HardwareConcurrency,
        language: PreferredLanguage,
        languageMatches: PreferredLanguageMatch,

        colorDepth: ColorDepth,
        screenResolution: ScreenResolution,
        availableScreenResolution: AvailableScreenResolution,
        screenResolutionsValid: ScreenResolutionsValid,

        timezoneOffset: TimezoneOffset,
        timezone: Timezone,

        sessionStorage: HasSessionStorage,
        localStorage: HasLocalStorage,
        indexedDb: HasIndexedDB,

        webGlVendorAndRenderer: WebGlVendorAndRenderer,
        webGlInfo: WebGlInfo,

        canvas: CanvasKey,
        webgl: WebGlKey,

        fonts: FontTest.jsFontsKey,
    };

    private extendSoft = (target: any, source: any) => {
        if (source === null) {
            return target;
        }

        for (const key in source) {
            const value = source[key];
            if (
                value !== null &&
                !Object.prototype.hasOwnProperty.call(target, key)
            ) {
                target[key] = value;
            }
        }

        return target;
    };

    // In Fingerprintjs2 2.1.5 - but excluded here
    // Used deprecated / removed navigator calls: cpuClass, platform, plugins
    // Too out-of-date: hasLiedOs, hasLiedBrowser, audio, openDatabase
    // IE specific: addBehavior

    get = (
        options: Record<string, any>,
        callback: (value: tpComponent[]) => void
    ): void => {
        this.extendSoft(options, this.defaultOptions);
        options["components"] = {
            ...(options["extraComponents"] as tpComponentFunction),
            ...this.components,
        } as tpComponentFunction;

        const keys: tpComponent[] = [];

        const addPreprocessedComponent = (key: string, value: any) => {
            if (typeof value === "function") {
                value = value(options);
            }
            if (typeof options["preprocessor"] === "function") {
                value = options["preprocessor"](key, value);
            }
            const entry = { key: key, value: value };
            keys.push(entry);
        };

        let i = -1;
        const chainComponents = () => {
            i += 1;
            if (i >= Object.keys(options["components"]).length) {
                // on finish
                callback(keys);
                return;
            }
            const component = Object.entries(options["components"])[i];
            const compKey = component[0];
            const compVal = component[1];

            if (options["excludes"][compKey]) {
                chainComponents(); // skip
                return;
            }

            addPreprocessedComponent(compKey, compVal);
            chainComponents();
        };

        chainComponents();
    };
}
