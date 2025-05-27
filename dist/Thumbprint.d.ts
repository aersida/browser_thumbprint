import type { tpComponent } from "./types/PlatformTypes";
export declare class Thumbprint {
    private defaultOptions;
    private components;
    private extendSoft;
    get: (options: Record<string, any>, callback: (value: tpComponent[]) => void) => void;
}
