export type RegexPropFunc = (str: string) => string | undefined;

export type RegexMap = {
    desc: string;
    rgxs: RegExp[];
    props: (string | (string | RegExp | RegexPropFunc)[])[];
};

export type RegexMaps = Record<"browser" | "cpu" | "device" | "engine" | "os", RegexMap[]>;
