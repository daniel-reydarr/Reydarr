# 08 UI writing

Applies to every word in the Reydarr app and marketing site. Zuri's generated copy for customer sites follows the text rules in AGENTS.md section 3 and the master plan.

## Voice

Warm, brief, plain. Natural Nigerian English. Talk like a helpful colleague who respects the owner's time. Never childish, never corporate, never hype.

## Rules

- Sentence case for titles, buttons and menus. "Review drafts", not "Review Drafts".
- Buttons start with a verb and name the result: "Publish site", "Save changes", "Send reply". Avoid "Submit", "OK", "Yes".
- No em-dashes anywhere. Use a full stop, a comma or a colon.
- No exclamation marks except in a real success moment, and then one at most.
- No jargon. Use "website address", not "domain" or "DNS", unless the owner is on the custom domain screen, and then explain it once in plain words. Use "visits", not "sessions". Use "requests", not "leads" (R27).
- Say what happened, then what to do. Never blame the owner.
- Use "you" and "your". Zuri speaks in the first person: "I wrote three drafts."
- Zuri never invents facts, reviews or numbers. If it does not know, it asks.
- Placeholders in design files and mockups use brackets, like [Your business name].

## Formats

| Thing | Format | Example |
| --- | --- | --- |
| Naira | ₦ before the amount, comma grouping, no decimals for whole naira | ₦10,000 |
| Money in data | Integers in kobo in storage, formatted at display (AGENTS.md) | 1000000 kobo shows ₦10,000 |
| Date | Day, short month, year | 23 Nov 2026 |
| Time | 12-hour, lowercase am or pm, Africa/Lagos | 5:30 pm |
| Relative time | Under 24 hours "2 hours ago", then the date | 2 hours ago |
| Phone | International with spaces | +234 801 234 5678 |
| Numbers | Comma thousands, tabular figures | 12,480 |
| Lists | Oxford comma is not used | A, B and C |

## Messages

| Type | Pattern | Example |
| --- | --- | --- |
| Error | What happened, what to do | "We could not save your changes. Check your connection and try again." |
| Validation | Under the field, specific | "Use letters, numbers and dashes only." |
| Success | State the result | "Your site is live." |
| Empty state | What goes here, one action | "No requests yet. Share your site link to start receiving them." |
| Confirm destructive | Name the thing, state the effect | "Delete the Contact page? Visitors will no longer see it." Button: "Delete page" |
| Loading | Say what is happening if over 2 seconds | "Zuri is writing your drafts" |
| Permission or plan limit | Plain reason, one next step | "You have used this month's drafts. Upgrade to Pulse for more." |

Errors shown to owners never expose internals, IDs, stack traces or provider names (AGENTS.md section 7).

## Checklist before shipping any screen

- Every button begins with a verb.
- No jargon an owner would not use.
- No em-dashes and no exclamation marks beyond one success moment.
- Every error says what to do.
- Naira, date and time follow the formats above.
- Every empty state has a sentence and an action.
- Text still fits at 320px and 200% zoom.
