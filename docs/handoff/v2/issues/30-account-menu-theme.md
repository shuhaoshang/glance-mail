# 30 · Account menu and theme

**Label:** `feat` · **Depends on:** 26

## Why
Dark mode must be reachable from the product itself, and the avatar must do something.

## Decisions already made
1. The theme control moves out of the demo bar (D57). Storage and the system default stay as built.

## What to build
- The avatar button and its menu (§9.12) on desktop and phone.
- Theme control wired to the existing theme preference; remove the control from the demo bar and from its tests.
- “Inboxes”, “Settings” and “Log out” are added in issue 31. Until then the menu contains identity and Appearance only (no dead items).

## Acceptance criteria
- [ ] Choosing Dark, Light or System applies at once, survives a reload, and System follows the device.
- [ ] The menu closes on Escape, on an outside click and after focus leaves it; focus returns to the avatar.
- [ ] On the phone the Appearance control is full width with 44-tall segments.
- [ ] The demo bar no longer has a theme control; persona, levels and Simulate reply are unchanged.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.12 · `docs/screens/v2/account-menu.png`, `phone-account-menu.png`

## Out of scope
Settings and signing out.
