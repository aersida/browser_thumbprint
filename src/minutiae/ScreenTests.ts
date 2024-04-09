import { NOT_AVAILABLE } from "./Constants";

const ws = window.screen;
const isHeadless = () => !(ws.availWidth && ws.availHeight);

export const ScreenResolution = () => [ws.width, ws.height].sort().reverse();

export const AvailableScreenResolution = () => {
    return isHeadless()
        ? NOT_AVAILABLE
        : [ws.availHeight, ws.availWidth].sort().reverse();
};

/** Are the reported screen resolution and available screen resolution valid relative to each other?
 * Note that the width and height values are NOT reordered in this test
 */
export const ScreenResolutionsValid = () => {
    return isHeadless()
        ? NOT_AVAILABLE
        : ws.width < ws.availWidth || ws.height < ws.availHeight;
};

export const ColorDepth = () => window.screen.colorDepth || NOT_AVAILABLE;
