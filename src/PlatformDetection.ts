import { UAParser } from "ua-parser-js";

import type {
    tpComponent,
    IdleRequestCallback,
    IdleRequestOptions,
    RequestIdleCallbackHandle,
    TBrowser,
    TPlatform,
} from "./types/PlatformTypes";

import { x64hash128 } from "./utilities/MurmurHashDerived";
import { Thumbprint } from "./Thumbprint";


export function getPlatform(): TPlatform {
    return {
        browser: getBrowser(),
        inPWAMode: inPWAMode(),
    };
}

/**
 * Get the browser name and version number
 * @remarks Note that this does NOT support IE (Internet Explorer)
 * and neither does Microsoft.
 */
export function getBrowser(): TBrowser {
    const ua = navigator.userAgent;

    const parser = new UAParser(ua);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    return {
        name: browser.name,
        version: browser.version,
        os: os,
        device: device,
    } as TBrowser;
}

/**
 * This declaration is needed because the definition for `requestIdleCallback
 * is not yet correctly implemented in lib.dom.d.ts
 */
declare global {
    interface Window {
        requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions
        ) => RequestIdleCallbackHandle;
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
}

export const initialiseThumbprint = (): void => {
    const options: Record<string, any> = {
        preprocessor: (key: string, value: any) => {
            if (key == "userAgent") {
                const parser = new UAParser(value);
                const device = parser.getDevice();
                const userAgentMinusVersion = [
                    `${device.vendor}:${device.type}:${device.model}`,
                    parser.getCPU().architecture,
                    parser.getOS().name,
                    parser.getEngine().name,
                    parser.getBrowser().name,
                ].join("|");

                return userAgentMinusVersion;
            }
            return value;
        },
        excludes: {
            fontsFlash: true,
            adBlock: true,
            enumerateDevices: true,
        },
    };
    const storeThumbprint = (components: tpComponent[]) => {
        const values = components.map((component: tpComponent) => {
            return component.value;
        });
        const murmur = x64hash128(values.join(""), 31);
        // This was going to a redux store
        storeThumbprintHash(murmur);
    };
    const browserThumbprint = new Thumbprint();
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            browserThumbprint.get(options, storeThumbprint);
        });
    } else {
        // This is required for Safari
        setTimeout(() => {
            browserThumbprint.get(options, storeThumbprint);
        }, 500);
    }
}

export function isWebkit(browser: TBrowser): boolean {
    return (
        ["iPhone OS", "iPad OS", "iOS"].includes(browser.os.name) ||
        browser.name === "Safari"
    );
}

function inPWAMode(): boolean {
    return window.matchMedia("(display-mode: standalone)").matches;
}
