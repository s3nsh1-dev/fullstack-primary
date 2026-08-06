# Suggestions — where to start and how to work through them

22 documents. Unlike the vulnerabilities folder, **none of these is urgent and several you should deliberately skip.** This page is about picking the ones worth your time.

---

## First: these are optional, and that changes everything

A vulnerability is a thing that is wrong. A suggestion is a thing that could be better. The difference matters for how you decide:

- With a vulnerability, the question is *when*, not *whether*.
- With a suggestion, the honest question is **"will this make the next feature easier to build, or am I just tidying?"**

Refactoring feels productive. It produces visible diffs, it makes the code look more like what you see in good repos, and it is much more pleasant than fixing bugs. It is also the single most reliable way for a solo learner to spend two months and ship nothing.

So: pick a few. Finish them. Then build a feature and see whether it was actually easier. That feedback loop is what tells you if a refactor was worth it — not how clean the diff looked.

---

## The four that will change how you write code

If you do nothing else in this folder, do these. They are not the four highest-ranked. They are the four that transfer to every project you build after this one.

### [05 — `optionalAuth` middleware](05.optional-auth-middleware.md)

Replaces `?userId=` on nine endpoints with identity derived from the token.

**Why it matters beyond this codebase:** it is the structural version of "never trust the client". You are moving a decision from *the caller asserts it* to *the server derives it*. Once you have built that middleware, you will never again write an endpoint that takes the acting user's ID as a parameter. That is a permanent upgrade.

It also closes vulnerability `07` as a side effect, which is the nicest kind of refactor — the structure makes the bug unrepresentable rather than fixed.

### [02 — validation layer with zod](02.central-validation-layer.md)

One schema per route, replacing seven different hand-rolled checking styles.

**Why it matters:** you will use zod (or something like it) in every TypeScript project you build from now on. It is close to industry standard. And the payoff here is concrete — the schema both validates *and* gives you the TypeScript type, so `req.body` stops being `any` and your controllers get 30% shorter.

Start with just the login and register routes. Get those two working end to end. The pattern will be obvious after that and the remaining ~50 routes are mechanical.

### [06 — one HTTP client](06.single-http-client-with-interceptors.md)

Sixty hand-written `fetch`/`axios` blocks become one `apiClient` with interceptors.

**Why it matters:** this is the clearest lesson in the folder about *where* logic belongs. Right now, "send credentials" is a decision made 60 times. Adding a CSRF header means editing 60 files and missing three. After this, it is one line in one place.

The 401-refresh-retry interceptor is genuinely tricky — specifically the deduplication, so five simultaneous 401s trigger one refresh rather than five. Take your time with it. Understanding that piece is worth more than the rest of the file.

### [13 — a test suite](13.add-a-test-suite.md)

Vitest + supertest + in-memory MongoDB.

**Why it matters:** you have never written tests for this project, and it shows — eight confirmed bugs in this audit would have been caught by one-line assertions. More importantly, **you cannot safely do the bigger refactors in this folder without tests.** Restructuring 60 controllers with no way to check you did not break anything is how a refactor turns into a rewrite that never lands.

Write the ~20 authorization and exposure tests from that document *before* you start any large change. They fail now. When they pass, you are done. That is the whole point.

---

## What to skip, or defer a long time

Being honest about this is more useful than listing everything as important.

**[08 — service layer](08.service-layer-extraction.md).** Correct, and the right shape for a large team. For a solo project it is a lot of work for benefits you feel mostly at scale. Do it *only after* [02](02.central-validation-layer.md) and [13](13.add-a-test-suite.md), and even then do one module (videos) and stop to see whether you like it before converting the rest.

**[10 — direct-to-Cloudinary uploads](10.direct-to-cloudinary-uploads.md).** Architecturally the right answer, and it deletes a whole vulnerability class. But it introduces a new failure mode (orphaned assets) and a verification step you must get exactly right, or a user can attach someone else's video to their own record. The multer hardening in vulnerability `04` gets you 80% of the safety for 10% of the work. Do that; revisit this when uploads are actually a bottleneck.

**[15 — deterministic feed](15.deterministic-feed-pagination.md).** Real bug — the feed randomises its sort direction per request, so scrolling shows duplicates. But cursor pagination is a meaningful chunk of work and your feed currently has demo data. Fix the *symptom* now by replacing the random sort with a fixed `{ createdAt: -1 }`, and do the cursor version when you have enough content for it to matter.

**[16 — response envelope](16.consistent-response-envelope.md).** Correct, but it is a breaking change across every endpoint and every client hook, and the benefit is mostly consistency. Do it *while* you are touching endpoints for other reasons, not as its own project.

