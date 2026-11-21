# Reydarr Master Plan

*Run the map.*

Prepared for Code on 19 November 2026. Status: Layers 1 to 13 are planned and ready for build specifications.

This document records every decision, direction, reason and technology agreed in the planning conversation, from the first audit of the old Zuri platform to the build order. It is written so that Code can paste it into other tools and chats, and so that a coding agent (DeepSeek or FreeBuff) can be briefed from it without guessing.

## 0. How to read this document

- Sections 1 to 3 give the vision, the history and the working method.
- Sections 4 to 16 follow the layers in the order they were planned: product, website engine, content engine, growth, onboarding, accounts, billing, brand, compliance, data model, AI layer, stack, build order.
- Section 17 holds the money: AI costs, margins and infrastructure costs.
- Section 18 lists what is still open, the risks, and the planning areas that remain.
- Appendix A is the full numbered decisions log (R1 to R136). Appendix B explains technical terms in plain language. Appendix C lists the brand asset pack. Appendix D lists sources.
- Figures marked "to verify" came from third-party pages or from memory and must be checked on the provider's own site before money is spent.

---

## 1. Vision in brief

**Reydarr** (reydarr.com) is an AI visibility engine for Nigerian small businesses. A business owner signs up, answers a few questions, and receives three things: a real multi-page website personalized to the business, a stream of ready-to-post social content, and the growth tools (SEO, analytics, requests, reviews) that make the online presence sustainable.

**The problem.** Owners of schools, salons, restaurants and clinics spend large amounts of money, time and effort on developers, social media teams and content ideas, and most lack the time or knowledge to understand SEO, traffic and basic web concepts, let alone apply them. Reydarr replaces that whole chain with one platform and one assistant.

**Zuri** is the single AI assistant inside Reydarr. The owner talks to Zuri to edit the site and to request content. Zuri keeps its name. Reydarr is the platform brand. **Cartiphy** remains the separate product for online stores, and Reydarr serves every other category.

**Tagline:** "Run the map." (A professional trademark search is still pending.)

**Success in year one:** 50 to 100 businesses launched and working, plus revenue, paying businesses and signups.

**Build constraints:** one founder, 5 to 10 hours a week, target launch February to April 2027, built through deployed previews (not local builds), and a way to pay in dollars.

---

## 2. Where this started: the old Zuri audit

The conversation began with Code asking for a rebuild and rebrand of the existing Zuri platform (app.buildzuri.com). Seven read-only audit reports were produced by FreeBuff and reviewed. Key findings:

| Area | Finding |
| --- | --- |
| Output quality | The product was not generating websites. It picked one of 8 fixed archetypes by category, filled about 30 text placeholders from roughly 6 facts, and invented testimonials, stats and credentials because onboarding never collected them. Photos and hours were never asked for. |
| Diagnosis | This is a product-architecture ceiling, not a prompt problem. Better models would not fix it. |
| AI coupling | 26 Gemini call sites imported one library directly with no abstraction layer. Nothing streamed. No chatbot existed, so the Zuri assistant is a greenfield build. |
| Security | A service account file and a local env file sat in the repo root. Two public routes allowed any origin. A security migration may not have been applied to production. Every key that ever lived in the old repo should be treated as burned and rotated. |
| Business logic | The trial logic contradicted itself: the database gave every signup 14 days of Pro while the code allowed only Growth to be trialed. |
| Repo state | 62 uncommitted changes. The `templates-v2/` folder (82 templates) was never read. |
| Rename scope | About 456 hits in the source, plus hundreds more in marketing and docs, 31 browser storage keys and 2 cookies. |

**Decision that followed:** an absolute rebuild. Nothing is migrated. Old environment variables, keys, schema, templates and providers are discarded. The old repo is only a reference for facts such as the Nigerian cultural calendar and Flutterwave quirks. The stack (Next.js, Supabase, Vercel) stayed a candidate and was re-judged on merit in Layer 12. Code confirmed that "forget Vercel and Supabase" meant the old variables and schema, not the stack itself.

---

## 3. Working method and rules of engagement

- Claude acts as senior agent: architect, decision-maker and reviewer. Code builds; DeepSeek or FreeBuff writes code from precise specs.
- Stages: audit, diagnosis, confirm, then implementation spec. Specs are file-by-file and are written only after the plan is agreed.
- No build-plan discussion until Code had fully stated goals, preferences and scope. That condition was met before Layer 13.
- The work runs layer by layer. A running decisions log (R-numbers) is kept so Code can paste it elsewhere.
- Single direct recommendations with the trade-off, not option menus.
- Claude never asks for secrets. Keys go into the hosting provider's environment settings only.
- Everything is grounded in Reydarr's own product. Generic advice is rejected.
- "Reydarr" is always spelled with a capital R in copy and lowercase in the domain. Zuri stays the assistant's name.
- Code dictates much of his input, so spelling slips are expected (for example "Radar" for Reydarr, "Higgs field" for Higgsfield, "recent" for Resend).

---

## 4. Layer 1: Product and scope (R1 to R19)

| Decision | Reason |
| --- | --- |
| Multi-page real websites with working forms, navigation and personalized calls to action (R3, R20) | The old single-page output was boring and unsustainable. A business owner should feel safe and confident about the result. |
| 5 to 8 pages by default, chosen by the AI per business. Blog or news is an optional module the AI suggests (R20, R21) | Different businesses need different page sets. |
| Every category except online stores (R4) | Cartiphy owns e-commerce. |
| No complex backend for the customer's site (R5) | Keeps the sites fast, cheap and simple to host. |
| Websites, content and Zuri are equally important. Nothing ships half-working (R6) | Code will not launch with features below about 90% of their potential. |
| Editing by chat and simple forms. No visual editor. Code export later (R9) | A visual editor is the most complex to build and contradicts the promise of as little designing as possible. Owners wanting pixel control will not get it, which is accepted. |
| Core five launch categories: education, food and hospitality, beauty and wellness, health, professional services. Others use a flexible general structure and are deepened later (R10) | Depth over breadth. Nine categories done well was judged too much. Trades, creative and events, faith and community, and tech and agencies were considered and deferred. |
| Custom domains are a paid upgrade. Free sites use a reydarr.com subdomain (R11) | Standard model and a natural upgrade lever. |
| English only (R12) | Scope control. Nigerian registers of English are supported, and Pidgin only if the owner's tone sample uses it (R59). |
| The buyer is the owner only (R13) | Agencies and freelancers would be a bigger, different product. |
| One user can own multiple businesses (R16) | Many owners run more than one business. |
| One assistant, Zuri, for edits and content (R17). One identity across Reydarr and Cartiphy with separate products (R18) | One face for the user, separate codebases. |
| Phones, tablets and laptops equally important. No desktop-only features (R19) | Most Nigerian owners are mobile-first. |
| Budget about ₦0 to 20,000 a month, 5 to 10 hours a week, launch February to April (R7). Dollar payments possible (R14) | Stated constraints. Code later said the budget was not a worry for planning purposes. |
| Managed services only (no VPS) | With limited hours, time spent fixing servers is time not spent on features. |

**Request system.** Forms were renamed **Requests**: an umbrella for inquiries, appointments, reservations, quotes, applications, event RSVPs, newsletter signups and WhatsApp click-to-chat. Each is a module switched on or off per business, and the owner sees all of them in one inbox (R27, R52). The principle recorded: **features are modules, and the AI decides which modules, layouts and page structures each business gets.**

---

## 5. Layer 2: Website engine (R20 to R35, plus R53 to R56)

