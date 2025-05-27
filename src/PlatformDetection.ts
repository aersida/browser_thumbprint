import type { TBrowser } from "./types/PlatformTypes";
import type { ThumbPrintCallBack } from "types/UAParseResultType";

import { UAParser } from "./utilities/UAParser";

import { Thumbprint } from "./Thumbprint";

export const initialiseThumbprint = (tpCallBack: ThumbPrintCallBack): void => {
    const options: Record<string, any> = {
        preprocessor: (key: string, value: any) => {
            if (key == "userAgent") {
                const parser = new UAParser(value);
                const result = parser.result;
                const device = result.device;
                const userAgentMinusVersion = [
                    `${device.vendor}:${device.type}:${device.model}`,
                    result.cpu.architecture,
                    result.os.name,
                    result.engine.name,
                    result.browser.name,
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

    const browserThumbprint = new Thumbprint();

    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            browserThumbprint.get(options, tpCallBack);
        }, { timeout: 100 });
    } else {
        // This is required for Safari
        setTimeout(() => {
            browserThumbprint.get(options, tpCallBack);
        }, 500);
    }
}

export function isWebkit(browser: TBrowser): boolean {
    return (
        ["iPhone OS", "iPad OS", "iOS"].includes(browser.os.name) ||
        browser.name === "Safari"
    );
}

export function inPWAMode(): boolean {
    return window.matchMedia("(display-mode: standalone)").matches;
}
