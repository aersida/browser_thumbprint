import type { tpComponent } from "types/PlatformTypes";
import { initialiseThumbprint } from "./PlatformDetection";
import { x64hash128 } from "./utilities/MurmurHashDerived";

let thumbprint = "";

const storeThumbprint = (components: tpComponent[]) => {
    const values = components.map((component) => {
        return component.value;
    });
    const murmur = x64hash128(values.join(""), 31);
    thumbprint = murmur;
};

/** Get this browser's thumbprint.
 * 
 * Note that if this value is falsey, it means that the thumbprint has not been set yet.
 * @returns {string} The browser's thumbprint, or an empty string if the thumbprint has not yet been set.
 */
export const getThumbprint = (): string => {
    return thumbprint;
};

/** Set the browser's thumbprint.
 * 
 * This will reset the thumbprint to an empty string and then call initialiseThumbprint to set it again.
 * 
 * Note for this to work, the browser must support the `requestIdleCallback` API.
 * If it does not, the thumbprint will be set after a 500ms delay.
 * @returns {void}
 */
export const setThumbprint = (): void => {
    thumbprint = "";
    initialiseThumbprint(storeThumbprint);
};