| Decision | Reason |
| --- | --- |
| Sites are composed from a **section library** plus a **per-business design recipe**. Whole-page templates are retired (R25) | Templates caused the generic, repetitive output. Identical inputs should rarely give identical sites (R22). |
| Personalization means a different layout and visual style per business and copy in the owner's tone with real details (R22) | Anti-generic. |
| The AI never fabricates testimonials, stats, awards or credentials. A missing fact hides the section or shows "add yours" (R23) | The old product invented credentials. This is a trust and legal issue. |
| No AI-generated images on websites. Real owner photos and a curated library only (R24) | Consistent with the no-fabrication rule. Higgsfield is for the content engine only. |
| Design system and sections are created by Code with AI-assisted design (R26). Library target about 30 to 45 sections (R123) | Quality control. This runs as its own workstream. |
| A feature catalog per category. Owners see the features that apply and toggle them (R27) | Not every feature applies to every business. |
| No embedded Google Map. No language switcher. Use a "Get directions" link (R28) | Performance and simplicity. |
| A consent banner appears only when the owner enables a tracking feature (R29) | The built-in analytics are cookieless. |
| The owner previews and approves a draft before publishing (R30) | Owner control and safety. |
| SEO is built in (R32): clean URLs with redirects, unique titles and descriptions, share images, canonical tags, robots.txt, heading structure, AI-written alt text, structured data (LocalBusiness, FAQ, service, event), Search Console verification and sitemap, a Google Business Profile guide, location keywords, an SEO health score, `llms.txt` for AI search, and a GA4 connection | Owners cannot be expected to understand SEO. |
| Logos: upload PNG, JPG or SVG with normalization, palette extraction, light, dark, icon and favicon variants, quality warnings, and a text wordmark fallback. Logo creation is deferred (R33) | Scope control. |
| Chat can edit content, reorder sections, swap variants and adjust recipe attributes but cannot invent sections. Whole-design regeneration is allowed, capped per plan (R34, R35) | Keeps edits safe and bounded. Regeneration costs money. |
| Auto-generated privacy page on customer sites, to be checked with a lawyer (R53) | Compliance. |
| Hard performance budget: small pages, compressed images, no heavy scripts, tested on throttled mobile connections (R54) | Nigerian mobile networks. |
| Quarterly freshness nudges from Zuri, such as "Are your fees still correct?" (R55) | Keeps sites accurate. |
| Category-specific claims guardrails: no medical claims or guarantees, no invented offers, no fake urgency, strictest for health (R56) | Legal and trust risk. |

---

## 6. Layer 3: Content engine (R36 to R47, R57 to R59)

