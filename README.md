<div align="center">
<h1>
tusked <sup>pre-alpha</sup>
</h1>

A modern and customizable Mastodon web client.

</div>

Tusked is an alternative web client (+ PWA) for Mastodon being built using [Astro](https://astro.build) by the [creator](https://mementomori.social/@raikas) of [Mastopoet](https://mastopoet.ohjelmoi.fi).

> [!WARNING]  
> Tusked is missing most of the features planned currently, and will probably have a lot of bugs.
> <br />**Usage is not recommended, unless you are ready to withstand bugs, and report them to the developers.**

Official deployment (not available yet):

- 🏭 Production: [tusked.app](https://tusked.app)
  - Branch: `production`
  - Hopefully more stable than nightly
- 🌛 Nightly: [nightly.tusked.app](https://nightly.tusked.app)
  - Branch: `main`
  - New features instantly available
  - New bugs also instantly available

## Features (💡 = planned)

- 💡 Feed-wide post editor
- 💡 Rich post editor (highlighting links, mentions and hashtags)
  - 💡 Support for formatting (only visible to other users of Tusked, via CSS classes)
- 💡 Popover with user profile when hovering username (allowing to follow without having to click to profile)
- 💡 Easy and simple interactions between Mastodon instances
- 💡 Syncing read notifications between multiple tabs
- 💡 Support for quoting posts (link to other post being last thing in a post)
- 💡 Grouped notifications
- 💡 Persist drafts between sessions
- 💡 Automatic Mastodon link detection and opening in app (even with PWA if possible?)
- 💡 DeepL translate posts (option to automatically?)
  - 💡 Automatic post language detection (at least suggest, "is this post in <lang>?")

### Ideas

Here's some stuff I have thought of, but not sure if I should implement them.

- Allowing to view instances local feeds
- Thread numbering (from Phanpy)
- Boost icon to rocket (at least on default theme, from Phanpy)

## Why build you own client?

- Mastodon client is missing some QoL features I'd prefer to have, that can't be solved with CSS
- I didn't want to learn Ruby and tweak around Mastodon's code to make changes (or maintain my own instance, or make code that might break the next update).
- Elk is made with TailwindCSS, making it hard to customize the look of it (outside of the provided color options).
  - I'm not familiar with Vue, and there's ~25 directories in the root! Seemed too complicated to bother learning how to use Vue and contribute
- Phanpy is going bit in the wrong direction for my use case and liking, but that's 100% fine! That's the point of being opinionated.
  - Uses JavaScript and not TypeScript :/

Mastodon Bird UI is already great, but having to interact outside of your instance is still hard. I want a smooth experience, and allow people to customize the client to their needs, without having to host an instance themselves, or use extensions (I still haven't figured out how to properly use Stylus).

## Theme

The default UI is heavily inspired by [Mastodon Bird UI](https://github.com/ronilaukkarinen/mastodon-bird-ui) by [Roni Laukkarinen](https://mementomori.social/@rolle).
We decided to use SCSS, and not an UI framework to allow for theme support to be implemented easily in the future, and for cleaner code. This also one of the reasons I decided not to go with with [Elk](https://github.com/elk-zone/elk).

## Tusked isn't for me, where should I look next?

Sad to see Tusked isn't for you, at least at it's current stage.

- [Elk](https://elk.zone) is similar to Tusked, but is more opinionated and limited.
- [Phanpy](https://phanpy.social/) is an minimalistic and very opinionated Mastodon client
- [Phanpy's list of alternative Mastodon clients](https://github.com/cheeaun/phanpy#user-content-alternative-web-clients)

## Tech stack

- [Vite](https://vitejs.dev) (build tool)
- [Preact](https://preactjs.com/) (UI library)
- [Valtio](https://valtio.pmnd.rs) (State management)
- [Masto.js](https://github.com/neet/masto.js/) (Mastodon API client)
- [Vite PWA](https://github.com/vite-pwa/vite-plugin-pwa) (PWA support)
- SCSS + PostCSS (✨🖌️ theme support planned)

## Privacy policy

Tusked doesn't collect any personal data. Read more about service providers (anonymous analytics, error logging, hosting) in [PRIVACY.md](https://github.com/raikasdev/tusked/blob/main/PRIVACY.MD).

## Credits

- Tusked includes code from [Phanpy](https://github.com/cheeaun/phanpy) licensed under MIT, consult LICENSE-MIT
