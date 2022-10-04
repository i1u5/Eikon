# Eikon

![comparison screenshot between Eikon and Imgur](https://raw.githubusercontent.com/i1u5/Eikon/main/.github/showcase.png)

A read-only self hostable & bloatless gallery for Imgur, inspired by [Kevin](https://git.voidnet.tech/kev)'s [imgin project](https://git.voidnet.tech/kev/imgin), but made in Deno with support for better performance and more features.

A cloudflare worker is required if you wish to proxy, but worry not, it already [exists](https://github.com/i1u5/wrangler-cdn) (you can also use the public one there "cdn.medzik.xyz", but it might be slow or quickly reach quota).

## Goals

- The most ideal use case (which this was made for) is [Redirector](https://github.com/einaregilsson/Redirector) ([example config file](https://github.com/i1u5/Eikon/blob/main/Redirector.json)), an extension that redirects links before they load, that way only a change of domain would be required without modifying the rest of the URL,

- Inline Frame support,

- Bloatless interface ([KISS principle](https://en.wikipedia.org/wiki/KISS_principle)),

- Making videos more accessible,

- (TODO) Image descriptions/titles w/ a more "blogg-y" design.

## Non-Goals

- Social media replacement (comments, etc),
- Scrapping/Ripping, while this tool can use scrapping methods it is in no way meant to mass download images and is not able to do so,
- Caching images or restoring already deleted ones for doxxing purposes (images won't show up after they are deleted from Imgur, the only caching method used here is CloudFlare and it refreshes quickly).

## Usage
```
deno run --allow-net --allow-env ./main.ts
```

## License

[BSD-3-Clause](https://github.com/i1u5/Eikon/blob/main/LICENSE)
