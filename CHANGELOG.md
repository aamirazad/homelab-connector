# Changelog

All notable changes to this project will be documented in this file.

## v0.6.0

Mainly just package updates as I have moved on from this project to work on other projects.

### Features

- feat: add umami analytics @aamirazad (#135)

### Bug Fixes

- fix(deps): update dependency drizzle-orm to ^0.38.0 @renovate (#156)
- fix(deps): update react monorepo to v19.0.0 @renovate (#157)
- fix(deps): update nextjs monorepo to v15.1.4 @renovate (#158)
- fix(deps): update dependency next-themes to ^0.4.0 @renovate (#152)
- fix(deps): update dependency drizzle-orm to ^0.36.0 @renovate (#150)
- fix(deps): update react monorepo to v19.0.0-rc-fb9a90fa48-20240614 @renovate (#146)
- fix(deps): update dependency @<!---->clerk/nextjs to v6 @renovate (#143)
- fix(deps): update dependency drizzle-orm to ^0.35.0 @renovate (#141)
- fix(deps): update dependency drizzle-orm to ^0.34.0 @renovate (#139)
- fix(deps): update dependency @<!---->vercel/postgres to ^0.10.0 @renovate (#133)

### Documentation

- docs: add wakatime hours spent badge @aamirazad (#130)

### Maintenance

- chore(deps): update dependency drizzle-kit to ^0.30.0 @renovate (#155)
- chore(deps): update nextjs monorepo to v15.0.3 @renovate (#154)
- chore(deps): update dependency drizzle-kit to ^0.28.0 @renovate (#153)
- chore(deps): update dependency drizzle-kit to ^0.27.0 @renovate (#149)
- chore(deps): update nextjs monorepo to v15.0.2 @renovate (#148)
- chore(deps): update dependency @<!---->types/react-dom to v19.0.0 @renovate (#145)
- chore: remove github pull requrest template @aamirazad (#147)
- chore: update to nextjs v15 (major) @aamirazad (#144)
- chore(deps): update dependency drizzle-kit to ^0.26.0 @renovate (#140)
- chore(deps): update dependency drizzle-kit to ^0.25.0 @renovate (#138)
- chore(deps): update ytanikin/prconventionalcommits action to v1.3.0 @renovate (#137)
- chore: renovate ignore lucide react @aamirazad (#136)

## v0.5.0

Version 0.5.0 adds a more streamlined way of searching for you documents. Now when you search, you will be given all of the documents that match that search criteria and a thumbnail of the first page. Clicking on this will then link you to that document's specific site where more features will be found.

### Features

- feat: simplify setings page @aamirazad (#126)
- feat: paperless search result previews @aamirazad (#122)
- feat: add posthog analytics @aamirazad (#119)

### Bug Fixes

- fix(deps): update dependency lucide-react to ^0.429. @reno (#125)
- fix(deps): update dependency drizzle-orm to ^0.33.0 @renovate (#124)
- fix: minor visual changes on the details page @aamirazad (#118)
- fix: rework skeleton loader for the thumbnail loading @aamirazad (#117)

### Maintenance

- chore: switch from fetch to ky @aamirazad (#128)
- chore(deps): update dependency drizzle-kit to ^0.24.0 @renovate (#123)
- chore: move unnecessary components directly to the page @aamirazad (#121)
- chore(deps): update typescript-eslint monorepo to v8 (major) @renovate (#113)
- chore(deps): update dependency @<!---->types/node to v22 @renovate (#112)

## v0.4.0

It's been a while. I've been super busy and this release has been so close to being published for so long and finally I got the time to fix it up. As usual, there is so much more I want to do but here is what I've got right now. This release adds more backend work as well as a minor, but necessary frontend change. On paperless, when you click on a result, you will see a thumbnail image of the pdf and if you want to see the whole pdf, you have to click the view details button. This page will bring a much more functionality than the modal provides.

### Features

- feat: seperate paperless viewer into preview and details pages @aamirazad (#86)
- feat: Add buttons to both document and audio viewer @aamirazad (#85)
- feat: setup dependabot @aamirazad (#96)
- feat: remove renovate @aamirazad (#95)

### Bug Fixes

- fix: use mjs for next config to fix es module errors @aamirazad (#109)
- fix(deps): update dependency lucide-react to ^0.414.0 @renovate (#80)
- fix(deps): update dependency @<!---->vercel/postgres to ^0.9.0 @renovate (#83)
- fix(deps): update dependency drizzle-orm to ^0.32.0 @renovate (#89)
- fix(deps): update dependency @<!---->t3-oss/env-nextjs to ^0.11.0 @renovate (#106)
- fix: renovate config error @aamirazad (#93)
- fix: properly redirect back to earlier page after clicking sign in @aamirazad (#87)

### Maintenance

- chore: remove unnused react pdf packages @aamirazad (#114)
- chore(deps): update dependency @<!---->types/eslint to v9 @renovate (#107)
- chore(deps): update dependency drizzle-kit to ^0.23.0 @renovate (#88)
- revert: slow down renovate prs @aamirazad (#105)
- revert: remove renovate @aamirazad (#104)
- revert: setup dependabot @aamirazad (#103)
- chore: slow down renovate prs @aamirazad (#91)

## v0.3.0

This release adds the [whishper](https://whishper.net/) integration. All you have to do is just enter the url, and since it interacts with the api from your computer (not my server) you don't have to worry about authentication (whishper doesn't have any right now). From there you can search your recordings and listen to them. Do note that video playback will not work and may break things and you cannot read the transcript right now.

### Features

- feat: add whishper table to show data @aamirazad (#64)
- feat: add whishper integration @aamirazad (#62)
- feat: show a fun fact while pdf is loading @aamirazad (#53)
- feat: skeleton loaders instead of spinner @aamirazad (#49)

### Bug Fixes

- fix(deps): update dependency lucide-react to ^0.401.0 @renovate (#79)
- fix(deps): update dependency lucide-react to ^0.400.0 @renovate (#74)
- fix(deps): update dependency @<!---->vercel/postgres to ^0.9.0 @renovate (#72)
- fix: standardize link formatting @aamirazad (#57)
- fix: format failed to get document text @aamirazad (#56)
- fix: clicking back doesn't re query search @aamirazad (#54)
- fix: only download the pdf once @aamirazad (#50)

### Documentation

- docs: write whishper documentation @aamirazad (#81)
- docs: update task list with paperless and whishper @aamirazad (#67)
- docs: add badges to readme @aamirazad (#65)
- docs: add paperless cors env documentation @aamirazad (#58)

### Maintenance

- chore(deps): update oven-sh/setup-bun action to v2 @renovate (#77)
- chore(deps): update actions/checkout action to v4 @renovate (#75)
- chore(deps): update pnpm to v9.4.0 @renovate (#71)
- chore: configure renovate @renovate (#70)
- chore: add blank spaces to github pr template @aamirazad (#68)
- chore(deps): update react alert dialog @aamirazad (#61)
- chore: add pr template @aamirazad (#60)
- ci: use github's autolink to link to prs in release @aamirazad (#52)

## v0.2.0

Very exciting commit. I did a lot of work but there is not much changes to the website, I hope I will be able to release new features faster, but the big new feature of this release is being able to preview your paperless document. This means, after searching, you can click on the document to open a preview of it. Soon, there will be buttons to edit properties and connect them to other documents (the whole point of the project) but these is the necessary base features to do that. I'll try to write some proper documentation for how to do the paperless document, but for now, know you need to edit the CORS_ALLOWED_HOSTS property in you paperless configuration to my domain to allow for preview of documents. I hope to find a way around this in the future, but for now, this is the easiest way to get around cors.

### Features

- feat: paperless documents modal @aamirazad (#38)
- feat: fill in current data in settings @aamirazad (#33)
- feat: remove all done page in settings @aamirazad (#32)
- feat: use paperless documents api instead of search to get more accurate results @aamirazad (#24)
- feat: use a tooltip/popover component @aamirazad (#26)
- feat: make website look better on mobile @aamirazad (#20)
- feat: remove full name settings question @aamirazad (#22)

### Performance Improvements

- perf: reduce size of paperless documents api request response using flags @aamirazad (#39)
- perf: speed up settings autofilling by only calling db calls once @aamirazad (#35)

### Bug Fixes

- fix: broken top nav on mobile when signed out @aamirazad (#44)
- fix: resolve eslint errors by deleting popover component @aamirazad (#42)

### Documentation

- docs: add explanation about the project in the readme @aamirazad (#45)

### Maintenance

- chore: Release v0.2.0 @aamirazad (#48)
- ci: add style labels to release draft @aamirazad (#47)
- ci: bring back conventional commit pr tagger @aamirazad (#46)
- chore: update vs code workspace settings @aamirazad (#40)
- ci: add conventional commit checker and eslint checker @aamirazad (#41)
- chore: add funding links to github @aamirazad (#37)
- ci: combine release drafter and pr tagger into one action @aamirazad (#36)
- refactor: use database types instead of manually typed types @aamirazad (#34)
- chore: switch to bun @aamirazad (#31)
- refactor: remove unnecessary code @aamirazad (#29)
- refactor: fix eslint issues @aamirazad (#28)
- ci: fix pr labeler @aamirazad (#21)

## v0.1.0

Homelab connector is finally usable to the public. There are so many features I want to add, but right now, you can create an account, set your paperless url and token, and then search your paperless documents.

### Features

- feat: separate user config @aamirazad (#18)
- feat: revert dev dependencies to enable eslint linting @aamirazad (#16)
- feat: top nav sign out behavior @aamirazad (#14)
- feat: user profile dropdown & settings @aamirazad (#12)
- feat: user setup page and flow @aamirazad (#10)
- feat: create user table @aamirazad (#7)

### Performance Improvements

- perf: set avatar image priority @aamirazad (#17)

### Bug Fixes

- fix: add null checks to paperless document search @aamirazad (#6)

### Maintenance

- refactor: fix eslint issues @aamirazad (#19)
- refactor: rename setup route to settings @aamirazad (#13)
