/*
 * This software is derived from Fingerprintjs2 2.1.5
 * Fingerprintjs2 2.1.5 - Modern & flexible browser fingerprint library v2
 * https://github.com/fingerprintjs/fingerprintjs
 * Copyright (c) FingerprintJS, Inc, 2020 (https://fingerprintjs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

import { NOT_AVAILABLE } from "./Constants";

import { GetWebGlCanvas, IsCanvasSupported, IsWebGlSupported, LoseWebGlContext } from "./GraphicsTestsBasic";

// https://www.browserleaks.com/canvas#how-does-it-work
const getCanvasTp = (dontUseFakeFont = false) => {
    const result: string[] = [];

    // Very simple now, need to make it more complex (geo shapes etc)
    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 200;
    canvas.style.display = "inline";

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return result;
    }

    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    const hasWinding = ctx.isPointInPath(5, 5, "evenodd") === false;
    result.push(`canvas winding:${hasWinding ? "yes" : "no"}`);

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";

    ctx.font = dontUseFakeFont ? "11pt Arial" : "11pt no-real-font-123";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
    ctx.font = "18pt Arial";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

    // canvas blending
    // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(255,0,255)";
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(0,255,255)";
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgb(255,0,255)";

    // canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill("evenodd");

    if (canvas.toDataURL) {
        result.push(`canvas tp:${canvas.toDataURL()}`);
    }

    return result;
};

export const CanvasKey = (options: any) => IsCanvasSupported() ? getCanvasTp(options.dontUseFakeFontInCanvas) : NOT_AVAILABLE;

const getWebGlTp = () => {
    const gl = GetWebGlCanvas();
    if (!gl) {
        return null;
    }

    const fa2s = (gl: WebGLRenderingContext, fa: any) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        return `[${fa[0]}, ${fa[1]}]`;
    };

    const maxAnisotropy = (gl: WebGLRenderingContext) => {
        const ext =
            gl.getExtension("EXT_texture_filter_anisotropic") ||
            gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
            gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
        if (ext) {
            let anisotropy = gl.getParameter(
                ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT
            );
            if (anisotropy === 0) {
                anisotropy = 2;
            }
            return anisotropy;
        } else {
            return null;
        }
    };

    // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
    // First it draws a gradient object with shaders and convers the image to the Base64 string.
    // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
    // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
    const result = [];
    const vShaderTemplate =
        "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
    const fShaderTemplate =
        "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";

    try {
        const vertexPosBuffer: WebGLBuffer | null = gl.createBuffer();
        if (vertexPosBuffer !== null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
            const vertices = new Float32Array([
                -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            (vertexPosBuffer as any).itemSize = 3;
            (vertexPosBuffer as any).numItems = 3;
        }
        const program: WebGLProgram | null = gl.createProgram();
        const vshader = gl.createShader(gl.VERTEX_SHADER);
        if (vshader !== null) {
            gl.shaderSource(vshader, vShaderTemplate);
            gl.compileShader(vshader);
        }
        const fshader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fshader !== null) {
            gl.shaderSource(fshader, fShaderTemplate);
            gl.compileShader(fshader);
        }
        if (program !== null) {
            if (vshader !== null) {
                gl.attachShader(program, vshader);
            }
            if (fshader !== null) {
                gl.attachShader(program, fshader);
            }
            gl.linkProgram(program);
            gl.useProgram(program);
            (program as any).vertexPosAttrib = gl.getAttribLocation(
                program,
                "attrVertex"
            );
            (program as any).offsetUniform = gl.getUniformLocation(
                program,
                "uniformOffset"
            );
            gl.enableVertexAttribArray((program as any).vertexPosArray);
            if (vertexPosBuffer !== null) {
                gl.vertexAttribPointer(
                    (program as any).vertexPosAttrib,
                    (vertexPosBuffer as any).itemSize,
                    gl.FLOAT,
                    !1,
                    0,
                    0
                );
            }
            gl.uniform2f((program as any).offsetUniform, 1, 1);
        }
        if (vertexPosBuffer !== null) {
            gl.drawArrays(
                gl.TRIANGLE_STRIP,
                0,
                (vertexPosBuffer as any).numItems
            );
        }
        try {
            const canvas = gl.canvas as HTMLCanvasElement;
            result.push(canvas.toDataURL());
        } catch (e) {
            /* .toDataURL may be absent or broken (blocked by extension) */
        }
        const ext = (gl.getSupportedExtensions() || []).join(";");
        result.push(`extensions:${ext}`);
        const alwr = fa2s(gl, gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE));
        result.push(`webgl aliased line width range:${alwr}`);
        const apsr = fa2s(gl, gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE));
        result.push(`webgl aliased point size range:${apsr}`);
        result.push(`webgl alpha bits:${gl.getParameter(gl.ALPHA_BITS)}`);
        const aa = gl.getContextAttributes()?.antialias ? "yes" : "no";
        result.push(`webgl antialiasing:${aa}`);
        result.push(`webgl blue bits:${gl.getParameter(gl.BLUE_BITS)}`);
        result.push(`webgl depth bits:${gl.getParameter(gl.DEPTH_BITS)}`);
        result.push(`webgl green bits:${gl.getParameter(gl.GREEN_BITS)}`);
        result.push(`webgl max anisotropy:${maxAnisotropy(gl)}`);
        const maxctiu = gl.getParameter(
            gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
        );
        result.push(`webgl max combined texture image units:${maxctiu}`);
        const maxcmts = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        result.push(`webgl max cube map texture size:${maxcmts}`);
        const maxfuv = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        result.push(`webgl max fragment uniform vectors:${maxfuv}`);
        const maxrs = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        result.push(`webgl max render buffer size:${maxrs}`);
        const maxtiu = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        result.push(`webgl max texture image units:${maxtiu}`);
        const maxts = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        result.push(`webgl max texture size:${maxts}`);
        const maxvv = gl.getParameter(gl.MAX_VARYING_VECTORS);
        result.push(`webgl max varying vectors:${maxvv}`);
        const maxva = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        result.push(`webgl max vertex attribs:${maxva}`);
        const maxvtiu = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        result.push(`webgl max vertex texture image units:${maxvtiu}`);
        const maxvuv = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        result.push(`webgl max vertex uniform vectors:${maxvuv}`);
        const maxvdim = fa2s(gl, gl.getParameter(gl.MAX_VIEWPORT_DIMS));
        result.push(`webgl max viewport dims:${maxvdim}`);
        result.push(`webgl red bits:${gl.getParameter(gl.RED_BITS)}`);
        result.push(`webgl renderer:${gl.getParameter(gl.RENDERER)}`);
        const slv = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        result.push(`webgl shading language version:${slv}`);
        const sb = gl.getParameter(gl.STENCIL_BITS);
        result.push(`webgl stencil bits:${sb}`);
        result.push(`webgl vendor:${gl.getParameter(gl.VENDOR)}`);
        result.push(`webgl version:${gl.getParameter(gl.VERSION)}`);

        try {
            // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
            const extensionDebugRendererInfo = gl.getExtension(
                "WEBGL_debug_renderer_info"
            );
            if (extensionDebugRendererInfo) {
                const webglVendor = gl.getParameter(
                    extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL
                );
                const webglRenderer = gl.getParameter(
                    extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL
                );
                result.push(`webgl unmasked vendor:${webglVendor}`);
                result.push(`webgl unmasked renderer:${webglRenderer}`);
            }
        } catch (e) {
            /* squelch */
        }

        if (gl.getShaderPrecisionFormat === null) {
            return result;
        }

        const numSizeTypes = [
            gl.LOW_FLOAT,
            gl.MEDIUM_FLOAT,
            gl.HIGH_FLOAT,
            gl.LOW_INT,
            gl.MEDIUM_INT,
            gl.HIGH_INT,
        ];
        const shaders = [gl.FRAGMENT_SHADER, gl.VERTEX_SHADER];

        shaders.forEach((shader) => {
            numSizeTypes.forEach((numSizeType) => {
                const format = gl.getShaderPrecisionFormat(
                    shader,
                    numSizeType
                );
                if (format === null) {
                    return;
                }
                ["precision", "rangeMin", "rangeMax"].forEach((key) => {
                    const formatKey =
                        format[key as keyof WebGLShaderPrecisionFormat];
                    if (key !== "precision") {
                        key = `precision ${key}`;
                    }
                    const webglLine = `webgl ${shader}`;
                    /* eslint-disable-next-line prettier/prettier */
                    const shaderLine = `shader ${numSizeType}`;
                    const line = `${webglLine} ${shaderLine} ${key}:${formatKey}`;
                    result.push(line);
                });
            });
        });

        return result;
    } finally {
        try {
            LoseWebGlContext(gl);
        } catch (e) {
            /* Let the original error be thrown */
        }
    }
};

export const WebGlKey = () => IsWebGlSupported() ? getWebGlTp() : NOT_AVAILABLE;
