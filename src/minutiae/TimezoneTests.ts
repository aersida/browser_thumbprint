import { NOT_AVAILABLE } from "./Constants";

export const TimezoneOffset = () => new Date().getTimezoneOffset();

export const Timezone = () => {
    return (window.Intl && window.Intl.DateTimeFormat)
        ? new window.Intl.DateTimeFormat().resolvedOptions().timeZone || NOT_AVAILABLE
        : NOT_AVAILABLE;
};