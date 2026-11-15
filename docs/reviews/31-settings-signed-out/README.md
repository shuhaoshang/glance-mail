# Settings and signed-out review

Task 31 implements [issue #63](https://github.com/shuhaoshang/glance-mail/issues/63).

## Screenshots

Desktop captures use 1280 × 1000 and phone captures use 390 × 844. Full-page captures include content below the viewport. The browser emulates the theme and reduced motion.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya settings | [Light](maya-desktop-light.jpg) | [Dark](maya-desktop-dark.jpg) | [Light](maya-phone-light.jpg) | [Dark](maya-phone-dark.jpg) |
| Daniel settings | [Light](daniel-desktop-light.jpg) | [Dark](daniel-desktop-dark.jpg) | [Light](daniel-phone-light.jpg) | [Dark](daniel-phone-dark.jpg) |
| Sarah settings | [Light](sarah-desktop-light.jpg) | [Dark](sarah-desktop-dark.jpg) | [Light](sarah-phone-light.jpg) | [Dark](sarah-phone-dark.jpg) |
| Signed out | [Light](signed-out-desktop-light.jpg) | [Dark](signed-out-desktop-dark.jpg) | [Light](signed-out-phone-light.jpg) | [Dark](signed-out-phone-dark.jpg) |

Before this issue, the account menu exposed Appearance. [Previous desktop](../30-account-menu-theme/maya-desktop-light.jpg) · [Previous phone](../30-account-menu-theme/maya-phone-dark.jpg)

Design references include the [light Settings page](../../screens/v2/settings.png), [dark Settings page](../../screens/v2/dark-settings.png), and [signed-out screen](../../screens/v2/signed-out.png).

## How to review

1. Open Patterns / Settings / Daniel. Inboxes shows both Gmail accounts and Quiet hours starts on. Maya has one account and Sarah has Gmail and Yahoo Mail. Quiet hours starts off for both.
2. On desktop, use the section links and check heading focus. The account menu’s Inboxes item opens Settings with the Inboxes section focused.
3. Change a time, notification, and Quiet hours setting. Return to the brief and reopen Settings to check the session values. Change Theme and confirm the account menu shows the same preference.
4. Try Disconnect, Connect, and Delete. Each surfaces the demo confirmation. OK returns focus to the trigger.
5. Log out from the account menu or Settings. Continue with Microsoft and Continue with Google both return to the brief. Check that the demo controls are visible on Settings and the signed-out screen.

## Open questions

- The spec supplies default times. The proposal is to use 7:00 / 7:30 / 8:00 AM for the brief, 6:00 / 7:00 / 8:00 PM for From, and 6:00 / 7:00 / 8:00 AM for Until. The demo selects currently use these options.
- The multi-inbox mock data supplies Work, Personal, and Family labels and a single persona email. The current rows show the supplied inbox labels. Add address strings to the mock account data if the rows should show separate addresses.
- The references show a filled current section link, a tinted Connect button, and a primary Microsoft button. The written spec defines a text treatment for the current link, outline Connect, a text Delete action, and two outline sign-in buttons. The implementation follows those written styles.