| Decision | Reason |
| --- | --- |
| Outputs: static posts, carousels, stories, reels, ad creatives, captions with hashtags and calls to action, and a calendar. Download only, with auto-posting much later (R36) | Auto-posting needs platform approvals and adds risk. |
| Every post uses at least one real owner-supplied detail. The AI never invents facts or offers (R37) | Anti-generic and anti-fabrication. |
| Visuals: owner photos and branded layouts first, AI generation fills gaps, varied by category (R38) | Authentic look. |
| One brand kit (logo, colors, fonts, tone, do and don't) shared by the website and content engines (R39) | Consistency. |
| "World class" means a non-generic content hub UI and daily flow plus top-notch content (R40) | The system must keep users engaged, not be generic. |
| Home is a **Today** screen. The calendar is secondary (R41) | A daily habit loop. |
| **30-second photo capture**: a photo plus one line becomes a finished branded post. This is a headline feature (R42) | Lowest-effort path for a busy owner. |
| Feedback loop: one-tap self-report in v1, Instagram insights later (R43) | Learn what works without platform access. |
| Four asset shapes (square or portrait, vertical, video, text) cover Instagram, WhatsApp Status and broadcast, Facebook, TikTok and LinkedIn (R44) | One production run feeds many channels. |
| Reminders by push and email in v1, with a share-sheet handoff to Instagram and WhatsApp (R45) | Owners post manually, so reminders drive the habit. |
| Generate weekly, surface daily. Limit only what costs real money. Show "4 reels left", never "credits". Soft warning at 80%, in-progress pieces always finish, one-month rollover, optional top-ups (R46) | Friendly limits that protect margins. |
| Category content rhythms, content memory (no repeated hooks), voice learning from edits, and a history library (R47) | Anti-generic over time. |
| Existing-presence import in v1: Instagram bio, Google listing link and existing site link (R48) | Cuts onboarding typing. |
| Reels use only royalty-free or licensed audio, or none. Owners add trending sounds in-app themselves (R57) | Music licensing risk. |
| Voice is English with Nigerian registers (formal, warm, Nigerian conversational) (R59) | Authentic tone. |

---

## 7. Layer 4: Growth, SEO and analytics (R60 to R73)

- **Built-in cookieless analytics** on every site by default, with optional GA4 (R60). Basic analytics are not gated by plan (R61). Higher tiers get longer history, content attribution, period comparison, a downloadable monthly report, location and per-page conversion (R62). No heatmaps or session recordings (R63).
- **Search Console** is automated for every site in v1: reydarr.com is verified as a domain property, per-subdomain data comes through the API, and sitemaps are auto-submitted. Custom domains are verified per property (R64).
- **Google Business Profile** is guided setup: listing text, a checklist, name, address and phone consistency, plus Bing, Apple and Facebook listings. API integration only if access is approved (R65).
- **The dashboard ties visits and requests back to the content that drove them**, using tracked links (R66).
- **Reviews collection** in v1: a link, a QR code and a WhatsApp template. Only real reviews are displayed (R67).
- **Simple email marketing** in v1, with consent, unsubscribe and an allowance (R68).
- **Ads** in v1 are creatives plus guided launch. Live ad management is deferred (R69).
- Link-in-bio page, offer and promo pages and lead follow-up reminders are in v1 (R70). WhatsApp broadcast sending and competitor or keyword tips are later (R71).
- A simple customer list built from requests, signups and review contacts, with a note field and no pipelines (R72). Referral programs and reminders to the owner's customers are deferred (R73).

*Note: the Layer 10 data model reserves ads management, email marketing, reviews, Google Business Profile and directory checklists for after launch, even though some were in v1 scope here. They are built after the core launch (see section 16).*

---

## 8. Layer 5: Onboarding (R74 to R84)

- **Anonymous-first** with a live preview. Answers carry into the account at signup (R74).
- **Two stages:** a short Stage A, then a Zuri conversation in Stage B (R75). Tone is learned from sample paragraphs in different voices plus an optional pasted past caption (R76). Document upload (menus, fee schedules, brochures) and voice-note input are in v1 (R77).
- A first site draft and one finished post appear **before payment**. The 14-day trial begins at that moment (R78).
- **Stage A mandatory fields:** business name, category, offerings, city, WhatsApp number, business email, main goal, and an optional presence link (R79). Opening hours are mandatory in Stage A only for food and hospitality and for health (R83). Stage B fields are all skippable, and missing facts follow the no-fabrication rule (R80).
- **Safeguards:** consent to publish and accept terms at signup. Before publishing, the business email is verified by link and the WhatsApp number by a free "test your button" step. No API test message in v1, because it would add friction and cost (R81). WhatsApp numbers are normalized to international format and shown back to the owner (R84).
- Clean start. No Zuri accounts are migrated (R82).

---

## 9. Layer 6: Accounts and access (R85 to R101)

- One person, many businesses. Each business has its own site, brand kit, content hub, customer list, analytics and subscription. Nothing is shared except the login and profile (R85, R89). Billing is per business, with a discount on the second and later ones (R86). No hard cap on businesses (R91).
- A business switcher in the dashboard. Zuri is always scoped to the selected business and never crosses over (R87).
- v1 has one owner per business. The data model allows staff roles later (R88).
- Deleting a business includes a data export first and a 30-day undo window. Transfer to another person is later (R90).
- Login by Google or email magic link. No passwords (R92). Lost-access recovery through the verified business email or WhatsApp number plus manual support review (R93). Login email changes need confirmation at both addresses (R94). A signed-in device list with remote sign-out (R101).
- The trial belongs to the person and applies to their first business. Additional businesses go straight to paid with the discount (R95).
- Safety: a reserved-names list, risky-keyword flags, an abuse-report link on every site and fast suspension by admin (R96). A subdomain can be renamed once with an automatic redirect (R97).
- A small internal admin area in v1. Every admin action is logged and support views a business only with a logged reason, never secrets (R98).
- Export or delete all personal data from settings (R99). Notification preferences are set per business, with a person-level mute-all (R100).

---

## 10. Layer 7: Billing and pricing (R103 to R114)

### Structure

- Prices are shown in naira and reviewed quarterly (R103). Monthly and annual billing, with annual at about two months free (R104).
- Payments through **Flutterwave**: card, bank transfer and USSD. Renewal reminders cover methods that cannot auto-renew. Recurring support, fees and settlement still need checking on Flutterwave's own site (R105).
- Three paid tiers plus a trial. **Names chosen by Code: Ping, Pulse and Max.**
- Trial: 14 days, no card, a published subdomain site and a limited content allowance (R108).
- Failed payments: 14-day grace period, reminders by email and WhatsApp, then a polite "temporarily offline" page. Data is kept 90 days and reactivation is allowed (R49, R109).
- 7-day money-back window after the first payment (R110). Automatic emailed receipts and a downloadable billing history. Tax invoicing goes to compliance (R114).
- Optional top-up bundles for images and videos, shown as "reels left" (R112).
- Plan dials: posts and carousels (generous), AI images and videos, whole-design regenerations, email sends, analytics history, custom domain and footer-badge removal (R107).

### Prices (set by Code on 19 November 2026)

| Plan | Monthly price | Intended allowance (proposal, to be reset after the media bake-off) |
| --- | --- | --- |
| Ping | ₦10,000 | 10 AI stills, no video |
| Pulse | ₦20,000 | 30 AI stills, no video. Clips via top-up |
| Max | about ₦50,000 | 60 AI stills and 6 approved video clips a month, with up to 10 attempts. Failed attempts count against attempts, not clips |

**Reason for the higher prices:** Code judged the first proposal (₦7,500, ₦15,000 and ₦35,000) as too low for the market, especially Max, and the cost model showed healthy margins at his prices (section 17). Higher prices also absorb AI cost spikes.

**Founding-member price (R111):** the first 100 paying businesses get a locked lower price. Proposal: Pulse at ₦15,000, which still leaves about 50% margin. **This is not yet confirmed by Code.**

**Top-ups (accepted):** images and video clips only, because text is cheap enough to cover with fair-use limits. Indicative prices: about ₦300 per image and ₦2,500 per clip (for example 20 images for ₦6,000 or 3 clips for ₦7,500), roughly double cost. Allowances reset monthly. Purchased top-up credits carry over. Paid through Flutterwave and credited into the usage ledger.

**Max video rule (accepted):** animate the owner's own photos into 5 to 8 second reels, rather than generating scenes from scratch. This matches the no-fabrication rule. Pulse owners buy clips as top-ups.

**Trial cost control:** a trial that generates a full site plus images could cost about ₦4,500 if Sonnet wrote everything. Controls: cheap model for first draft, one regeneration, about 5 images, no video, and the WhatsApp check against repeat signups. Target about ₦1,500 per trial.

---

## 11. Layer 8: Brand and design system (R115 to R136)

### Identity

- **Name:** Reydarr. **Tagline:** "Run the map." (R115). The tagline came after many rejected generic options. Code supplied the shape "Run the ___" and chose "map."
- **Palette (R116, R126):** Ink `#0A0F1F`, Night `#151B30`, Bone `#F5F2EA`, Ping `#FF5A2C`, Ping Deep `#C73A0F` (orange text on light), Slate `#3A4052`, light border `#D8D3C5`, muted `#B9BDCB` on dark and `#5A6072` on light. A detour through sapphire, aqua and chrome palettes was rejected, and the original Ping and navy palette was restored. No second brand accent. Ping is used sparingly, about 10% of a screen. A separate functional set (success, danger, warning, info) avoids confusion with Ping. Ink text on Ping fills. A stepped navy neutral scale and a chart palette are included in the tokens file.
- **Chrome** is a finish (logo, borders, sheen, badges, hero moments), never a text or fill color (R125). Plan badges use chrome finishes, to be designed (R128).
- **Typography (R129):** Manrope 600 to 700 for headings and the wordmark, DM Sans for body and interface, tabular figures for numbers. Lexend was dropped.
- **Wordmark (R135):** Manrope Bold with about -3% tracking, hand-kerned, outlined for logo files, with clear space equal to the dot's diameter.
- **Mark (R117, R134):** a solid Ping dot with two concentric pulse rings on a 64-unit grid. Dot diameter 18, inner ring diameter 32 with stroke 3 at 40% opacity, outer ring diameter 54 with stroke 2.5 at 18% opacity, strokes centre-aligned. Variants: dark, light (solid peach rings `#F9B59E` and `#F7D7C8`), on-orange (Ink), compact (one ring and a larger dot, for 32px and below), and micro (dot only, for 16px). Tested at 16, 32, 64 and 512 px.
- **Zuri icon (R120, R133):** the angular mark rebuilt as a clean flat vector. Code wanted the 3D tilt of the original kept, so the rebuild uses the original's perspective: a left side slab, a shorter right side, and a bottom edge rising to the right, in flat colors with an optional chrome layer. No "ZURI" lettering in-app and no gold edge. Variants for dark, light, single-color and avatar. Inside Reydarr, Zuri adapts to Reydarr's brand.

### Design system decisions

- **Two separate design systems:** Reydarr's own app, and the customer-site system (section library and recipes), which uses each business's brand kit (R118).
- **Light and dark themes from day one**, through tokens (R119). The tokens file holds brand, color roles for both themes, type scale, spacing, radius, shadows and motion. Components read roles only (R130).
- **App reference: Framer's dashboard and UI feel** (R124).
- **Motion (R122, R131):** animations, transitions and interactions are in scope, scaled to device capability, with reduced-motion support and a mid-range Android performance budget. Motion must explain something, using shared easings and durations.
- App icons are one outline set. Illustrations appear only in empty states, in the brand palette (R132).
- A separate external Zuri app with its own brand kit is parked as a future scope question (R121).
- The section library and recipe creation runs as its own workstream with a handoff brief (R123).

---

## 12. Layer 9: Compliance

Code accepted the Layer 9 questions. Decisions and positions:

- **Business registration:** Code will register the business before launch (a CAC business-name registration is the likely route). Flutterwave live payouts usually need a registered business. Start early.
- **Legal review:** no lawyer budget. A one-time review by a lawyer contact is acceptable for now. Priority items: the privacy policy, the terms and the data-processor wording.
- **Roles:** each business owner is the data owner for the form submissions their site collects. Reydarr is the processor. The terms and privacy policy must say so.
- **Acceptable use:** an acceptable-use policy, a list of businesses Reydarr will not host, and a takedown process (supported by R96).
- **Photos of people:** the terms must cover who holds rights to uploaded photos of staff and clients, since the content engine reuses them.
- **AI disclosure:** say plainly that copy is AI-assisted and the owner approves it before it goes live.
- **Consent:** WhatsApp and email reminders need opt-in and a simple opt-out. Records of terms acceptance with version numbers are kept.
- **Tax, refunds and deletion:** VAT handling on subscriptions (reported as 7.5%, to verify), the 7-day refund rule, and whether deleted accounts are erased or exported first (answered in Layer 10: export, then erase after 30 days).
- **Provider data processing:** the old privacy page named Google Vertex AI as a processor. It must be rewritten for the new providers (OpenAI, Higgsfield, Supabase, Vercel, Resend and others).

Details still to confirm: legal entity form, VAT treatment, and the exact lawyer review scope (section 18).

---

## 13. Layer 10: Data model

### Records

- **Accounts and businesses:** a user who owns one or many businesses, with the category and profile fields on each business.
- **Billing:** a subscription per business, linked to Flutterwave payments.
- **Sites:** one per business, with pages, sections, the design recipe, and a saved snapshot each time it is published. Previews are separate from live.
- **Media:** owner photos, generated images and video clips, stored in our own storage.
- **Content:** drafts, scheduled posts and downloads.
- **Requests:** form submissions with a status.
- **Analytics:** built-in cookieless events.
- **Usage ledger:** AI cost, plan allowances and top-up credits per business.
- **Audit log:** every change, marked as made by the owner or by Zuri.
- **Zuri conversations and style memory:** chat history and the saved before and after of owner edits.
- **Isolation:** every record belongs to one business, and database rules stop one business from ever seeing another's data.

### Agreed retention and history rules

1. Keep the last 20 published site versions with one-tap rollback, plus autosaved drafts.
2. A deleted business is erased after a 30-day grace period (data export first).
3. Requests are owner-only in v1. The tables allow inviting staff later.
4. Zuri chat history is kept 90 days. Facts the owner confirms are saved to the profile permanently.
5. Analytics: daily totals kept forever, raw events kept 90 days.
6. Unclaimed anonymous drafts are deleted after 7 days.

### Additions agreed to the v1 schema

Plans and entitlements (including a founding-member flag); payments with unique keys against double-processing, receipts, refunds and retries; consent and verification records; domains (status, DNS verification, certificate state); background job records; reminders with preferences and a delivery log; fact provenance (each profile fact records its source and whether the owner confirmed it); tracked links and Search Console state (tokens stored encrypted); moderation (reports, takedowns, flagged content); data export and deletion requests; platform-level records (rulebook and playbook versions, example library, test-set runs, cultural calendar); admin role with logged support access, and feature flags.

### Conventions

Money stored as whole kobo. All times stored in UTC and shown in Africa/Lagos. Random unique IDs. The section library (types and slot limits) lives in versioned code, and each site records the version it was built from.

**Reserved for after launch:** ads management, email marketing, reviews collection, directory and Google Business Profile checklists. The tables are designed so they slot in without a rewrite.

---

## 14. Layer 11: The AI layer and Zuri

### 14.1 What Zuri is

Zuri is not a model. It is a layer inside the Reydarr backend that connects models to the product. It has five parts:

1. **Business profile:** one stored record per business (facts, services, hours, tone, photo notes). Every prompt is built from it, and Zuri may state only facts found there.
2. **Task router:** each kind of work has its own model choice, prompt and required output format. Bad output is rejected and retried.
3. **Actions:** Zuri changes things by calling the same functions the forms call. Chat and forms share one path, and every change is versioned and shown to the owner for approval before it goes live.
4. **Job queue and usage ledger:** slow work runs in the background and every call records its cost against the business's plan allowance. Top-up credits live in the same ledger.
5. **Model gateway:** one interface for all providers so a model or vendor can be swapped through a setting. Media sits behind a replaceable media layer.

Zuri sits inside the same codebase as Reydarr in v1, built as a standalone package (**zuri-core**) with a test console (a chat page with sample business profiles on a deployed preview). Reydarr later implements the real actions. Cartiphy can later plug into the same Zuri with its own set of actions, giving one assistant across both products.

### 14.2 Models per task (working defaults)

| Task | Model |
| --- | --- |
| Site plan, homepage copy and other pages | GPT-6.1 Terra |
| Zuri chat edits | GPT-6.1 Terra |
| Captions that state facts | GPT-6.1 Terra |
| Routing, classification, photo tagging | GPT-6 Luna (Haiku 5.5 as alternative) |
| Safety and fact-check pass | Luna, escalating to Terra when it flags something |
| Analytics insights | Luna, with the numbers calculated in code |
| Video | Higgsfield API: Seedance 2.5 for product ads and label fidelity, Kling 3.0 for social clips |
| Images | Provisional: GPT Image 2.5 Sunburst, with Nano Banana 2.1 as the swap. To be decided by bake-off |
| Fallback | Haiku 5.5, added later through the gateway |

**How this was decided.** Claude's first picks (Sonnet 5.5 for hard tasks, Haiku for bulk) were challenged by Code as biased toward Claude models and too expensive. The comparison found that GPT-6.1 Terra costs half as much as Sonnet 5.5 and has the lowest hallucination rate in the GPT family (34.5%), which matters because Zuri must not invent facts. Luna is very cheap but invents the most (79.3%), so it is used only where facts are already in the prompt and the output is checked. These figures compare GPT models against each other. Equivalent figures for Sonnet 5.5 and Haiku 5.5 were not found, so the final text choice is confirmed by bake-off.

**DeepSeek is dropped from v1.** It would add a third vendor and a separate bill, and it sends customers' business data through an overseas API. The savings over Luna are small. It can be added later through the gateway.

**Two vendors in v1:** OpenAI (text) and Higgsfield (media). The earlier planning direction of an OpenRouter-style config-driven router remains available through the gateway. Whether to call OpenAI directly or through a router is still open (section 18).

### 14.3 Text generation rules (all accepted)

1. Facts come only from the business profile. Every price, hour, service, award, address or statistic traces to a profile field. If Zuri lacks it, she asks the owner or leaves a clear placeholder.
2. No fake proof: no invented reviews, testimonials, client names, "years of experience" or numbers.
3. Health and professional-services claims: no cure claims, no guaranteed results, no legal or medical advice.
4. Natural Nigerian English. Pidgin or local phrases only if the owner's profile asks for them.
5. Prices in ₦ in the owner's own format. Calls to action default to WhatsApp or the contact form.
6. Tone comes from the profile, with a banned-phrase list blocking stock AI wording.
7. The owner approves before anything goes live.
8. Edits keep the owner's wording unless a rewrite is requested.
9. No politics, no religion-based content, no naming or attacking competitors.
10. Every output is checked for format, fact accuracy against the profile and channel length limits. Failures are retried, then flagged.
11. Every generation is logged with model, prompt version and cost.
12. **Slot limits:** every field in a website section has hard minimum and maximum character counts set in the section library (for example a hero headline of 3 to 8 words and up to 60 characters). The output is checked automatically and an over-limit field is sent back to be shortened. If it still fails, text is trimmed at a sentence boundary and flagged. Section designs also clamp overflow as a safety net. Characters, not words, are what layouts break on.
13. **Em-dashes:** banned in the instructions Zuri receives. The output checker finds any that slip through and fixes or returns them. This applies to all Zuri output (site copy, captions and chat replies), but not to text the owner types. It supports the anti-generic standard alongside the banned-phrase list.

Zuri writes as the business ("we offer...") rather than about it.

### 14.4 How Zuri is "trained"

No fine-tuning in v1. Quality comes from four things around the model:

1. **A rulebook:** the rules above as a versioned instruction set.
2. **Playbooks per category:** pages and content types, allowed claims, seasonal calendar and typical customer questions, stored as data so they improve without code changes.
3. **A library of good examples:** about 20 to 50 strong captions and page sections per category used as models, plus per-business style memory from saved owner edits. Sharing edits across businesses needs consent from Layer 9.
4. **A test set:** real Nigerian samples, rerun whenever a prompt or model changes.

Fine-tuning only makes sense later, if tests show a gap and hundreds of businesses supply data.

### 14.5 Image and video models

- **Higgsfield API** is the primary route for video, behind the replaceable media layer. Higgsfield's own page describes billing as prepaid US dollars per generation (no subscription, no credits) with more than 50 models. Published rates: Seedance 2.5 at $0.0738 a second, Kling 3.0 at $0.112 a second, and Soul 2 at $0.0032 an image. Failed requests are not charged. Output may be used commercially. Output files are kept at least 7 days. Balance funds expire after a year. The key allows 20 concurrent requests. No SLA is mentioned. An earlier third-party claim that API use drew on web-plan credits at about $0.10 per image was withdrawn after checking Higgsfield's own page.
- **Image candidates** (LMArena ranking, October 2026): GPT Image 2.5 Sunburst (#1, about $0.014 an image as measured by the source), Nano Banana 2.1 (#5, $0.034 at 1K), Grok Imagine Image 2.0 ($0.04), Seedream 5.0 Pro (about $0.045). Whether Higgsfield offers these was not confirmed.
- **Video candidates considered** (8 second clip at 720p, official per-second rates): P-Video about $0.16, Veo 3.1 Lite about $0.40, Grok Imagine Video about $0.40, Kling 3.0 about $0.88 elsewhere, Seedance 2.0 about $1.20. Code chose Seedance 2.5 and Kling 3.0 after his own research.
- **Churn risk:** Sora's API shut down, Google dropped the Veo 3.1 preview in its Gemini API, and FAL removed Veo 3.1 on 17 November. The replaceable media layer matters more than any single pick.

### 14.6 Bake-offs (deferred until Code is ready)

- **Text:** about 30 real tasks from Nigerian food, beauty, health, education and professional-services businesses through Terra, Luna, Haiku 5.5, Sonnet 5.5 and DeepSeek Flash. Score on fact accuracy, tone fit and natural English, valid output format, correct tool calls and cost per task.
- **Images:** GPT Image 2.5 Sunburst, Nano Banana 2.1, Grok Imagine 2.0, Seedream 5.0 Pro and whatever Higgsfield offers, on real food, salon and product photos including darker skin tones.
- **Video:** Seedance 2.5 and Kling 3.0 on about 20 real photos, mostly product labels and food. Score on faithfulness to the photo, readable labels, share of usable first attempts and cost per usable clip.
- Funding: Higgsfield test balance of $10 to $20 when ready, plus sample photos and business types.

---

## 15. Layer 12: Stack and integrations

### 15.1 Stack decision

**Next.js, Supabase and Vercel** were accepted as the base, judged on merit and not carried over by default.

- **Next.js:** Code already knows it, and with limited hours familiarity matters most. One codebase routes by hostname.
- **Supabase:** Postgres with row-level isolation between businesses, login and file storage, fitting the data model.
- **Vercel Pro:** unlimited custom domains with automatic HTTPS and wildcard subdomains, per Vercel's own limits page.
- **Why not Cloudflare as the main platform:** its custom-domain feature is cheaper at scale (100 hostnames free, then $0.10 each), but building on it means a different framework setup. For a solo founder the switching cost outweighs the savings now. To keep the door open, the published site is a saved snapshot and the site renderer is kept separate from the dashboard, so serving sites can move to Cloudflare later without a rewrite.

### 15.2 Integration register (18 items)

| # | Feature | Integration | Status | Before launch | At launch |
| --- | --- | --- | --- | --- | --- |
| 1 | App and site hosting | Vercel | Decided | Hobby, free (non-commercial) | Pro, $20 a month |
| 2 | Database, login, file storage | Supabase | Decided | Free | Pro, $25 a month |
| 3 | Code, previews, deployments | GitHub connected to Vercel | Needed | Free | Free |
| 4 | reydarr.com, subdomains, custom domains with HTTPS | Registrar plus Vercel domain tools | Domain not yet registered | Domain fee only | Domain fee (yearly, price varies) |
| 5 | Email: reminders, request alerts | Resend, new Reydarr account, reydarr.com verified | Continuing | Free | Free or Pro $20 a month (limits to verify) |
| 6 | Push notifications | Browser web push, own code | Needed | Free | Free |
| 7 | WhatsApp | Tap-to-chat links now, official API later | Decided | Free | Free |
| 8 | Payments, subscriptions, top-ups | Flutterwave | Decided | Test mode (to verify) | Per-transaction fees (to verify) |
| 9 | Background jobs and cron | Trigger.dev | Recommended, accepted | Free, $5 monthly credit | Hobby, $10 a month |
| 10 | Text AI | OpenAI (GPT-6.1 Terra, GPT-6 Luna) | Decided | Pay per use | Pay per use |
| 11 | Video and image AI | Higgsfield API (Seedance 2.5, Kling 3.0), images provisional | Decided | Prepaid balance $10 to $20 to test | Pay per use |
| 12 | Website photos and optimization | Cloudinary | Pricing to confirm | Free | To verify |
| 13 | Videos and bulk originals | Cloudflare R2 | Recommended, accepted | 10 GB free | $0.015 per GB a month, no download fees |
| 14 | Form and signup spam protection | Cloudflare Turnstile | Needed | Free | Free |
| 15 | Search Console and GA4 | Google sign-in and APIs | Needed, approval takes time | Free | Free |
| 16 | Error tracking and uptime alerts | Sentry or similar, plus a free uptime monitor | Needed | Free | Free tiers (to verify) |
| 17 | Support contact | Support email and a WhatsApp number | Needed | Free | Free |
| 18 | Fonts | Manrope and DM Sans served from our own site | Decided | Free | Free |

Built in-house with no vendor: analytics, receipts, sitemaps and structured data, the admin area, and feature flags.

**Reserved for after launch:** ads management (Meta and Google Ads), email marketing, reviews collection, Google Business Profile, directory listings, the official WhatsApp API, and a domain-selling registrar connection.

### 15.3 Background jobs and cron, explained

A **background job** is work the app does out of sight because it takes too long to wait on a screen. A site takes minutes to generate and a video takes longer, and Vercel cuts off any single request after a time limit. Jobs run in a separate worker that can take its time, retry on failure and report back. Trigger.dev runs tasks on its own machines with no timeout, per one comparison article.

**Cron** is an alarm clock for the computer: "at 7am every day, run this task."

| Task | When | What it does |
| --- | --- | --- |
| Weekly content generation | Monday, early morning (Lagos time) | Generates each business's week of content |
| Today reminders | Daily at each owner's chosen time | Sends push, with email as fallback |
| Analytics roll-up | Nightly | Writes daily totals and deletes raw events older than 90 days |
| Unclaimed draft cleanup | Daily | Deletes anonymous drafts older than 7 days |
| Deleted business erasure | Daily | Erases businesses after their 30-day grace period |
| Chat history cleanup | Daily | Deletes Zuri messages older than 90 days |
| Failed payment retries | Daily | Retries Flutterwave charges and notifies the owner |
| Higgsfield balance check | Daily | Alerts when the prepaid balance runs low |

### 15.4 Push notifications

Reydarr uses the browser's own web push standard with our own code and no paid vendor. Reydarr is installable as a web app (using the 192, 512 and maskable icons from the logo pack). The owner taps "Turn on reminders", the browser asks permission and returns a subscription address, which is stored against the owner. A scheduled task sends the Today reminder at the owner's chosen time, delivered by the browser's own push service (Google's for Chrome and Android, Apple's for Safari). On iPhone, push works only after the owner adds Reydarr to the home screen (iOS 16.4 or later, to verify). Owners without push get the same reminder by email through Resend, with a WhatsApp tap-to-chat link as a second nudge. A vendor such as OneSignal can be added later behind the same reminders record.

### 15.5 Storage

Website photos go through Cloudinary. Videos and bulk originals go to Cloudflare R2 ($0.015 per GB a month, no download fees, 10 GB free). Everything the AI generates is copied into our own storage immediately, because Higgsfield keeps output files for only 7 days at minimum. Supabase holds the database and small files. Cloudinary's free plan caps videos at 100 MB, and credit amounts were not verified.

### 15.6 Are free plans enough before launch?

Yes for building and testing. Three limits matter: Vercel Hobby allows non-commercial use only (move to Pro before any paying or trial customer), Supabase Free pauses projects after a week of inactivity (two projects cover development and a test copy), and Resend Free has a daily cap whose number was not found. Trigger.dev's $5 credit is roughly 80 hours of the smallest machine. The unavoidable pre-launch costs are the domain fee and AI usage, estimated at about $30 to $40 for the planned model tests.

### 15.7 Account creation order

1. GitHub. 2. Vercel, connected to GitHub. 3. Supabase, with development and test projects. 4. reydarr.com at a registrar. 5. Resend as a new Reydarr account with reydarr.com verified. 6. OpenAI with a monthly spending limit. 7. Cloudflare for R2 and Turnstile. 8. Trigger.dev. 9. Google Cloud project for sign-in, Search Console and GA4 (start early, approval takes time). 10. Sentry and a free uptime monitor. 11. Higgsfield API with a $10 to $20 balance when ready to test. 12. Cloudinary. 13. Flutterwave with test keys first (live keys need the registered business). Keys go into Vercel's environment settings and are never pasted into chat or the code. The same register exists as a separate Doc, "Reydarr Integration Register".

---

## 16. Layer 13: Build order

### Principles

1. **Riskiest first:** prove that Zuri can write good sites and that one codebase can serve many sites by hostname.
2. **Every phase ends with something clickable** on a deployed preview.
3. **Each phase has a "done when" test**, checked with direct evidence such as a test run, a database query or a screenshot.

### Phases

| Phase | Weeks | What gets built | Done when |
| --- | --- | --- | --- |
| 0. Foundations | 2 | Accounts, repo, preview deployments, login, core tables (accounts, businesses, sites, pages, sections, versions, usage ledger, audit log), design tokens | Sign up and log in on a preview, and a test shows one business cannot read another's data |
| 1. Zuri core and test console | 2 | Business profile format, task router, model gateway (Terra, Luna), the text rules as automatic checks (slot limits, em-dashes, fact check), usage logging, first test set | A sample profile produces valid copy that passes every check, and the cost per task is logged |
| 2. Website engine | 5 | Section library (start with 12 to 15 sections), design recipes, hostname routing, preview, approve and publish with saved versions, forms and requests, built-in analytics, SEO basics | A generated multi-page site is live on a subdomain, a form submission reaches the owner, and rollback works |
| 3. Onboarding and billing | 3 | Anonymous-first onboarding, WhatsApp and email verification, trial, plans and allowances, Flutterwave subscriptions | A new visitor reaches a draft site, starts a trial and pays in test mode |
| 4. Content engine | 4 | Today screen, 30-second photo capture, weekly generation, push and email reminders, image generation, downloads | An owner photographs a product and gets post drafts and a reminder |
| 5. Growth dashboard | 2 | Requests tied back to content, tracked links, Search Console connection | The dashboard shows visits and requests by post |
| 6. Hardening and beta | 3 | Security tests, legal pages, model bake-offs, 5 to 10 beta businesses, founding members | Beta owners publish and keep using it for two weeks |

About 21 weeks. Starting around 1 December 2026 this ends in late April 2027, the far edge of the February to April window. Code confirmed that 5 to 10 hours a week is enough for him.

### After launch

Max plan video through Higgsfield clips, custom domains as a paid upgrade, optional GA4, ads management, email marketing, reviews collection, and Cartiphy connecting to Zuri. Launch keeps all five categories because they share one section library and differ mostly in data and prompts. If time gets tight, cut to two categories first rather than dropping features.

### Work that runs alongside the build (not code)

Register the business and reydarr.com and secure social handles. Run the professional trademark search on "Reydarr" and "Run the map." Start the Google Cloud approval early. Run the section library as its own chat with a handoff brief. Write the category playbooks and gather the sample photos for the bake-offs. Ask the lawyer contact to review the terms and privacy policy.

### Honest warning

21 weeks at 5 to 10 hours is 105 to 210 hours. This works only if AI coding agents write most of the code and Code reviews it. The estimate is Claude's and is not based on Code's actual speed. For reference, the old Zuri went from start on 26 June 2026 to deployed in about five months.

---

## 17. Money: unit economics

### 17.1 Prices of the AI services (per million tokens, as reported)

| Model | Input | Output |
| --- | --- | --- |
| Claude Sonnet 5.5 | $2.00 | $10.00 |
| Claude Haiku 5.5 | $0.10 | $0.50 |
| GPT-6.1 Terra | $1.00 | $5.00 |
| GPT-6 Luna | $0.10 | $0.50 |
| GPT-6.1 Sol | $2.00 | $10.00 |
| GPT-6 Astra | $10.00 | $50.00 |
| DeepSeek Flash (peak) | $0.30 | $1.20 |
| DeepSeek V4 Pro (peak) | $1.32 | $3.96 |

DeepSeek is half price off-peak. These are third-party reports except where stated. The GPT-6.1 Terra price came from two secondary sources and should be confirmed with OpenAI.

### 17.2 Monthly AI text cost per business

Assumption (Claude's): about 500,000 input and 70,000 output tokens a month per business, covering about 30 posts, 40 Zuri chat edits, weekly insights and photo reading.

- Everything on Sonnet 5.5: about $1.70, or ₦2,550. A heavy user could cost three times that.
- GPT-6.1 Terra: about $0.85, or ₦1,275 (nearer ₦900 with caching the business profile).
- Luna or Haiku 5.5: about $0.09, or ₦130.
- A one-time site generation on Sonnet costs about ₦3,450, and on a cheap model a few hundred naira.

### 17.3 Media cost

At Higgsfield's published rates: a 6 second clip costs about $0.44 on Seedance 2.5 (₦660) and $0.67 on Kling 3.0 (₦1,010). An 8 second clip costs about $0.59 (₦890) and $0.90 (₦1,340). Images cost between about $0.014 and $0.045 depending on the model, which is roughly ₦20 to ₦75.

### 17.4 Margins at Code's prices

Assumes ₦1,500 to the dollar (not verified), Flutterwave at about 1.4% (not verified) and infrastructure of ₦700 to ₦1,500 per business (Claude's guess). Figures are before 7.5% VAT.

| Plan | Price | Allowance | Estimated cost | Margin |
| --- | --- | --- | --- | --- |
| Ping | ₦10,000 | 10 images, no video | about ₦3,100 | about ₦6,900 (69%) |
| Pulse | ₦20,000 | 30 images, no video | about ₦7,300 | about ₦12,700 (64%) |
| Max | ₦50,000 | 60 images and 6 clips | about ₦20,500 | about ₦29,500 (59%) |

These were calculated before cheaper image models were found. With images costing ₦20 to ₦75 each, image costs fall sharply and Max margin on 6 clips rises to about 74% (about 68% in the worst case of 10 attempts). Allowances will be reset after the media bake-off.

### 17.5 Fixed infrastructure at launch

| Item | Per month |
| --- | --- |
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Resend Pro (the free plan may be enough at first) | $20 |
| Trigger.dev Hobby | $10 |
| Total, before AI usage | $75, about ₦112,500 |

Roughly 6 paying Pulse businesses cover this. Before launch everything runs on free tiers, so the cost is about $0 plus the domain fee and AI test usage.

---

## 18. Open items, risks and remaining planning

### 18.1 Open decisions

1. **Identity checks:** confirm reydarr.com is registered, claim the social handles, check misspellings, and run a professional trademark search on "Reydarr" and "Run the map." (R115, R136).
2. **Founding-member price and percentage:** proposed Pulse at ₦15,000. Not confirmed (R111).
3. **Exchange rate:** ₦1,500 to the dollar is an assumption. Provide the live rate.
4. **How to call the text models:** directly from OpenAI, or through a router such as OpenRouter. Both fit the gateway.
5. **Image model:** final pick by bake-off, and confirmation of whether Higgsfield offers the leading image models.
6. **Bake-offs:** text, image and video, deferred until Code is ready.
7. **Plan allowances:** reset image and video allowances after the bake-offs. Confirm per-plan limits for chat messages and regenerations (fair-use limits).
8. **Mark color confirmation (R127):** the earlier "solid silver-gray rings" note for the light variant is superseded by the peach version in the asset pack. Confirm.
9. **Legal entity form and VAT treatment,** and the scope of the lawyer review.
10. **Section library workstream:** run as its own chat with a handoff brief. Target about 30 to 45 sections, with slot limits per field.
11. **Category playbooks and the example library:** write them for the five launch categories.

### 18.2 Items to verify before spending money

Live naira exchange rate. Resend monthly and daily email caps. Cloudinary credit amounts and prices. Flutterwave test mode, recurring billing support for cards, bank transfer and USSD, and transaction fees. Sentry current free limits. Trigger.dev and Higgsfield rates from their own pages. The iPhone web push version requirement. The Supabase region closest to Nigeria. The GPT-6.1 Terra price on OpenAI's own page. The 7.5% VAT assumption. Whether Search Console property and quota limits suit a wildcard setup.

### 18.3 Risks

- **Time:** the plan fills the far edge of the launch window. The first cut is categories, then features.
- **Free-trial cost:** each trial costs real AI money. The trial limits (cheap first draft, one regeneration, about 5 images, no video, WhatsApp check) are essential.
- **Single-vendor dependence:** Higgsfield has no stated uptime commitment, files expire after 7 days, and balances pause generation when empty. Auto top-up, a low-balance alert and the replaceable media layer mitigate this.
- **Model churn:** image and video models are being retired quickly. The gateway and media layer absorb this.
- **Legal:** AI-generated claims for health and professional services, photos of people, and data protection obligations. The rules in section 14.3 and the lawyer review address this.
- **Google approval lead time** for sign-in, Search Console and GA4.
- **Old keys:** treat every key that lived in the old Zuri repo as burned and rotate or revoke it when the old project is retired.

### 18.4 Planning areas that remain

The numbered layers are planned, but these areas have not been planned yet:

1. **Launch and operations:** the founding-member campaign, how the first 50 businesses are found, support operations (Zuri first-line, WhatsApp human fallback), monitoring, backups and an incident routine.
2. **Security hardening plan:** secrets handling, row-level isolation tests, rate limits, abuse handling, backup and restore.
3. **Section library and recipes:** the detailed catalog, slot limits and recipe attributes (a separate workstream).
4. **Category playbooks:** content rhythms, claims rules, seasonal calendar per category.
5. **App design:** screen-by-screen design in the Framer-like style, from the tokens file.
6. **Cartiphy connection** to the shared Zuri, after launch.
7. **The external Zuri app** with its own brand kit, parked (R121).
8. **Phase 0 build specification:** the file-by-file spec for DeepSeek or FreeBuff, written once this document is confirmed.

---

## Appendix A: Full decisions log (R1 to R136)

Entries are as logged during the conversation. The status notes after the list record where later decisions changed or completed an entry.

- **R1.** Pain: owners waste money, time and effort on developers, social teams, content ideas and upkeep, and lack the SEO and web knowledge to do it themselves
- **R2.** The owner gives details, goals and tone. Reydarr produces a personalized site, a social plan and ready-to-post content with minimal editing
- **R3.** Websites are multi-page with real functionality: forms, working navigation, personalized calls to action
- **R4.** Reydarr serves every category except online stores (Cartiphy's job)
- **R5.** No complex backend infrastructure for the customer's site
- **R6.** Websites, content and Zuri are equally important. Nothing ships half-working
- **R7.** Budget about ₦0-20,000/month, 5-10 hours/week, launch target February-April. Build plan is discussed only after goals are fully stated
- **R8.** Full rebuild. Old env vars, keys, schema, templates and providers are discarded. The stack stays a candidate, judged on merit in the stack layer
- **R9.** Editing is by chat plus simple forms. No visual editor. Code export comes later
- **R10.** Launch categories: education, food and hospitality, beauty and wellness, health, professional services. Others use a flexible general structure and are deepened later
- **R11.** Custom domains are a paid upgrade. Free sites live on a reydarr.com subdomain
- **R12.** English only
- **R13.** The buyer is the owner only. No agency or freelancer product
- **R14.** You can pay in dollars
- **R15.** Year-one success: 50-100 businesses launched and working, plus revenue, paying businesses and signups
- **R16.** One user can own multiple businesses (dedicated accounts layer)
- **R17.** Zuri is one assistant for site edits and content requests
- **R18.** One identity across Reydarr and Cartiphy, with separate products
- **R19.** Phones, tablets and laptops are equally important. No "desktop only" features
- **R20.** 5-8 pages per site by default. The AI decides the page set per business
- **R21.** Blog/news is an optional module the AI suggests
- **R22.** Personalization means a different layout and visual style per business and copy in the owner's tone using real details. Identical inputs should rarely give identical sites
- **R23.** The AI never fabricates testimonials, stats, awards or credentials. Missing facts mean the section is hidden or marked "add yours"
- **R24.** No AI-generated images on websites. Higgsfield is for the content engine only
- **R25.** Sites are composed from a section library plus a per-business design recipe. Whole-page templates are retired
- **R26.** Design system and sections are created by you with AI-assisted design, and functionality is adapted together
- **R27.** A feature catalog per category. Owners see the features that apply and toggle them. Features are modules
- **R28.** No embedded Google Map and no language switcher. Use a "Get directions" link
- **R29.** A consent banner appears only when the owner enables a tracking feature
- **R30.** The owner previews and approves a draft before publishing
- **R31.** Onboarding is its own layer, conversion-driven, feeding website, content and personalization
- **R32.** SEO is built in: clean URLs with redirects, unique titles and descriptions, share images, canonical tags, robots.txt, heading structure, AI-written alt text, structured data (LocalBusiness, FAQ, service, event), Search Console verification and sitemap submission, Google Business Profile guide, location keywords, an SEO health score, `llms.txt` for AI search, and a GA4 connection (approach decided in Layer 4)
- **R33.** Logos: upload (PNG, JPG, SVG) with normalization, palette extraction, light/dark/icon/favicon variants and quality warnings, plus a text wordmark fallback. Logo creation is deferred
- **R34.** Chat can edit content, reorder sections, swap variants and adjust recipe attributes, but cannot invent sections
- **R35.** Whole-design regeneration is allowed, capped per plan
- **R36.** Outputs: static posts, carousels, stories, reels, ad creatives, captions with hashtags and CTAs, and a calendar. Download only, with auto-posting much later
- **R37.** Every post uses at least one real owner-supplied detail. The AI never invents facts or offers
- **R38.** Visuals: owner photos and branded layouts first, AI generation fills gaps, with variation by category
- **R39.** One brand kit (logo, colors, fonts, tone, do/don't) shared by the website and content engines
- **R40.** "World class" means a non-generic content hub UI/UX and daily flow, plus top-notch content
- **R41.** Home is a **Today** screen, with the calendar secondary
- **R42.** 30-second photo capture (photo plus one line becomes a finished branded post) is a headline feature
- **R43.** Feedback loop: one-tap self-report in v1, Instagram insights later
- **R44.** Four asset shapes (square/portrait, vertical, video, text) cover Instagram, WhatsApp Status and broadcast, Facebook, TikTok and LinkedIn
- **R45.** Reminders by push and email in v1, with a share-sheet handoff to Instagram and WhatsApp
- **R46.** Generate weekly, surface daily. Limit only what costs real money. Show "4 reels left", never "credits". Soft warning at 80%, in-progress pieces always finish, one-month rollover, optional top-ups
- **R47.** Category content rhythms, content memory (no repeated hooks), voice learning from edits, and a history library
- **R48.** **Existing-presence import in v1** (basic): Instagram bio, Google listing link and existing site link, to cut onboarding typing
- **R49.** Non-payment: 14-day grace period, then a polite "temporarily offline" page. Data kept 90 days and reactivation allowed
- **R50.** Design for a time-limited trial that includes a published site (final terms in the pricing layer)
- **R51.** Support: Zuri first-line, with a WhatsApp number as the human fallback
- **R52.** Form submissions go to the in-app Requests inbox with push and email alerts. Every form has spam protection. WhatsApp alerts come later
- **R53.** Auto-generated privacy page on customer sites, to be verified with a lawyer in compliance
- **R54.** Hard performance budget (small pages, compressed images, no heavy scripts), tested on throttled mobile connections
- **R55.** Quarterly freshness nudges from Zuri ("Are your fees still correct?")
- **R56.** Category-specific claims guardrails (no medical claims or guarantees, no invented offers, no fake urgency), strictest for health
- **R57.** Reels use only royalty-free or licensed audio, or none. Owners add trending sounds in-app themselves
- **R58.** Higgsfield is a candidate behind a replaceable media layer. Verify its API, pricing and terms before the AI layer locks
- **R59.** Voice: English with Nigerian registers (formal, warm, "Nigerian conversational"). Pidgin only if the owner's tone sample uses it
- **R60.** Built-in cookieless analytics on every site by default, with optional GA4
- **R61.** Basic analytics are not gated by plan. Plans differ in depth and history. The essentials list above is included for all
- **R62.** Higher-tier analytics: longer history, content attribution, period comparison, downloadable monthly report, location and per-page conversion
- **R63.** No heatmaps or session recordings
- **R64.** Search Console automated for every site in v1: reydarr.com verified as a domain property, per-subdomain data via the API, sitemaps auto-submitted. Custom domains are verified per property. Property and quota limits verified in the stack layer
- **R65.** Google Business Profile is guided setup (listing text, checklist, name/address/phone consistency, plus Bing, Apple and Facebook listings). API integration only if access is approved
- **R66.** The dashboard ties visits and requests back to the content that drove them, through tracked links
- **R67.** Reviews collection in v1: link, QR code, WhatsApp template, and only real reviews displayed
- **R68.** Simple email marketing in v1 with consent, unsubscribe and an allowance
- **R69.** Ads in v1 are creatives plus guided launch. Live ad management is deferred
- **R70.** Link-in-bio page, offer/promo pages and lead follow-up reminders are in v1
- **R71.** WhatsApp broadcast sending and competitor/keyword tips are later
- **R72.** A simple customer list built from requests, signups and review contacts, with a note field. No pipelines.
- **R73.** Referral programs and reminders to the owner's customers are deferred
- **R74.** Anonymous-first onboarding with a live preview. Answers carry into the account at signup
- **R75.** Two stages: a short Stage A, then a Zuri conversation in Stage B
- **R76.** Tone is learned from sample paragraphs in different voices plus an optional pasted past caption
- **R77.** Document upload (menus, fee schedules, brochures) and voice-note input in v1
- **R78.** A first site draft and one finished post appear before payment. The trial (R50) begins at that moment
- **R79.** Stage A mandatory fields: business name, category, offerings, city, WhatsApp number, business email, main goal, and an optional presence link
- **R80.** Stage B fields as listed above, all skippable. Missing facts follow R23
- **R81.** Consent to publish and accept terms at signup (safeguard 1). Before publish, contact details are checked: the business email is verified by link, and the WhatsApp number by a free "test your button" step (safeguard 2, revised). No API test message in v1
- **R82.** Clean start. No Zuri accounts are migrated
- **R83.** Opening hours are mandatory in Stage A only for food and hospitality and for health. They stay in Stage B for every other category
- **R84.** WhatsApp numbers are normalized to the international format and shown back to the owner for confirmation
- **R85.** Model: one person, many businesses. Each business has its own site, brand kit, content hub, customer list, analytics and subscription
- **R86.** Billing is per business. Multi-business owners get a discount on the second and later ones (set in pricing)
- **R87.** A business switcher in the dashboard. Zuri is always scoped to the selected business and never crosses over
- **R88.** v1 has one owner per business. The data model is built so staff roles can be added later
- **R89.** Nothing is shared between a person's businesses except the login and profile
- **R90.** Deleting a business includes a data export first and a 30-day undo window. Transfer to another person is later
- **R91.** No hard cap on the number of businesses per person
- **R92.** Login by Google or email magic link. No passwords
- **R93.** Lost-access recovery through the verified business email or WhatsApp number, plus manual support review
- **R94.** Login email changes need confirmation at both the old and new address
- **R95.** The trial belongs to the person and applies to their first business. Additional businesses go straight to paid with the multi-business discount
- **R96.** Reserved-names list, risky-keyword flags, an abuse-report link on every site, and fast suspension by admin
- **R97.** Subdomain rename allowed once, with an automatic redirect, then locked unless support helps
- **R98.** A small internal admin area in v1. Every admin action is logged, and support views a business only with a logged reason, never secrets
- **R99.** A person can export or delete all their data from settings (details in compliance)
- **R100.** Notification preferences are set per business, with a person-level mute-all
- **R101.** Signed-in device list with remote sign-out, and sign-out of all devices after a login email change
- **R102.** Layer order: 7 billing, 8 brand and design system, 9 compliance, 10 data model, 11 AI layer, 12 stack, 13 build order (only when you ask)
- **R103.** Prices are shown in naira and reviewed on a fixed schedule (quarterly)
- **R104.** Monthly and annual billing, with annual at about two months free
- **R105.** Payments via Flutterwave: card, bank transfer and USSD. Renewal reminders cover methods that can't auto-renew. Capabilities, fees and recurring support verified in the stack layer
- **R106.** Three paid tiers plus a trial. Names: Set A, B or C (your pick)
- **R107.** Plan dials: posts and carousels (generous), AI images and videos, whole-design regenerations, email sends, analytics history, custom domain, footer-badge removal
- **R108.** Trial: 14 days, no card, a published subdomain site, limited content allowance. Then R49 applies
- **R109.** Failed payments follow R49: grace period, reminders by email and WhatsApp, then a polite offline page
- **R110.** 7-day money-back window after the first payment
- **R111.** Founding-member price for the first 100 paying businesses, as set out above. Percentage set after Layer 11
- **R112.** Optional top-up bundles for videos and images, shown as "reels left"
- **R113.** The plan shape is set now. Actual naira prices are set after the AI layer, once unit economics are known
- **R114.** Automatic emailed receipts and a downloadable billing history. Tax invoicing goes to compliance. v1 has one payer (the owner)
- **R115.** Tagline: "Run the map." Professional trademark search pending
- **R116.** Supersedes earlier palette changes. The original palette is restored: Ink, Night, Bone, Ping, Ping Deep, Slate
- **R117.** The mark returns to its original spec and variants
- **R118.** Two separate design systems: Reydarr's own app, and the customer-site system (section library and recipes), which uses each business's brand kit
- **R119.** Both light and dark themes from day one, through tokens
- **R120.** Zuri's icon is the existing Zuri logo, checked against the new palette. Inside Reydarr, Zuri adapts to Reydarr's brand
- **R121.** A separate external Zuri app with its own brand kit is parked as a future scope question
- **R122.** Animations, transitions and interactions are in scope, with device-capability scaling, reduced-motion support and a mid-range Android performance budget
- **R123.** The section library and recipe creation runs as its own workstream, with a handoff brief. Target size is roughly 30-45 sections
- **R124.** App reference: Framer's dashboard and UI feel
- **R125.** Chrome is a finish (logo, borders, sheen, badges, hero moments), not a text or fill color. Flat neutrals carry readable UI
- **R126.** Palette rules: no second brand accent. Ping is used sparingly (about 10% of a screen). A separate functional set (success, danger, warning, info) is built to avoid confusion with Ping. Ink text on Ping fills, Ping Deep for orange text on light. A stepped navy neutral scale, a chart palette, and roles in the tokens file
- **R127.** Mark geometry stays locked. Color follows the palette (pending confirmation). Light variant uses solid silver-gray rings
- **R128.** Plan badges (Ping, Pulse, Max) use chrome finishes, to be designed
- **R129.** Typography: Manrope (600-700) for headings and the wordmark, DM Sans for body and interface. No Lexend. Tabular figures for numbers
- **R130.** Tokens file holds brand, color roles for both themes, type scale, spacing, radius, shadows and motion. Components read roles only
- **R131.** Motion rules: motion explains something, shared easings and durations, simpler versions for weaker devices and reduced-motion settings
- **R132.** App icons are one outline set. Illustrations appear only in empty states, in the brand palette
- **R133.** Zuri icon: rebuild the angular mark as a clean flat vector with a separate optional chrome layer. No "ZURI" lettering in-app and no gold edge. Variants for dark, light, single-color and avatar
- **R134.** Reydarr mark Figma construction: 64-unit grid, stroke diameters measured at stroke center, variants for dark, light, orange, compact and micro, tested at 16, 32, 64 and 512 px
- **R135.** Wordmark: Manrope Bold, about -3% tracking, hand-kerned, outlined for logo files, clear space equal to the dot's diameter
- **R136.** Identity checks open: domain, handles, misspellings, and a professional trademark search

### Status notes (changes since logging)

| Entry | Update |
| --- | --- |
| R58 | Higgsfield is now the primary video route through its API, behind the replaceable media layer. Image models are decided by bake-off. |
| R106 | Plan names chosen: Ping, Pulse, Max. |
| R111 | Founding-member price proposed at Pulse ₦15,000. Not yet confirmed. |
| R113 | Prices now set by Code: Ping ₦10,000, Pulse ₦20,000, Max about ₦50,000. Allowances to be reset after the media bake-off. |
| R115 | Tagline chosen: "Run the map." Trademark search pending. |
| R120, R133 | Zuri icon rebuilt as a flat vector with the original's 3D tilt, plus an optional chrome version. |
| R127 | The light mark variant uses solid peach rings (`#F9B59E` inner, `#F7D7C8` outer) in the asset pack, not silver-gray. |
| R129, R135 | Confirmed: Manrope Bold wordmark and Manrope plus DM Sans typography. |
| R136 | Still open. |
| Early decision 4 | "OpenRouter config-driven router plus a separate media layer" became the model gateway plus the replaceable media layer, with OpenAI text models and Higgsfield media. |

---

## Appendix B: Plain-language glossary

- **Background job:** work done out of sight because it takes too long to wait on a screen, such as generating a site or a video.
- **Cron:** a schedule that starts a task at set times, like an alarm clock for the computer.
- **VPS:** a rented blank computer in a data center that you set up and maintain yourself. Reydarr uses managed services instead, where the provider runs the machines.
- **Managed service:** a provider (Vercel, Supabase, Cloudflare) runs the servers, security patches and backups.
- **Row-level isolation (RLS):** database rules that stop one business from reading another's data.
- **Wildcard subdomain:** one rule that makes every `name.reydarr.com` address work.
- **Web push:** notifications delivered through the browser's own system, with no paid vendor.
- **PWA:** a website installed like an app, with its own icon and notifications.
- **Model gateway:** one interface through which every AI model is called, so models can be swapped by changing a setting.
- **Hallucination rate:** how often a model states something false. Lower is better.
- **Slot limit:** the minimum and maximum characters allowed in one text field of a website section.
- **Bake-off:** running the same real tasks through several models and scoring them.
- **Idempotency key:** a unique key that stops the same payment being processed twice.
- **Kobo:** one hundredth of a naira. Money is stored in kobo to avoid decimal errors.

---

## Appendix C: Brand asset pack contents

A zip (`reydarr-brand.zip`) was delivered with SVG and PNG files.

- **Reydarr mark:** dark, light, on-orange, mono-ink and mono-bone, plus compact and micro versions of dark, light and on-orange. PNGs of the compact and micro versions at 16, 32 and 64 px.
- **Wordmark:** bone and ink versions.
- **Lockups:** mark plus wordmark in dark, light, on-orange, mono-ink and mono-bone.
- **App icons and avatars:** 180, 192 and 512 px app icons, a maskable 512 icon, and 1000 px avatars in dark and light.
- **Favicon:** `favicon.ico` (16, 32 and 48 px) plus 16 and 32 px PNGs.
- **Zuri flat icons:** Ink, Bone, Ping and chrome versions at 1024 px.
- **Zuri 3D-tilt icons:** Bone, Ink and Ping versions, plus dark and light 1000 px avatars.
- **Previews:** a contact sheet and a Zuri 3D preview.

Correction recorded: the outer ring stroke was normalized from 2.6 in Code's Figma export to 2.5 to match the spec.

---

## Appendix D: Sources

Figures from third-party pages are as reported on those pages and must be verified on each provider's own site.

- [Higgsfield API](https://higgsfield.ai/blog/higgsfield-api)
- [Higgsfield API costs (third-party guide)](https://www.layer3labs.io/guides/higgsfield-api)
- [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Claude Sonnet 5.5 pricing](https://www.eesel.ai/blog/claude-sonnet-5-5-pricing)
- [OpenAI pricing overview](https://developer.puter.com/tutorials/openai-api-pricing/)
- [GPT-6.1 Terra pricing](https://apidog.com/blog/gpt-6-1-terra-pricing/)
- [GPT-6 models compared](https://benchlm.ai/blog/posts/gpt-6-models-compared)
- [GPT-5.6 Sol, Terra and Luna explained](https://www.vellum.ai/md/blog/gpt-5-6-sol-terra-luna-explained)
- [Best AI image models, November 2026](https://www.teamday.ai/blog/best-ai-image-models-2026)
- [AI video model pricing](https://invideo.io/blog/ai-video-model-pricing/)
- [Image and video API providers compared](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026)
- [Cheapest AI video generation APIs, 2026](https://www.atlascloud.ai/blog/tips/cheapest-ai-video-generation-api-2026)
- [Cloudflare for SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/)
- [Vercel multi-tenant limits](https://vercel.com/docs/multi-tenant/limits)
- [Vercel pricing, 2026](https://massivegrid.com/blog/vercel-pricing-explained-2026/)
- [Supabase pricing](https://schematichq.com/blog/supabase-pricing)
- [Resend pricing](https://www.activepieces.com/blog/resend-pricing-2026-free-tier-plans-and-limits.md)
- [Trigger.dev, Inngest and plain queues](https://devtoolpicks.com/blog/when-to-use-inngest-vs-trigger-dev-vs-plain-queue-indie-hackers-2026)
- [Cloudinary pricing](https://www.activepieces.com/blog/cloudinary-pricing-2026-plans-credits-and-costs.md)
- [Storage and CDN comparison](https://agentdeals.dev/storage-comparison-2026)
