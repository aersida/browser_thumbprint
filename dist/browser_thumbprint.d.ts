/** Get this browser's thumbprint.
 *
 * Note that if this value is falsey, it means that the thumbprint has not been set yet.
 * @returns {string} The browser's thumbprint, or an empty string if the thumbprint has not yet been set.
 */
export declare const getThumbprint: () => string;
/** Set the browser's thumbprint.
 *
 * This will reset the thumbprint to an empty string and then call initialiseThumbprint to set it again.
 *
 * Note for this to work, the browser must support the `requestIdleCallback` API.
 * If it does not, the thumbprint will be set after a 500ms delay.
 * @returns {void}
 */
export declare const setThumbprint: () => void;
