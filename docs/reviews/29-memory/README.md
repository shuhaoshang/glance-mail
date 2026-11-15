# Memory review

Task 29 implements [issue #61](https://github.com/shuhaoshang/glance-mail/issues/61).

## Screenshots

Desktop captures use 1280 × 1000 and phone captures use 390 × 844. The browser emulates light or dark mode and reduced motion. Full-page captures include content below the viewport.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya | [Light](maya-desktop-light.jpg) | [Dark](maya-desktop-dark.jpg) | [Light](maya-phone-light.jpg) | [Dark](maya-phone-dark.jpg) |
| Daniel | [Light](daniel-desktop-light.jpg) | [Dark](daniel-desktop-dark.jpg) | [Light](daniel-phone-light.jpg) | [Dark](daniel-phone-dark.jpg) |
| Sarah | [Light](sarah-desktop-light.jpg) | [Dark](sarah-desktop-dark.jpg) | [Light](sarah-phone-light.jpg) | [Dark](sarah-phone-dark.jpg) |
| Add form | [Light](add-form-desktop-light.jpg) | [Dark](add-form-desktop-dark.jpg) | [Light](add-form-phone-light.jpg) | [Dark](add-form-phone-dark.jpg) |
| Learned pattern saved as an instruction | [Light](promoted-desktop-light.jpg) | [Dark](promoted-desktop-dark.jpg) | [Light](promoted-phone-light.jpg) | [Dark](promoted-phone-dark.jpg) |
| Removal with Undo | [Light](removed-desktop-light.jpg) | [Dark](removed-desktop-dark.jpg) | [Light](removed-phone-light.jpg) | [Dark](removed-phone-dark.jpg) |

Compare with the [previous desktop header](../28-watchlist/maya-desktop-light.jpg), [previous phone header](../28-watchlist/maya-phone-light.jpg), and the [desktop](../../screens/v2/memory.png), [phone](../../screens/v2/phone-memory.png), and [dark](../../screens/v2/dark-memory.png) references.

## How to review

1. Open Patterns / Memory / Maya. The desktop tab shows Memory 5 and the panel shows Your instructions 2 and Learned 3.
2. Edit the first learned pattern and save. It becomes the last instruction with “Was learned · edited just now.” The section counts change to 3 and 2. Undo restores the pattern and its metadata to the original position.
3. Add an instruction, edit an existing instruction, and remove an item from either section. Check the toast and Undo after each saved change. Enter submits. Escape and Cancel close the form. Save and Add reject whitespace-only input.
4. At phone width, check that Edit and Remove sit on their own row under the metadata, aligned right. Both controls have 44 × 44 targets. Back to brief returns to the previously selected email tab.
5. Switch between Watchlist and Memory with the arrow keys on desktop. Switching personas resets Memory edits.

## Open questions

The documents specify “Added today” for new instructions and give edited learned patterns an explicit position at the end of Your instructions. The position of a newly authored instruction is unspecified. The implementation appends new entries to the same section and preserves the existing order. The proposal is to keep this ordering for both ways of creating instructions.
