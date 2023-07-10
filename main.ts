// deno run --config ./deno.json --allow-net --allow-env ./main.ts
import { Application, Router, RouterContext } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { postDataJSON } from "./static.ts";
import { unescape as getSafeStrLiteral } from "https://deno.land/x/safe_string_literal@v1.0.4/index.js";
import constants from "./config.ts";

if (!constants.cdn || constants.cdn.startsWith("http") || constants.cdn.endsWith("/") || (await fetch(`https://${constants.cdn}`)).status !== 406) {
    console.log("Warning: CF Worker not properly set, expect issues with the code");
}

const reqOpts = { headers: { "User-Agent": constants.reqUA, "Cookie": constants.reqCookie } };
const router = new Router();

const galleryHandler = async (
    ctx:
        | RouterContext<"/a/:id">
        | RouterContext<"/gallery/:id">
        | RouterContext<"/t/:tag/:id">,
) => {
    const files = [];

    // postData method is only usable in a new gallery/album.
    // blogLayout method is the opposite and mostly found in old ones.

    // Both album and gallery endpoints are the same behind the scenes,
    // but a gallery can't use the old blog/vertical/horizontal layouts.

    // A tagged gallery can sometimes use a different endpoint (/t/).

    // There are a few rare exceptions where a gallery doesn't function
    // as an album and vice versa, in that case we iterate through both.
    POSTDATAMETHOD:
    try {
        let res;

        for (const p of [fetch(`https://imgur.com/gallery/${ctx.params.id}`, reqOpts), fetch(`https://imgur.com/a/${ctx.params.id}`, reqOpts)]) {
            const result = await p;

            if (result?.ok) {
                res = result;
                break;
            }
        }
        if (!res) break POSTDATAMETHOD;

        const document = new DOMParser().parseFromString(await res.text(), "text/html");
        if (!document) break POSTDATAMETHOD;

        const script = document.querySelector("script");
        if (!script?.textContent?.startsWith("window.postDataJSON")) break POSTDATAMETHOD;

        const postData = JSON.parse(getSafeStrLiteral(script.textContent.replace('window.postDataJSON="', "").slice(0, -1))) as postDataJSON;
        for (const file of postData.media) {
            files.push(file.url.replace("i.imgur.com", constants.cdn));
        }
    } catch (err) {
        console.log(err);
        console.log("postData method failed");
        files.length = 0;
    }

    if (files.length === 0) {
        console.log("No data was found using postData, proceeding to blog layout...");

        BLOGLAYOUTMETHOD:
        try {
            const res = await fetch(`https://imgur.com/a/${ctx.params.id}/layout/blog`, reqOpts);
            if (res.status !== 200) break BLOGLAYOUTMETHOD;

            const document = new DOMParser().parseFromString(await res.text(), "text/html");
            if (!document) break BLOGLAYOUTMETHOD;

            const containers = [...document.querySelectorAll(".post-image-container")] as Element[];
            if (containers.length === 0) break BLOGLAYOUTMETHOD;

            for (const container of containers) {
                const fileMeta = container.querySelector('.post-image meta[itemprop="contentUrl"]');

                let found_url;

                if (fileMeta?.getAttribute("content")?.includes("imgur")) {
                    found_url = `https://${fileMeta.getAttribute("content")!.replace("//i.imgur.com", constants.cdn)}`;
                } else if (container.getAttribute("id")) {
                    const fileID = container.getAttribute("id");

                    ENDPOINTITR:
                    for (const ext of [".mp4", ".jpg"]) {
                        const endreq = await fetch(`https://i.imgur.com/${fileID + ext}`, reqOpts);

                        if (endreq.ok) {
                            found_url = `https://${constants.cdn}/${fileID + ext}`;
                            break ENDPOINTITR;
                        }
                    }

                    if (!found_url) {
                        console.log("File wasn't found for:\n", container.innerHTML);
                        files.length = 0;
                        break;
                    }
                } else {
                    console.log("File wasn't found for:\n", container.innerHTML);
                    files.length = 0;
                    break;
                }

                files.push(found_url);
            }
        } catch (err) {
            console.log(err);
            console.log("blog layout method failed.");
            files.length = 0;
        }
    }

    if (files.length === 0) {
        console.log(`All methods failed for gallery ID: ${ctx.params.id}`);
        ctx.response.body = "Not Found.";
        ctx.response.status = 404;
    } else {
        const bodyMarkdown = [];

        for (const file of files) {
            if (file.endsWith(".mp4")) {
                bodyMarkdown.push(`<video onloadstart="this.volume=0.3" muted autoplay loop playsinline controls preload="none" poster="${file.replace(".mp4", ".jpg")}"><source src="${file}" type="video/mp4"></video>`);
            } else if (file.endsWith(".gifv")) {
                bodyMarkdown.push(`<video onloadstart="this.volume=0.3" muted autoplay loop playsinline controls preload="none" poster="${file.replace(".gifv", ".jpg")}"><source src="${file.replace(".gifv", ".mp4")}" type="video/mp4"></video>`);
            } else if (file.endsWith(".webm")) {
                bodyMarkdown.push(`<video onloadstart="this.volume=0.3" muted autoplay loop playsinline controls preload="none" poster="${file.replace(".webm", ".jpg")}"><source src="${file}" type="video/webm"></video>`);
            } else {
                bodyMarkdown.push(`<a href="${file}" target="_blank"><img src="${file}" loading="lazy"></a>`);
            }
        }

        ctx.response.body = constants.siteMarkdown.header + bodyMarkdown.join("") + constants.siteMarkdown.footer;
    }
};

router
    .get("/", (ctx) => {
        ctx.response.body = `Eikon v${constants.version} running on Deno v${Deno.version.deno} ${Deno.build.arch}
            \nStart by forwarding a gallery to this site (https://imgur.com/a/ABCD > https://[URL]/a/ABCD)
            \nRedirector (browser extension) can also be used to seamlessly forward requests`;
    })
    .get("/t/:tag/:id", async (ctx) => await galleryHandler(ctx))
    .get("/gallery/:id", async (ctx) => await galleryHandler(ctx))
    .get("/a/:id", async (ctx) => await galleryHandler(ctx))
    .get("/:id", async (ctx) => {
        let ID = ctx.params.id;

        for (const ext of [".mp4", ".png", ".jpg"]) {
            if (ID.includes(".")) {
                ID = ID.split(".")[0];
            }

            const endreq = await fetch(`https://i.imgur.com/${ID + ext}`, reqOpts);

            if (endreq.ok) {
                const file = `https://${constants.cdn}/${ID + ext}`;

                switch (ext) {
                    case ".mp4":
                        return ctx.response.body = constants.siteMarkdown.header + `<video onloadstart="this.volume=0.3" muted autoplay loop playsinline controls preload="none" poster="${file.replace(".mp4", ".jpg")}"><source src="${file}" type="video/mp4"></video>` + constants.siteMarkdown.footer;
                    case ".png":
                    case ".jpg":
                        return ctx.response.body = constants.siteMarkdown.header + `<a href="${file}" target="_blank"><img src="${file}" loading="lazy"></a>` + constants.siteMarkdown.footer;
                }

                break;
            }
        }

        return ctx.response.body = "Not Found.";
    });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening.");

await app.listen({ port: Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")!, 10) : 8080 });