**[12 — transactions](12.atomic-cascade-deletes.md).** Needs MongoDB running as a replica set. If you are on Atlas you already have one. If you are on a local standalone `mongod`, the setup is a genuine detour. Worth doing — transactions are a concept you need — but do not let it block other work.

---

## Effort and payoff, honestly

| Doc | Effort | Payoff for a solo learner |
|---|---|---|
| [22](22.health-check-should-be-public.md) health check | 20 min | ★★☆ quick win, teaches liveness vs readiness |
| [20](20.remove-dead-code.md) lint + dead code | 1 hr | ★★★★ ESLint would have caught the `if (0)` |
| [01](01.fail-fast-env-config.md) fail-fast config | 1 hr | ★★★★ you will copy this file into every project |
| [17](17.missing-suspense-boundaries.md) Suspense | 30 min | ★★★★ you have 18 `lazy()` and zero boundaries |
| [18](18.client-loading-gate-blocks-public-pages.md) loading gate | 1 hr | ★★★★ route guards are a pattern you need |
| [03](03.security-middleware-baseline.md) middleware baseline | 2 hrs | ★★★★★ **middleware ORDER is the lesson** |
| [07](07.database-indexes-and-unique-constraints.md) indexes | 3 hrs | ★★★★★ learn to read `explain()` |
| [05](05.optional-auth-middleware.md) optionalAuth | 3 hrs | ★★★★★ the trust boundary, structurally |
| [21](21.content-length-limits.md) length limits | 2 hrs | ★★★ mostly mechanical |
| [13](13.add-a-test-suite.md) tests | 4-6 hrs | ★★★★★ unblocks everything else |
| [02](02.central-validation-layer.md) zod validation | 6-8 hrs | ★★★★★ industry-standard skill |
| [06](06.single-http-client-with-interceptors.md) HTTP client | 6-8 hrs | ★★★★★ where logic belongs |
| [09](09.shared-pagination-contract.md) pagination | 4 hrs | ★★★ six shapes → one |
| [11](11.structured-logging-with-redaction.md) logging | 3 hrs | ★★★★ request IDs are a revelation |
| [19](19.cloudinary-asset-lifecycle.md) asset lifecycle | 2 hrs | ★★★ fixes a real cost leak |
| [04](04.unify-auth-session-model.md) session model | 5 hrs | ★★★★ fixes 3 real bugs |
| [14](14.fix-refresh-token-rotation-race.md) rotation race | 3 hrs | ★★★★ race conditions, concretely |
| [12](12.atomic-cascade-deletes.md) transactions | 5 hrs | ★★★★ needs a replica set |
| [16](16.consistent-response-envelope.md) envelope | 5 hrs | ★★☆ breaking, do opportunistically |
| [15](15.deterministic-feed-pagination.md) feed | 4 hrs | ★★★ cursor pagination is worth knowing |
| [08](08.service-layer-extraction.md) service layer | 15+ hrs | ★★★ defer |
| [10](10.direct-to-cloudinary-uploads.md) direct uploads | 10+ hrs | ★★★ defer |

---

## A realistic plan

Assuming a few hours a week around everything else. Adjust freely — the ordering matters more than the timeline.

**Weeks 1-2 — quick wins, build confidence**
[22](22.health-check-should-be-public.md) health check → [20](20.remove-dead-code.md) lint and dead code → [01](01.fail-fast-env-config.md) config → [17](17.missing-suspense-boundaries.md) + [18](18.client-loading-gate-blocks-public-pages.md) client fixes.

Small, self-contained, each finished in one sitting. [20](20.remove-dead-code.md) is deceptively valuable: adding ESLint to the server takes ten minutes and `no-constant-condition` catches the `if (0)` that made account deletion a no-op. That is a real lesson about tooling catching what review misses.

**Weeks 3-4 — the safety net**
[13](13.add-a-test-suite.md) tests → [03](03.security-middleware-baseline.md) middleware baseline.

Write the failing tests first. Then [03](03.security-middleware-baseline.md), which is the payoff document for something people rarely explain properly: **middleware order is a correctness property, not a style choice.** Rate limiter before body parsing or you allocate memory for requests you are about to reject. CORS before CSRF or every preflight fails. Multer after the rate limiter or a rejected request has already written a file to disk. That is the kind of thing that separates "it works" from "you understand why it works".

**Weeks 5-7 — the trust boundary**
[05](05.optional-auth-middleware.md) optionalAuth → [04](04.unify-auth-session-model.md) session model → [06](06.single-http-client-with-interceptors.md) HTTP client.

