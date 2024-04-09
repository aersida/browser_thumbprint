import { NOT_AVAILABLE } from "./Constants";

export const HardwareConcurrency = () =>  navigator.hardwareConcurrency || NOT_AVAILABLE;
export const PreferredLanguage = () => navigator.language || NOT_AVAILABLE;

/** Check that navigator.language is the first language of navigator.languages */
export const PreferredLanguageMatch = () => {
    try {
        if (navigator.languages[0].slice(0, 2) !== navigator.language.slice(0, 2)) {
            return false;
        }
    } catch (err) {
        return false;
    }

    return true;
};

export const UserAgent = () => navigator.userAgent;
export const WebDriver = () => navigator.webdriver == null ? NOT_AVAILABLE : navigator.webdriver;
