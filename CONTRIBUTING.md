# Contributing

Thanks for helping improve dsh-f1-skin. Keep changes focused on presentation;
the skin must not replace, cover, or intercept existing DeepSeek Harness
controls.

## Local checks

Use Node.js 20 or newer:

```bash
npm install
npm run quality
```

For browser checks, start a DSH Web profile with this repository linked, then:

```bash
DSH_URL=http://127.0.0.1:3080 npm run test:e2e
```

Before opening a pull request, verify light and dark appearance, all four team
themes, settings open/close, compact width, reduced motion, and the visibility
and clickability of the native DeepSeek/HARNESS and workspace controls.

## Assets

Do not add an image unless its source, author, license, modification status, and
redistribution terms are recorded in `THIRD_PARTY_NOTICES.md`. Do not add a logo
or trademark merely because it can be downloaded; explain the intended
referential use and preserve the non-official status of the project.
