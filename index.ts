const serverName = "Browser Thumbprint test server";
const ixHtml = "/index.html";
const transpiler = new Bun.Transpiler({
    loader: "ts", // "js | "jsx" | "ts" | "tsx"
    target: "browser"
});

const server = Bun.serve({
    port: 3000,
    async fetch(req) {

        const url = new URL(req.url);
        const urlPath = url.pathname;
        if (urlPath.endsWith("/") || urlPath.endsWith(ixHtml)) {
            console.log("Serving the index page");
            return new Response(Bun.file(`./src${ixHtml}`));
        }
        if (urlPath.endsWith("/Thumbprint")) {
            const thumbTs = Bun.file(`./src/Thumbprint.ts`);
            const thumbJs = transpiler.transformSync(await thumbTs.text());
            return new Response(thumbJs, {headers: {"Content-Type": "text/javascript"}});
        }
        if (urlPath.includes("/minutiae/")) {
            const fileTsName = `./src/minutiae/${urlPath.split("/minutiae/")[1]}.ts`;
            const fileTs = Bun.file(fileTsName);
            const fileJs = transpiler.transformSync(await fileTs.text());
            return new Response(fileJs, {headers: {"Content-Type": "text/javascript"}});
        }

        // all other routes
        return new Response(url.pathname);
        // return new Response(`${serverName}!`);
    },
});

console.log(`${serverName} is listening on http://localhost:${server.port} ...`);