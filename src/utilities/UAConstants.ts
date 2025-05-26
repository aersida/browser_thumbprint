/** Constants for the various typeof values */
export namespace types {
    export const FUNC = "function";
    export const UNDEF = "undefined";
    export const OBJ = "object";
    export const STR = "string";
}

/** Constants for 'special' values */
export namespace spc {
    export const EMPTY = "";
    export const UNKNOWN = "?";
    export const UA_MAX_LENGTH = 500;

    export const ARCHITECTURE = "architecture";
    export const BROWSER = "browser";
    export const MAJOR = "major";
    export const MODEL = "model";
    export const NAME = "name";
    export const TYPE = "type"; // Device type
    export const VENDOR = "vendor";
    export const VERSION = "version";
}

/** Constants for device 'types' */
export namespace dev {
    export const CONSOLE = "console";
    export const EMBEDDED = "embedded";
    export const MOBILE = "mobile";
    export const SMARTTV = "smarttv";
    export const TABLET = "tablet";
    export const WEARABLE = "wearable";
}

/** Constants for vendor/brand names */
export namespace vnd {
    export const AMAZON = "Amazon";
    export const APPLE = "Apple";
    export const ASUS = "ASUS";
    export const BAIDU = "Baidu";
    export const BLACKBERRY = "BlackBerry";
    export const FACEBOOK = "Facebook";
    export const GOOGLE = "Google";
    export const HTC = "HTC";
    export const HUAWEI = "Huawei";
    export const LENOVO = "Lenovo";
    export const LG = "LG";
    export const MICROSOFT = "Microsoft";
    export const MOTOROLA = "Motorola";
    export const NOKIA = "Nokia";
    export const NVIDIA = "Nvidia";
    export const ONEPLUS = "OnePlus";
    export const OPPO = "Oppo";
    export const REALME = "Realme";
    export const SAMSUNG = "Samsung";
    export const SHARP = "Sharp";
    export const SONY = "Sony";
    export const VIVO = "Vivo";
    export const XIAOMI = "Xiaomi";
    export const ZEBRA = "Zebra";
    export const ZTE = "ZTE";
}

/** Constants for some browser brand names */
export namespace bnd {
    export const CHROME = "Chrome";
    export const EDGE = "Edge";
    export const FIREFOX = "Firefox";
    export const OPERA = "Opera";
}

/** Constants for rendering engine names */
export namespace eng {
    export const BLINK = "Blink";
    export const GECKO = "Gecko";
}

export namespace os {
    export const CHROMIUM_OS = "Chromium OS";
    export const MAC_OS = "Mac OS";
    export const WINDOWS = "Windows";
}
