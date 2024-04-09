/*
 * This software is derived from Fingerprintjs2 2.1.5
 * Fingerprintjs2 2.1.5 - Modern & flexible browser fingerprint library v2
 * https://github.com/fingerprintjs/fingerprintjs
 * Copyright (c) FingerprintJS, Inc, 2020 (https://fingerprintjs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

import { FontList } from "./FontList";

export class FontTest {
    /** Create a span, styled with the specified font, and load up a sample text */
    private static createSpan = (family: string) => {
        const s = document.createElement("span");

        // This block of css mitigates span elements briefly appearing, creating a bad user experience
        s.style.position = "absolute";
        s.style.left = "-9999px";
        // Using 72px font size on the assumption that larger is better
        s.style.fontSize = "72px";

        s.style.fontFamily = family;

        // css font reset to reset external styles
        s.style.fontStyle = "normal";
        s.style.fontWeight = "normal";
        s.style.letterSpacing = "normal";
        s.style.lineBreak = "auto";
        s.style.lineHeight = "normal";
        s.style.textTransform = "none";
        s.style.textAlign = "left";
        s.style.textDecoration = "none";
        s.style.textShadow = "none";
        s.style.whiteSpace = "normal";
        s.style.wordBreak = "normal";
        s.style.wordSpacing = "normal";

        /* 'm' or 'w' are used because these two characters take up the maximum width,
         * and an 'lli' is used so that the similar matching fonts can be separated */
        s.innerHTML = "mmmmmmmmmmlli";

        return s;
    };

    /** Create spans for each font, injecting them into the supplied div, and returning the array of spans */
    private static buildFontSpans = (fontList: string[], fontsDiv: HTMLDivElement) => {
        const spans = [];

        for (let ix = 0; ix < fontList.length; ix++) {
            const s = FontTest.createSpan(fontList[ix]);
            fontsDiv.appendChild(s);
            spans.push(s);
        }

        return spans;
    }

    /** Creates spans for the fonts to detect and adds them to fontsDiv */
    private static initializeFontsSpans = (fontsDiv: HTMLDivElement) => {
        const spans: Record<string, HTMLSpanElement[]> = {};

        for (let i = 0; i < FontList.Regular.length; i++) {
            const fontList = [];
            for (let j = 0; j < FontList.Base.length; j++) {
                fontList.push(`'${FontList.Regular[i]}',${FontList.Base[j]}`);
            }
            spans[FontList.Regular[i]] = FontTest.buildFontSpans(fontList, fontsDiv);
        }

        return spans;
    };

    /** Checks if a base font is available */
    private static isFontAvailable = (fontSpans: any, defaultWidth: Record<string, any>, defaultHeight: Record<string, any>) => {
        let detected = false;

        for (let ix = 0; ix < FontList.Base.length; ix++) {
            const baseFont = FontList.Base[ix];
            const widthTest = fontSpans[ix].offsetWidth !== defaultWidth[baseFont];
            const heightTest = fontSpans[ix].offsetHeight !== defaultHeight[baseFont];
            detected = widthTest || heightTest;
            if (detected) {
                break;
            }
        }

        return detected;
    };

    /** kudos to http://www.lalit.org/lab/javascript-css-font-detect/ */
    public static jsFontsKey = (options: any) => {
        let availableFonts = options.fonts.extendedJsFonts
            ? FontList.Regular.concat(FontList.Extended)
            : FontList.Regular;

        availableFonts = availableFonts.concat(options.fonts.userDefinedFonts);

        // remove duplicate fonts
        availableFonts = availableFonts.filter((font, position) => {
            return availableFonts.indexOf(font) === position;
        });

        const h = document.getElementsByTagName("body")[0];

        // div to load spans for the base fonts
        const baseFontsDiv = document.createElement("div");
        // create spans for base fonts
        const baseFontsSpans = FontTest.buildFontSpans(FontList.Base, baseFontsDiv);
        // add the spans to the DOM
        h.appendChild(baseFontsDiv);
        
        const defaultWidth: Record<string, any> = {};
        const defaultHeight: Record<string, any> = {};

        // get the default width for the three base fonts
        for (let ix = 0; ix < FontList.Base.length; ix++) {
            const baseFont = FontList.Base[ix];
             // width and height for the default font
            defaultWidth[baseFont] = baseFontsSpans[ix].offsetWidth;
            defaultHeight[baseFont] = baseFontsSpans[ix].offsetHeight;
        }

        // div to load spans for the fonts to detect
        const fontsDiv = document.createElement("div");
        // create spans for fonts to detect
        const fontsSpans = FontTest.initializeFontsSpans(fontsDiv);

        // add all the spans to the DOM
        h.appendChild(fontsDiv);
        // check available fonts
        const available = [];
        for (let ix = 0; ix < availableFonts.length; ix++) {
            if (this.isFontAvailable(fontsSpans[availableFonts[ix]], defaultWidth, defaultHeight)) {
                available.push(availableFonts[ix]);
            }
        }

        // remove spans from DOM
        h.removeChild(fontsDiv);
        h.removeChild(baseFontsDiv);

        return available;
    };
}
