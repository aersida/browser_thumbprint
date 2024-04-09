export type TBrowser = {
    name: string;
    version: any;
    os: {
        name: string;
        version: any;
    };
};

export type TPlatform = {
    browser: TBrowser;
    inPWAMode: boolean;
};

export type RequestIdleCallbackHandle = number;

export interface tpComponent {
    key: string;
    value: any;
}

export type tpFunction = (options: any) => void;

export type tpComponentFunction = Record<string, tpFunction>;

interface IdleDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): DOMHighResTimeStamp;
}

declare let IdleDeadline: {
    prototype: IdleDeadline;
    new (): IdleDeadline;
};

export interface IdleRequestCallback {
    (deadline: IdleDeadline): void;
}

export interface IdleRequestOptions {
    timeout?: number;
}
