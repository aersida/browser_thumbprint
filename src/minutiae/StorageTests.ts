import { ERROR } from "./Constants";

export const HasSessionStorage = () => {
    try {
        return !!window.sessionStorage;
    } catch (e) {
        return ERROR; // SecurityError when referencing it means it exists
    }
};

// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
export const HasLocalStorage = () => {
    try {
        return !!window.localStorage;
    } catch (e) {
        return ERROR; // SecurityError when referencing it means it exists
    }
};

export const HasIndexedDB = () => {
    try {
        return !!window.indexedDB;
    } catch (e) {
        return ERROR; // SecurityError when referencing it means it exists
    }
};
