import type { tpComponent } from "./PlatformTypes";

export type UAParseResult = {
    ua: string,
    browser: any,
    engine: any,
    os: any,
    device: any,
    cpu: any
}

export type ThumbPrintCallBack = (components: tpComponent[]) => void;
