# Task 13 edge states

Open **Patterns/Edge states** in Storybook. The screenshots show the web content at 390 × 844. The reference images include phone system chrome.

| Story or state | Reference | Light | Dark |
| --- | --- | --- | --- |
| First brief | [Phone reference](../../screens/phone-first-brief.png) | [Light](first-brief-light.jpg) | [Dark](first-brief-dark.jpg) |
| Notification requested | Approved in PR #44 | [Light](first-brief-confirmed-light.jpg) | [Dark](first-brief-confirmed-dark.jpg) |
| New mail | [Phone reference](../../screens/phone-new-mail.png) | [Light](new-mail-light.jpg) | [Dark](new-mail-dark.jpg) |
| Disconnected | [Phone reference](../../screens/phone-disconnected.png) | [Light](disconnected-light.jpg) | [Dark](disconnected-dark.jpg) |
| Overload, first four | [Phone reference](../../screens/phone-overload.png) | [Light](overload-light.jpg) | [Dark](overload-dark.jpg) |
| Overload, after reveal | Approved in PR #44 | [Light](overload-expanded-light.jpg) | [Dark](overload-expanded-dark.jpg) |
| Quiet hours | [Phone reference](../../screens/phone-quiet-hours.png) | [Light](quiet-hours-light.jpg) | [Dark](quiet-hours-dark.jpg) |

The browser checks covered both themes and the acceptance criteria for Daniel 8 and Sarah 6–7. First brief retained progress and skeleton after confirmation. New mail retained the pending row and ranking after Add to brief. Disconnected stayed partial after Reconnect, and Quiet hours showed only Personal mail after Show work email anyway.

Before reveal, Needs you ended at 720 px within the 844 px viewport. The expanded story retained all 12 rows in order, each with the phone chevron. The reveal removed Show 8 more and moved focus to rank 5. Browser emulation verified a static skeleton and immediate row entrance under reduced motion.