The core project. These three are heavily interlinked — read all three before starting any of them. Together they close vulnerabilities `07`, `16`, and the client half of `03`.

**Weeks 8-10 — inputs and data**
[02](02.central-validation-layer.md) zod → [21](21.content-length-limits.md) length limits → [07](07.database-indexes-and-unique-constraints.md) indexes.

[07](07.database-indexes-and-unique-constraints.md) deserves a note: do not just paste the index declarations. Run `.explain("executionStats")` on a query before and after and look at `totalDocsExamined`. Watching it drop from 10,000 to 20 is the moment databases stop being magic. That is a career-long skill and it costs you one afternoon.

**Later, if you still want to**
[09](09.shared-pagination-contract.md), [11](11.structured-logging-with-redaction.md), [12](12.atomic-cascade-deletes.md), [14](14.fix-refresh-token-rotation-race.md), [19](19.cloudinary-asset-lifecycle.md), then the deferred ones.

---

## How to approach a refactor without losing a month

**Set a stopping condition before you start.** "I am converting the user routes to zod" is a task. "I am adding validation" is a project that never ends. Write down what done looks like before the first line.

**Migrate incrementally, never big-bang.** Every document in this folder is written so the old and new code can coexist. Routes without a `validate()` call keep working exactly as they do now. Hooks not yet on `apiClient` keep working. You can ship after every single route. Take that seriously — it is the difference between a refactor that lands and one that sits on a branch for three months and gets abandoned.

**Commit per unit, not per session.** `refactor: convert user routes to zod schemas`, then `refactor: convert video routes`. Not `refactor: validation`.

**Keep the app running the whole time.** If your branch cannot start the server, you have gone too far in one step. Back up and split it.

**After each refactor, build something small.** Add a feature — a "sort by most viewed" option, an edit button, anything. If the refactor was worth it, the feature will be noticeably easier. If it was not, you have learned something more valuable than the refactor was.

---

## On the difference between clean and correct

Something worth internalising while you work through this.

Some of these documents make the code *cleaner*: the response envelope, the pagination contract, the service layer. Nice to have. Real but modest value.

Some make it *correct in a way it cannot easily un-become*: `optionalAuth` means an endpoint cannot take identity from a query parameter, because there is no longer a parameter to take it from. Unique indexes mean duplicate likes cannot exist, no matter what the application code does. Validation schemas mean an untyped value cannot reach a query filter.

The second kind is worth far more. It is the difference between fixing a bug and making the bug impossible to write. When you are deciding what to spend a weekend on, prefer the ones that remove a category of mistake over the ones that make the diff prettier.

A related thing, since this is a learning project you will likely show people: **do not refactor for the sake of a portfolio.** Nobody reviewing your code will notice a service layer. They will notice that you found a CSRF vulnerability in your own project, understood *why* CORS does not prevent it, and fixed it. Depth on a few things beats surface polish on everything — and it is much better preparation for interviews, where you get asked to explain a decision rather than show a folder structure.

---

## When you get stuck

Every document explains the reasoning before the code, deliberately. If a snippet does not make sense, the gap is usually one concept underneath it — go read about that concept rather than pasting the snippet faster.

The concepts most likely to be the actual blocker:

- **Middleware order and the request lifecycle** → [03](03.security-middleware-baseline.md)
- **Same-origin policy, CORS vs CSRF** → [`../vulnerabilities/03.no-csrf-protection-with-cross-site-cookies.md`](../vulnerabilities/03.no-csrf-protection-with-cross-site-cookies.md)
- **Compound index field order (the ESR rule)** → [07](07.database-indexes-and-unique-constraints.md)
- **MongoDB sessions and transactions** → [12](12.atomic-cascade-deletes.md)
- **React Suspense and error boundaries** → [17](17.missing-suspense-boundaries.md)
- **Race conditions and idempotency** → [14](14.fix-refresh-token-rotation-race.md)

---

## Where this fits

- [`../vulnerabilities/index.md`](../vulnerabilities/index.md) — do that folder first. It is smaller, more urgent, and it teaches you *why* these structures matter.
- [`../00.INDEX.md`](../00.INDEX.md) — both folders in one implementation order, the old-vs-new architecture diagrams, the conflict register, and the seven decisions only you can make.

One last thing. Forty-two documents is a lot to receive about code you wrote while learning. Every codebase of this size has a list like this — most just never get audited. The fact that yours has recognisable structure, consistent naming, separated concerns at the file level, and a real auth flow at all is why an audit this specific was possible. Plenty of first backends do not get past "it returns JSON".

Take the list as a map, not a verdict.
