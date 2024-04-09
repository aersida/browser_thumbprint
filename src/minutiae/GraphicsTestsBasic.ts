import { NOT_AVAILABLE } from "./Constants";

export const IsCanvasSupported = () => {
    const elem = document.createElement("canvas");
    return !!(elem.getContext && elem.getContext("2d"));
};

export const GetWebGlCanvas = () => {
    const canvas = document.createElement("canvas");
    let gl = null;
    try {
        /* eslint-disable prettier/prettier */
        gl = (
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")
        ) as WebGLRenderingContext;
        /* eslint-enable prettier/prettier */
    } catch (e) {
        /* squelch */
    }
    return gl || null;
};

const getWebGlInfo = () => {
    const context = GetWebGlCanvas();
    if (context == null) {
        return NOT_AVAILABLE;
    }

    const version = context.getParameter(context.VERSION);
    const vendor = context.getParameter(context.VENDOR);
    const shadingLanguageVersion = context.getParameter(context.SHADING_LANGUAGE_VERSION);
    const supportedExtensions = context.getSupportedExtensions() || [];
    return `${version}~${vendor}~${shadingLanguageVersion}~[${supportedExtensions.join(",")}]`;
};

export const LoseWebGlContext = (context: any) => {
    const loseContextExtension = context.getExtension("WEBGL_lose_context");
    if (loseContextExtension != null) {
        loseContextExtension.loseContext();
    }
};

export const IsWebGlSupported = () => {
    // code taken from Modernizr
    if (!IsCanvasSupported() || !window.WebGLRenderingContext) {
        return false;
    }

    const context = GetWebGlCanvas();
    if (context) {
        try {
            LoseWebGlContext(context);
        } catch (e) {
            /* The try block is optional, so let the main algorithm continue */
        }
        return true;
    }
    return false;
};

/**
 * This a subset of the WebGL fingerprint with a lot of entropy,
 * while being reasonably browser-independent
 */
const getWebglVendorAndRenderer = () => {
    let context: WebGLRenderingContext | null = null;
    try {
        context = GetWebGlCanvas();
        if (!context) {
            return NOT_AVAILABLE;
        }
        const extensionDebugRendererInfo = context.getExtension(
            "WEBGL_debug_renderer_info"
        );
        if (!extensionDebugRendererInfo) {
            return NOT_AVAILABLE;
        }
        const vendor = context.getParameter(
            extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL
        );
        const renderer = context.getParameter(
            extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL
        );
        return `${vendor}~${renderer}`;
    } catch (e) {
        return NOT_AVAILABLE;
    } finally {
        try {
            LoseWebGlContext(context);
        } catch (e) {
            /* Keep the original result */
        }
    }
};

export const WebGlVendorAndRenderer = () => IsWebGlSupported() ? getWebglVendorAndRenderer() : NOT_AVAILABLE;
export const WebGlInfo = () => IsWebGlSupported() ? getWebGlInfo() : NOT_AVAILABLE;
