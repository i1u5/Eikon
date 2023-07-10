const constants = {
    // CDN url !!without a trailing slash!! from >> https://github.com/i1u5/wrangler-cdn
    cdn: "cdn.medzik.xyz",
    // User agent for the requests, the default does the job
    reqUA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    // Cookie to be used for requests, set it to 0 if you don't want to process NSFW galleries
    reqCookie: "over18=1",
    // Temporary render solution until more complicated operations are required
    siteMarkdown: {
        header:
            `<!DOCTYPE HTML><html lang="en"><head><meta charself="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Eikon</title><link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>"><style>body{background-color:rgb(0 68 139);color:rgba(255,255,255,.8);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,sans-serif;line-height:1.3;margin:0;padding:3vw}a,a:visited{color:#fff}ul{list-style-type:none}p,ul{max-width:80ch}img,video{max-width:100%;height:auto;margin-bottom:3vw}</style></head><body><center>`,
        footer:
            `</center><footer><small>Built with 💖 by <a href="https://github.com/i1u5">Ilµs</a><br>Inspired by 📷 <a href="https://git.voidnet.tech/kev/imgin">Imgin</a><br>This website does not claim ownership of any media.<br>This service simply acts as a proxy to Imgur.com and does not store any images.<br>Abusive images should be reported to imgur. This website does not create new images.<br>Do not use this service to facilitate scraping or as an image CDN.</small></footer></body></html>`,
    },
    version: "1.0.0"
};

export default constants;
