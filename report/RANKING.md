# Priority ranking — the order to actually fix things

Produced: 2026-08-10 · Branch `fix/2026` @ `cc4d9df` · Supersedes the *Sequencing* section of [`00.INDEX.md`](00.INDEX.md)

This document does two jobs:

1. **Audits the audit.** Every claim in `vulnerabilities/` and `suggestions/` was re-checked against the code on disk before it was allowed into the ranking. Three documents were wrong and have been corrected. Section 1 is the receipt.
2. **Ranks all 42 items into one ordered work queue** you can execute top to bottom — with the exact files to touch, the source document, what is being hurt right now, and what must land first.

Nothing here was taken on trust from the existing reports.

---

## Section 1 — Verification results

### Method

Claims were checked in four ways, in descending order of confidence:

| Check | Used for |
| --- | --- |
| **Executed** — ran the dependency and observed behaviour | Express query parsing, multer filename handling, body parsing |
| **Read the file** — opened the exact line cited | Every "Location:" header in all 42 documents |
| **Grepped the tree** — counted call sites / confirmed absence | "nothing writes this", "no rate limiter", index declarations |
| **Inspected artefacts** — looked at data on disk | `server/logs/*.log`, `.gitignore`, `git ls-files` |

### Verdict

```
                     42 documents checked
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
   39 accurate           2 imprecise            1 partly WRONG
   as written            (counts off,           (V12 — mechanism
        │                 corrected)             does not exist
        │                     │                  on this stack)
        ▼                     ▼                      ▼
   ranked as-is         corrected, then         corrected AND
                        ranked as-is            re-ranked 6 → 5
```

### The one document that was materially wrong

**`vulnerabilities/12.nosql-operator-injection.md`** opened with:

> "Express parses `?a[$ne]=x` into the JavaScript object `{ a: { $ne: "x" } }`"

That is true of Express 4. **This project runs Express 5.1.0**, where the default `query parser` changed from `extended` (qs) to `simple` (Node `querystring`). Executed against the installed dependency:

```
   ┌──────────────────────────── WHAT THE DOC CLAIMED ────────────────────────────┐
   │                                                                              │
   │   GET /users/check-username?inp[$ne]=zzz                                     │
   │            │                                                                 │
   │            ▼                                                                 │
   │   req.query = { inp: { $ne: "zzz" } }        ← nested object                 │
   │            │                                                                 │
   │            ▼                                                                 │
   │   User.exists({ username: { $ne: "zzz" } })  ← OPERATOR REACHES MONGO  ✗     │
   └──────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────────── WHAT ACTUALLY HAPPENS (Express 5.1.0) ───────────────────┐
   │                                                                              │
   │   app.get('query parser')  →  'simple'                                       │
   │                                                                              │
   │   GET /users/check-username?inp[$ne]=zzz                                     │
   │            │                                                                 │
   │            ▼                                                                 │
   │   req.query = { "inp[$ne]": "zzz" }          ← FLAT. bracket text is         │
   │            │                                   part of the KEY NAME          │
   │            ▼                                                                 │
   │   inp === undefined  →  handler 404s         ← no operator, no injection ✓   │
   └──────────────────────────────────────────────────────────────────────────────┘
```

So the query-string vector **does not exist** anywhere in this codebase. Case 1 of that document is void.

**What is still real** — retested end to end, both confirmed injecting:

| Vector | Body | Result | Why it works |
| --- | --- | --- | --- |
| JSON | `{"email":{"$gt":""},"password":"x"}` | `req.body.email === { $gt: '' }` ✅ | `express.json()` passes JSON structure through |
| urlencoded | `username[$ne]=zzz&password=x` | `req.body.username === { $ne: 'zzz' }` ✅ | `express.urlencoded({ extended: true })` uses `qs` — [`app.ts:48`](../server/src/app.ts#L48) |

The injection surface is **request bodies only**. The urlencoded vector is the nastier of the two, because `application/x-www-form-urlencoded` is a CORS-simple content type — it composes with the CSRF hole in V03 and needs no preflight.

V12 rank moved **6 → 5**: one of four cases void, remainder body-only.

### The two imprecise documents

| Document | Claimed | Actual | Impact on ranking |
| --- | --- | --- | --- |
| `suggestions/17` | "18 lazy routes" | **20** (`grep -c "lazy(" App.tsx`) | none — and zero `Suspense` hits confirmed tree-wide, which is the part that matters |
| `00.INDEX.md` diagram | "1 index outside the View model" | **4** — `User` declares `username` (unique+index), `email` (unique), `fullname` (index) | none — `suggestions/07` already states this correctly; only the summary diagram was wrong |

All three files have been edited in place with a dated correction note.

### Confirmed present in the working tree, not inferred

These I looked at directly rather than reasoning about:

- **V02** — `server/logs/http.log` contains `"password":"justinbeiber"`. A real credential, in cleartext, on disk, right now. `logs/` *is* gitignored and `git ls-files` confirms it never reached history.
- **V06** — `deleteUser.ts:35` is literally `if (0) {`.
- **V04's disproved claim is genuinely disproved.** I re-ran the traversal test against the installed multer 2.1.1: uploading with filename `../../../pwn.txt` yields `originalname === "pwn.txt"`, written inside the destination directory. Busboy strips path components. The document was right to drop that claim — do not spend effort on it.
- **V15** — `mail.service.ts` has `rejectUnauthorized: false`, `checkServerIdentity: () => undefined`, `logger: true`, `debug: true`, and `grep -rn "mail.service" server/src/` returns **zero** importers. Dormant, exactly as described.
- **S19** — `updateUserAvatar.ts` sets `.avatar` and never `.avatarPublicId`. The only writer is `updateUsersWithPublicId.ts`, which is commented out of the router.

---

## Section 2 — How this ranking was built

The existing `00.INDEX.md` sequencing orders by architectural layer. That is a reasonable way to *build*, but it is not the fastest way to *stop bleeding*. This ranking optimises for a different quantity:

```
                    risk closed
   priority  =  ─────────────────────   ,  subject to dependency order
                   effort spent
```

Plotting all 42 items on those two axes is what produced the queue:

```
   EXPLOITABLE
    RIGHT NOW
        ▲
        │
   high │  ┌────────────────────────┐   ┌───────────────────────┐
        │  │  ① DO THESE FIRST      │   │  ③ SCHEDULE           │
        │  │                        │   │                       │
        │  │  V02 logs   V04 static │   │  V03 CSRF (needs S06) │
        │  │  V06 if(0)  V15 SMTP   │   │  V08/V09 projections  │
        │  │  V07 history  S22      │   │  S02 validation       │
        │  │  V11 unpub    S17      │   │  S12 transactions     │
        │  │  V01+S01    V20 tweet  │   │  S10 direct uploads   │
        │  └────────────────────────┘   └───────────────────────┘
        │
        │  ┌────────────────────────┐   ┌───────────────────────┐
        │  │  ② CHEAP, DO IN PASS   │   │  ④ DEFER / JUDGEMENT  │
    low │  │                        │   │                       │
        │  │  V18 CORS   V19 fields │   │  S08 service layer    │
        │  │  S15 feed   S22 health │   │  S13 full test suite  │
        │  │  S18 gate   S21 limits │   │  S16 envelope         │
        │  └────────────────────────┘   └───────────────────────┘
        │
        └──────────────────────────────────────────────────────────▶
             small                                          large
                                  EFFORT
```

Two rules fall out of that plot, and they are where this ranking **disagrees with `00.INDEX.md`**:

> **Rule 1 — a 3-line fix for a live bug outranks a 3-day refactor for a latent one.**
> `00.INDEX.md` defers V11, V20's `updateTweet`, S17 and S22 to Phases 4–5 because their *durable* fixes live inside big refactors. But each has a small, correct, standalone fix available today. Take it now; the refactor later subsumes it.

> **Rule 2 — anything that is already leaking real data outranks anything that might.**
> V02 is not a risk, it is an incident that already happened. It goes first, alone, before everything.

---

## Section 3 — The attack chain (why the order is what it is)

The individual severities undersell the problem. The findings compose. This is the single realistic path from "anonymous stranger" to "full control of any account", drawn from confirmed findings only:

```
   ┌─────────────┐
   │  ANONYMOUS  │
   │  ATTACKER   │
   └──────┬──────┘
          │
          │  ① GET /api/v1/search/q/a          ← no auth, NO RESULT LIMIT
          ▼
   ┌──────────────────────────────────────────────────┐
   │  Full user table: _id + username + EMAIL         │   V09  V13
   │  26 requests (a–z) dumps essentially everything  │
   └──────┬───────────────────────────────────────────┘
          │
          │  ② GET /api/v1/users/profile/<_id>  ← no auth, denylist projection
          ▼
   ┌──────────────────────────────────────────────────┐
   │  Whole user doc: watchHistory, isAdmin,          │   V08
   │  isSuspended, suspensionReason                   │
   │  → attacker now knows WHICH account is admin     │
   └──────┬───────────────────────────────────────────┘
          │
          ├─────────────────────────┬──────────────────────────┐
          │                         │                          │
          │ ③a  if .env ever        │ ③b  password spray       │ ③c  forge from
          │     fails to load       │     the harvested list   │     any web page
          ▼                         ▼                          ▼
   ┌──────────────────┐   ┌────────────────────┐   ┌───────────────────────┐
   │ Sign a token     │   │ No rate limit.     │   │ SameSite=None + no    │
   │ with the PUBLIC  │   │ No password policy │   │ CSRF + urlencoded     │
   │ fallback secret  │   │ ("a" is valid).    │   │ body accepted         │
   │        V01       │   │ Username oracle    │   │        V03            │
   │                  │   │ 404 vs 401.        │   │                       │
   │                  │   │    V05  V14        │   │                       │
   └────────┬─────────┘   └─────────┬──────────┘   └───────────┬───────────┘
            │                       │                          │
            └───────────────────────┴──────────────────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │   AUTHENTICATED AS VICTIM    │
                     └──────────────┬───────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   ┌─────────────┐         ┌────────────────┐        ┌─────────────────┐
   │ Victim      │         │ Suspending or  │        │ "Delete my      │
   │ CANNOT      │         │ deactivating   │        │  account"       │
   │ evict them  │         │ them does not  │        │ does NOTHING    │
   │ by changing │         │ take effect    │        │ but says it did │
   │ the password│         │ for 15 min     │        │                 │
   │     V10     │         │      V17       │        │      V06        │
   └─────────────┘         └────────────────┘        └─────────────────┘
      recovery fails         moderation fails          remedy fails
```

Read the bottom row carefully. Every one of the three *responses* to a compromise — the user changing their password, you suspending the account, the user deleting the account — is currently broken. That is why V06, V10 and V17 rank higher in this queue than their individual 8/6/5 scores suggest: they are not independent bugs, they are the failure of the entire recovery path.

**The cheapest cut in that chain is step ①.** Adding `.limit(20)` and removing `email` from one file — `searchUserText.controller.ts` — costs about ten minutes and removes the bulk-harvest that makes steps ②–③ efficient. That is why it is pulled forward to **P1** here, versus Phase 3 in `00.INDEX.md`.

---

## Section 4 — The ordered work queue

Execute top to bottom. Each row is one sitting. **Ref** is the source document; open it before starting — this table is the order, not the instructions.

Effort: **XS** ≈ minutes · **S** ≈ under an hour · **M** ≈ a few hours · **L** ≈ a day or more.

---

### P0 — Contamination and one-liners · do all of this in one sitting

Nothing here depends on anything. Everything here closes a real, present hole.

| # | Do this | Ref | Files to touch | What is hurt right now | Effort |
| :-: | --- | :-: | --- | --- | :-: |
| **1** | **Delete the log files.** They contain a working password in cleartext | [V02](vulnerabilities/02.plaintext-passwords-written-to-logs.md) | `server/logs/*.log` (delete) | **Live credential exposure.** Verified: `"password":"justinbeiber"` is in `http.log` today | XS |
| **2** | Remove `logData.body` so it stops refilling | [V02](vulnerabilities/02.plaintext-passwords-written-to-logs.md) | [`requestLogger.middleware.ts:18-20`](../server/src/middleware/requestLogger.middleware.ts#L18) | Every login, register and **change-password** body is written to disk. Change-password captures old *and* new password in one line | XS |
| **3** | Drop `body` from the 5xx error log too | [V02](vulnerabilities/02.plaintext-passwords-written-to-logs.md) | [`error.middleware.ts:229-237`](../server/src/middleware/error.middleware.ts#L229) | Same leak, second path. Fixing only #2 leaves this open | XS |
| **4** | **Delete `app.use(express.static("public"))`** | [V04](vulnerabilities/04.unauthenticated-file-upload-to-public-directory.md) | [`app.ts:50`](../server/src/app.ts#L50) | Anonymous uploads land in `server/public/temp/` and are then **fetchable at `/temp/<name>`**, letting attacker HTML/SVG execute on your API origin where the auth cookies live | XS |
| **5** | Add `limits` + `fileFilter` + random filename to multer | [V04](vulnerabilities/04.unauthenticated-file-upload-to-public-directory.md) | [`multer.middleware.ts`](../server/src/middleware/multer.middleware.ts) | Multer defaults are **unlimited**, and it runs *before* auth on `/register`. One request writes a 5 GB file to disk. (Path traversal is **not** a concern — retested, multer 2.1.1 strips it) | S |
| **6** | Add the upload-cleanup middleware | [V04](vulnerabilities/04.unauthenticated-file-upload-to-public-directory.md) | new `cleanupUploads.middleware.ts`, [`app.ts`](../server/src/app.ts) | Any request that throws before `uploadOnCloudinary` orphans the file **permanently**. `registerUser` throws on line 10 for exactly this input | S |
| **7** | **Delete `mail.service.ts` and revoke the Gmail App Password** | [V15](vulnerabilities/15.smtp-tls-verification-disabled-and-debug-logging.md) | `server/src/services/mail.service.ts` (delete), [`dotenvHelper.ts`](../server/src/utils/dotenvHelper.ts), `.env` | Confirmed **zero importers** — it is dead code with TLS verification disabled *and* `debug: true` printing the `AUTH` exchange. A Gmail App Password grants full mailbox access | XS |
| **8** | Stop the contact form reporting validation errors as a mail outage | [V15](vulnerabilities/15.smtp-tls-verification-disabled-and-debug-logging.md) | [`contact.controller.ts:31`](../server/src/controllers/contact.controller.ts#L31) | **Live user-facing bug.** The `catch` swallows its own `ApiError(400)` and returns "CAN NOT CONNECT TO MAIL SERVER". Add `if (error instanceof ApiError) throw error;` | XS |
| **9** | Make the health check public | [S22](suggestions/22.health-check-should-be-public.md) | [`healthCheck.route.ts:9-12`](../server/src/routes/healthCheck.route.ts#L9) | `healthCheckRouter.use(verifyJWT)` 401s every uptime probe. Move the guard onto `/user` only. *Free rider — take it while the file is open* | XS |
| **10** | **Add one `<Suspense>` around `<Routes>`** | [S17](suggestions/17.missing-suspense-boundaries.md) | [`App.tsx:66`](../client/src/App.tsx#L66) | **20** lazy components, **zero** Suspense boundaries anywhere in `client/src`. Every code-split route is one chunk-load away from an unhandled suspension. Three lines | XS |

> **P0 exit check:** `grep -rc password server/logs/` returns nothing (no files) · `curl -i <api>/temp/anything` → 404 · `curl -i <api>/api/v1/health` → 200 without a cookie · `grep -rn "Suspense" client/src` → at least one hit.

---

### P1 — Foundations · everything below assumes these

| # | Do this | Ref | Files to touch | What is hurt right now | Effort | Needs |
| :-: | --- | :-: | --- | --- | :-: | :-: |
| **11** | **Fail-fast validated config, then ROTATE BOTH SECRETS** | [S01](suggestions/01.fail-fast-env-config.md) → closes [V01](vulnerabilities/01.hardcoded-fallback-jwt-secrets.md) | new `server/src/config/env.ts`, delete [`dotenvHelper.ts`](../server/src/utils/dotenvHelper.ts), ~20 imports | `ACCESS_TOKEN_SECRET \|\| "fallback-access-token-secret"` is **in the repo**. If `.env` ever fails to load — wrong cwd, missed dashboard var, fresh container — the server boots happily and signs tokens anyone can forge. **Total auth bypass, no victim interaction** | M | — |
| **12** | Cut the harvest chain: cap search + drop `email` | [V09](vulnerabilities/09.email-addresses-exposed-on-public-endpoints.md) + [V13](vulnerabilities/13.unbounded-pagination-and-unpaginated-search.md) | [`searchUserText.controller.ts:24-28`](../server/src/controllers/searchUserText.controller.ts#L24) | `GET /search/q/a` is unauthenticated, has **no limit anywhere in the file**, and returns every matching user's email. This is step ① of the attack chain. **Pulled forward from Phase 3** — it is one file and ten minutes | S | — |
| **13** | **Security middleware baseline** — `trust proxy`, helmet, tiered rate limits, CORS hardening | [S03](suggestions/03.security-middleware-baseline.md) → closes [V05](vulnerabilities/05.no-rate-limiting-on-any-endpoint.md), [V18](vulnerabilities/18.cors-allows-requests-with-no-origin.md) | [`app.ts`](../server/src/app.ts), new `rateLimit.middleware.ts`, new `config/cors.ts`, `package.json` | **Zero rate limiting anywhere.** Unlimited login attempts against bcrypt-only defence; unlimited `/contact` → your inbox and Resend quota; unlimited `/register` → your Cloudinary bill. `trust proxy` is a **prerequisite**, not optional — without it every visitor shares one bucket | M | 11 |
| **14** | Close the username oracle in login | [V05](vulnerabilities/05.no-rate-limiting-on-any-endpoint.md) | [`loginUser.ts:29-36`](../server/src/controllers/userControllers/loginUser.ts#L29), [`useLogin.ts:82-100`](../client/src/hooks/data-fetching/useLogin.ts#L82) | 404 "USER DOES NOT EXIST" vs 401 "PASSWORD IS INCORRECT" lets an attacker confirm accounts before spraying. Client maps both — update together | S | 13 |
| **15** | ESLint + `tsc --noEmit` on the server, wired to a script | [S20](suggestions/20.remove-dead-code.md) | new `server/eslint.config.js`, `package.json` | **The server has no lint config at all.** `no-constant-condition` catches `if (0)` — the exact bug in V06 — and stops it recurring | S | — |
| **16** | Write ~20 authz/exposure tests. Let them **fail** | [S13](suggestions/13.add-a-test-suite.md) | new `server/tests/`, `package.json` | `"test": "echo \"Error: no test specified\" && exit 1"`. These failing tests are the acceptance criteria for every item below. Highest-value first test: *`User.findById(id)` is not null after `DELETE /delete-user`* | M | 15 |

> **P1 exit check:** delete a required var from `.env` → server **refuses to boot** with a named error · 11 failed logins in 15 min → 429 · `npx eslint src` flags `deleteUser.ts:35`.

---

### P2 — Auth and identity · the largest single win

| # | Do this | Ref | Files to touch | What is hurt right now | Effort | Needs |
| :-: | --- | :-: | --- | --- | :-: | :-: |
| **17** | **One `apiClient`** with interceptors | [S06](suggestions/06.single-http-client-with-interceptors.md) | new `client/src/lib/apiClient.ts`, ~60 hook files | 20 files use axios, 40 use `fetch`, each redeclaring the base URL and its own error handling. **Must precede CSRF** — applying a header by hand across 60 call sites is how three of them get forgotten | M | — |
| **18** | Unified session model, cookie-only tokens | [S04](suggestions/04.unify-auth-session-model.md) → closes [V16](vulnerabilities/16.tokens-returned-in-response-body.md) | [`loginUser.ts:56-71`](../server/src/controllers/userControllers/loginUser.ts#L56), [`refreshAccessToken.ts`](../server/src/controllers/userControllers/refreshAccessToken.ts), new `GET /users/me`, [`AuthContextProvider.tsx`](../client/src/contexts/AuthContextProvider.tsx), [`useRefreshUser.ts`](../client/src/hooks/data-fetching/useRefreshUser.ts), [`Logout.tsx`](../client/src/pages/Logout.tsx) | Login sets httpOnly cookies **and** returns both tokens in the JSON body — handing straight back to JS the thing `httpOnly` exists to hide. Also: every page load calls `POST /refresh-token`, which **rotates**, purely to ask "am I logged in?" | M | 17 |
| **19** | **CSRF double-submit, server + client, together** | [V03](vulnerabilities/03.no-csrf-protection-with-cross-site-cookies.md) + [V18](vulnerabilities/18.cors-allows-requests-with-no-origin.md) | new `csrf.middleware.ts`, [`app.ts`](../server/src/app.ts), `config/cors.ts`, `apiClient.ts` | `sameSite: "none"` in production with **no CSRF token, no origin check, nothing**. A plain auto-submitting HTML form posts tweets/comments/likes/subscriptions as any logged-in visitor — no JavaScript needed. **#18 makes this worse, so it must ship in the same release.** Remember `X-CSRF-Token` in `allowedHeaders` or every write breaks | M | 17, 18 |
| **20** | **`optionalAuth`; delete every `?userId=`** | [S05](suggestions/05.optional-auth-middleware.md) → closes [V07](vulnerabilities/07.unauthenticated-write-to-any-users-watch-history.md) | new `optionalAuth` in [`auth.middleware.ts`](../server/src/middleware/auth.middleware.ts), 9 controllers, 9 client hooks, [`view.route.ts:10-16`](../server/src/routes/view.route.ts#L10) | `POST /users/history/:videoId` has **no auth middleware** and takes the target user from the query string. One `curl`, no account, overwrites any user's watch history. Nine endpoints share the pattern. Note the inline "optional auth" in `view.route.ts` only checks the `Authorization` header — this app uses **cookies**, so it never fires | M | 18 |
| **21** | Account status + `tokenVersion` in the auth middleware | [V17](vulnerabilities/17.auth-middleware-ignores-account-status.md) + [V10](vulnerabilities/10.password-change-does-not-revoke-sessions.md) | [`auth.middleware.ts`](../server/src/middleware/auth.middleware.ts), [`user.model.ts`](../server/src/models/user.model.ts), [`changeCurrentPassword.ts:29`](../server/src/controllers/userControllers/changeCurrentPassword.ts#L29), [`constants.ts:24-31`](../server/src/constants.ts#L24), [`checkPayloadType.ts`](../server/src/utils/checkPayloadType.ts) | **One function, one edit, two findings.** Today: changing your password does not clear `refreshToken`, so an attacker refreshes weekly and is *never* evicted — indefinite, not 7-day. And `verifyJWT` never reads `isSuspended`/`isDeactivated` even though the document is loaded. Also fix the `try` block — it wraps the DB call, so a Mongo blip returns **401** and logs the user out | M | 18 |
| **22** | Decide deactivation semantics, then make all three agree | [V17](vulnerabilities/17.auth-middleware-ignores-account-status.md) | [`loginUser.ts:42-45`](../server/src/controllers/userControllers/loginUser.ts#L42), [`refreshAccessToken.ts:46`](../server/src/controllers/userControllers/refreshAccessToken.ts#L46), [`reactivateUser.ts`](../server/src/controllers/userControllers/reactivateUser.ts) | Three components, three rules: login **silently reactivates**, refresh **rejects**, and `reactivateUser` needs a token a deactivated user cannot get — so it is unreachable by the only people it is for. **Your call** (see §6) | S | 21 |
| **23** | Refresh-token rotation grace window | [S14](suggestions/14.fix-refresh-token-rotation-race.md) | [`generateAccessAndRefreshTokens.ts`](../server/src/controllers/userControllers/generateAccessAndRefreshTokens.ts), [`user.model.ts`](../server/src/models/user.model.ts), [`refreshAccessToken.ts`](../server/src/controllers/userControllers/refreshAccessToken.ts) | Two tabs refreshing at once → one wins, the other's token is now invalid → random logouts. **Gate the grace window on `tokenVersion`** or #21's password-change revocation gets resurrected by it | M | 21 |
| **24** | Enforce `isPublished` in `getVideoById` | [V11](vulnerabilities/11.unpublished-videos-readable-by-id.md) | [`getVideoById.ts:14`](../server/src/controllers/videoControllers/getVideoById.ts#L14), [`view.controller.ts:20`](../server/src/controllers/view.controller.ts#L20), [`getUserPlaylists.ts`](../server/src/controllers/playlistController/getUserPlaylists.ts) | The UI sells "unpublish" as *private*. `GET /videos/:id` applies **no publish filter and no owner check** and is public — the raw Cloudinary `videoFile` URL comes back to anyone. Every other read path filters correctly. **Pulled forward from Phase 4**: with #20 done this is ~5 lines; return **404, not 403** | S | 20 |

> **P2 exit check:** login response body contains **no** `accessToken`/`refreshToken` · a form POST from a foreign origin → 403 · `curl -X POST '<api>/users/history/<vid>?userId=<other>'` → 401 · change password, then the old refresh token → 401 · `GET /videos/<unpublished-id>` anonymously → 404.

---

### P3 — Input and output contracts

| # | Do this | Ref | Files to touch | What is hurt right now | Effort | Needs |
| :-: | --- | :-: | --- | --- | :-: | :-: |
| **25** | **Zod validation at every route boundary** | [S02](suggestions/02.central-validation-layer.md) → closes [V14](vulnerabilities/14.weak-registration-validation.md), [V12](vulnerabilities/12.nosql-operator-injection.md), [S21](suggestions/21.content-length-limits.md) | new `server/src/schemas/`, new `validate.middleware.ts`, all route files | `registerUser.ts:10` calls `field.trim()` **before** checking the field exists → omit `fullname` and you get a **500** plus an orphaned upload. No password policy anywhere — `"a"` is valid. No max length on any text field. And body-based operator injection (the real half of V12) dies here | L | 13 |
| **26** | **Projections module** — allowlist, never denylist | [V08](vulnerabilities/08.user-object-overexposure.md) + [V09](vulnerabilities/09.email-addresses-exposed-on-public-endpoints.md) | new `server/src/constants/projections.ts`, [`fetchUserById.ts:13`](../server/src/controllers/userControllers/fetchUserById.ts#L13), [`homepage.controller.ts:21`](../server/src/controllers/homepage.controller.ts#L21), [`getUserChannelProfile.ts:79`](../server/src/controllers/userControllers/getUserChannelProfile.ts#L79), [`fetchTweet.ts:17`](../server/src/controllers/tweetControllers/fetchTweet.ts#L17), [`auth.middleware.ts`](../server/src/middleware/auth.middleware.ts), [`refreshAccessToken.ts:33`](../server/src/controllers/userControllers/refreshAccessToken.ts#L33) | `.select("-password -refreshToken")` is a **denylist** — every future schema field is public by default. Anonymous `GET /users/profile/:id` returns `email`, the full **`watchHistory`**, `isAdmin`, `suspensionReason`. `refreshAccessToken` uses `.select("-password")` only, so it ships the **`refreshToken` hash** to the browser. **Two documents, one fix — do them in one pass** | M | 20 |
| **27** | Filter deactivated/suspended in `fetchUserById` | [V08](vulnerabilities/08.user-object-overexposure.md) | [`fetchUserById.ts`](../server/src/controllers/userControllers/fetchUserById.ts) | Search, homepage and channel-profile all exclude them; this endpoint does not. So "deactivate my account" does not actually hide you | XS | 26 |
| **28** | Shared pagination contract, clamped at 100 | [S09](suggestions/09.shared-pagination-contract.md) → closes rest of [V13](vulnerabilities/13.unbounded-pagination-and-unpaginated-search.md) | new `server/src/utils/pagination.ts`, ~10 controllers, client types | Ten controllers, ten different implementations. `?limit=1000000` is honoured by feed, liked-content, playlists, watch-history and all three comment endpoints. `?page=-5` → negative `$skip` → **unhandled 500**. `getSubscribedChannels` and `getLikedVideos` have no pagination at all. Response field names disagree three ways (`havePrevPage` / `hasPrevPage` / `hasPreviousPage`) | M | 25 |
| **29** | Fix the silent-success writes | [V20](vulnerabilities/20.silent-authorization-failures.md) | [`deletePlaylist.ts:17-21`](../server/src/controllers/playlistController/deletePlaylist.ts#L17), [`updateTweet.ts:17-35`](../server/src/controllers/tweetControllers/updateTweet.ts#L17), [`comment.controller.ts:129-137`](../server/src/controllers/comment.controller.ts#L129) | `deleteOne` returns `{deletedCount: 0}` — **truthy** — so deleting a playlist you don't own returns 200 "DELETED SUCCESSFULLY". `updateTweet` ends in `$merge`, which always returns `[]`, so it **always** reports success and **never** returns the tweet — a live client bug. `deleteComment` uses `findOneAndDelete` where it needs `deleteMany`, orphaning every like but one. **Authorization holds in all three — only the reporting is wrong** | S | — |
| **30** | One honest response envelope | [S16](suggestions/16.consistent-response-envelope.md) | [`ApiResponse.ts`](../server/src/utils/ApiResponse.ts), controllers, client types | `new ApiResponse(400, false, "INCORRECT PASSWORD")` sets `success: false` inside a **200** response. Nested `data.data` in places. Health endpoints stay a documented exception | M | 28 |

> **P3 exit check:** `POST /users/register` with `fullname` omitted → **400**, not 500 · `?limit=999999` → at most 100 rows · anonymous `GET /users/profile/:id` → no `email`, no `watchHistory`, no `isAdmin` · deleting someone else's playlist → **403/404**.

---

### P4 — Data layer

| # | Do this | Ref | Files to touch | What is hurt right now | Effort | Needs |
| :-: | --- | :-: | --- | --- | :-: | :-: |
| **31** | Indexes + unique constraints | [S07](suggestions/07.database-indexes-and-unique-constraints.md) | all 7 files in [`server/src/models/`](../server/src/models/), one dedup migration | Only `User` (3) and `View` declare indexes. **`Video`, `Tweet`, `Comment`, `Like`, `Playlist`, `Subscription` declare none** — every `owner` lookup and every `$sort: {createdAt}` is a collection scan, and Mongo aborts in-memory sorts at 100 MB. No unique constraint on `Like` or `Subscription`, so double-likes and duplicate subscriptions are only prevented by check-then-write races | M | — |
| **32** | Transactional cascade deletes | [S12](suggestions/12.atomic-cascade-deletes.md) | new `withTransaction` helper, [`deleteVideo.ts`](../server/src/controllers/videoControllers/deleteVideo.ts), [`deleteTweet.ts`](../server/src/controllers/tweetControllers/deleteTweet.ts), [`comment.controller.ts`](../server/src/controllers/comment.controller.ts) | `deleteVideo` runs **nine sequential unprotected operations** — Cloudinary deletes happen *first*, so a crash after them leaves a DB row pointing at deleted media. **Requires a replica set** (see §6) | M | 31 |
| **33** | Cloudinary asset lifecycle | [S19](suggestions/19.cloudinary-asset-lifecycle.md) | [`updateUserAvatar.ts`](../server/src/controllers/userControllers/updateUserAvatar.ts), [`updateUserCoverImage.ts`](../server/src/controllers/userControllers/updateUserCoverImage.ts), [`registerUser.ts`](../server/src/controllers/userControllers/registerUser.ts), backfill script | `avatarPublicId` / `CoverImagePublicId` are declared and **never written** by any live path. Every avatar change orphans the old asset in Cloudinary forever. **Must land before #34** or the deletion cleanup has nothing to delete | S | — |
| **34** | **Make account deletion actually delete** | [V06](vulnerabilities/06.account-deletion-is-a-noop.md) | [`deleteUser.ts`](../server/src/controllers/userControllers/deleteUser.ts), [`user.routes.ts:57`](../server/src/routes/user.routes.ts#L57), [`useDeleteUser.ts`](../client/src/hooks/CRUD-hooks/useDeleteUser.ts) | `if (0)` — confirmed on disk. Returns **200 "USER DELETED FROM THE DATABASE"** having deleted nothing, and does not even clear cookies. Do **not** just remove the `if (0)`: the code inside calls `findOneAndDelete(userId)` (needs a *filter*), every `if (!x) throw` is dead, and nothing touches Cloudinary or `View`. Switch `POST` → `DELETE`; require password re-entry | M | 32, 33 |
| **35** | Service layer for the visibility rules | [S08](suggestions/08.service-layer-extraction.md) | new `server/src/services/`, most controllers | 60+ controllers each re-derive the same rules, and the copies have drifted — `getPlaylistById` filters `isPublished`, `getUserPlaylists` does not. `findVisibleVideo()` in one place makes #24 permanent instead of a patch | L | 24, 28 |

> **P4 exit check:** `db.videos.getIndexes()` shows an `owner` index · double-like the same video → duplicate-key error, not two documents · after `DELETE /users/delete-user`, `User.findById(id)` is null or anonymised, and their videos are gone from the feed.

---

### P5 — Remaining

| # | Do this | Ref | Files to touch | What is hurt right now | Effort | Needs |
| :-: | --- | :-: | --- | --- | :-: | :-: |
| **36** | `<RequireAuth>` instead of the global loading gate | [S18](suggestions/18.client-loading-gate-blocks-public-pages.md) | [`App.tsx:61`](../client/src/App.tsx#L61) | `if (loading) return <AppLoadingProgress />` blanks the **whole app** — including public pages and the 404 — until the session probe answers. First-time visitors see a spinner for a request that will fail. #18 makes it cheaper (`/users/me` doesn't rotate) | S | 18 |
| **37** | Structured logging: redaction, request IDs, levels | [S11](suggestions/11.structured-logging-with-redaction.md) | [`logger.service.ts`](../server/src/services/logger.service.ts), [`requestLogger.middleware.ts`](../server/src/middleware/requestLogger.middleware.ts) | P0 stopped the bleeding; this is the durable version. Note file transports only exist under `NODE_ENV=production` — yet `server/logs/` is populated, so that ran locally at some point. The guard is not the safety net it looks like | M | — |
| **38** | Deterministic feed | [S15](suggestions/15.deterministic-feed-pagination.md) | [`feed.controller.ts:19-22,49-52`](../server/src/controllers/feed.controller.ts#L19) | `$sort: { createdAt: Math.random() < .5 ? 1 : -1 }` — the sort direction is **re-rolled per request**, so paging through the feed shows duplicates and skips items. Needs a cursor, not a page number | M | 28, 31 |
| **39** | Remove the dead privilege fields | [V19](vulnerabilities/19.dead-privilege-fields.md) | [`user.model.ts:48-53`](../server/src/models/user.model.ts#L48), `ModelTypes.ts`, one mongosh `$unset` | `isAdmin` is written by nothing and read by nothing — confirmed, one grep hit. It advertises which account to target. **Keep `isSuspended` and `isDeactivated`** — #21 and five existing call sites depend on them | S | 26 |
| **40** | Delete the rest of the dead code | [S20](suggestions/20.remove-dead-code.md) | `makingURLsecure.ts`, `updateUsersWithPublicId.ts`, `Test.tsx` + its route | `makingURLsecure` is an unrouted migration that **never sends a response** — wire it up and the request hangs until timeout. Both belong in `scripts/`, not `controllers/` | S | 15 |
| **41** | Direct-to-Cloudinary signed uploads | [S10](suggestions/10.direct-to-cloudinary-uploads.md) | new signing endpoint, [`VideoUploadForm.tsx`](../client/src/components/Videos/VideoUploadForm.tsx), [`ChangeProfileImage.tsx`](../client/src/components/homepage/ChangeProfileImage.tsx), delete `multer.middleware.ts` | Largest change here. **Supersedes #5 and #6 entirely** — do not keep both; validation moves into the signed params. Removes the whole upload-vulnerability class rather than bounding it. Judgement call (§6) | L | 25 |
| **42** | Namespace channel pages under `/c/:username` | [V12](vulnerabilities/12.nosql-operator-injection.md) | [`App.tsx:94`](../client/src/App.tsx#L94), [`homepage.route.ts`](../server/src/routes/homepage.route.ts), client links | `<Route path="/:username">` at the router root means any username shadows an app route — `settings`, `history`, `search`. A reserved-word list works but must be hand-synced with `App.tsx` forever. **Cheap now, expensive after launch** | M | 25 |

---

## Section 5 — Dependency graph

The only hard ordering constraints. Anything unconnected can be done whenever.

```
   P0 ─────────────────────────────────────────────────────────────►  (no deps at all)
   1..10   logs · static · multer · SMTP · health · Suspense


   11  fail-fast config ──┬──► 13  middleware baseline ──► 14  login oracle
   (rotate secrets)       │
                          └──► (everything server-side, transitively)

   12  cap search  ────────────────────────────────────────────────►  (standalone)

   15  eslint ──► 16  failing tests ──────────────────────────────►  (acceptance gate)

   17  apiClient ──┬──► 18  session model ──┬──► 19  CSRF  ◄── 13
                   │         │              │        ▲
                   └─────────┘              │        └── (CORS allowedHeaders)
                                            │
                                            ├──► 20  optionalAuth ──► 24  isPublished
                                            │              │
                                            │              └────────► 26  projections
                                            │
                                            └──► 21  status + tokenVersion ──┬──► 22  deactivation
                                                                             └──► 23  rotation race

   13 ──► 25  zod validation ──┬──► 28  pagination ──► 30  envelope
                               ├──► 41  direct uploads
                               └──► 42  /c/:username

   26 ──► 27  filter deactivated
   26 ──► 39  remove dead fields

   31  indexes ──► 32  transactions ──┐
   33  cloudinary IDs ────────────────┼──► 34  REAL DELETION
                                      │
   24 + 28 ──► 35  service layer ─────┘

   29  silent writes ─────────────────────────────────────────────►  (standalone)
```

**Three edges are easy to get wrong — they will bite you:**

1. **17 → 19.** Ship CSRF before the shared `apiClient` and you are hand-editing 60 call sites. Three will be missed and those three routes break in production.
2. **18 → 19.** Cookie-only tokens *without* CSRF is a **net regression** — the cookie becomes the sole credential and it is sent automatically. Same release, both.
3. **33 → 34.** Real deletion before `avatarPublicId` is ever written means the Cloudinary cleanup silently deletes nothing, and you will believe it worked.

---

## Section 6 — Risk burn-down

Roughly what each phase buys, weighting confirmed-exploitable findings by blast radius:

```
  open
  risk
   100 ┤████████████████████████████████████████  today
       │
    78 ┤███████████████████████████████           after P0   ← 10 items, one sitting
       │                                                       (live credential + public
       │                                                        upload dir + dead TLS)
    46 ┤██████████████████                        after P1   ← forgeable tokens gone,
       │                                                       floods bounded, harvest capped
       │
    22 ┤████████                                  after P2   ← CSRF closed, IDOR closed,
       │                                                       recovery path works again
       │
     9 ┤███                                       after P3   ← PII contained, 500s bounded
       │
     4 ┤█                                         after P4   ← deletion honest, data atomic
       │
     1 ┤▌                                         after P5
       └┬────┬────┬────┬────┬────┬────
       now  P0   P1   P2   P3   P4   P5
```

**P0 and P1 together remove roughly half the exploitable risk for well under a day of work.** That is the whole argument for this ordering. If you stop reading here, do P0 today and P1 this week.

---

## Section 7 — Decisions only you can make

Four items in the queue are blocked on a product choice, not a technical one. Decide before you reach them.

| # | Blocks | The question | My recommendation |
| :-: | :-: | --- | --- |
| 1 | **#22** | **Deactivation semantics.** Reversible by logging in, or requires explicit reactivation? Three components currently disagree | **Reversible by logging in** — keep `loginUser`'s behaviour, drop the check in `refreshAccessToken`, delete `reactivateUser` as unreachable-and-redundant. Simplest, and it is what most products do |
| 2 | **#34** | **Deletion model.** Hard delete, or anonymise-and-purge with a tombstone? | **Anonymise-and-purge.** Satisfies a deletion request with no personal data left, without dangling references from other users' comments and playlists |
| 3 | **#32, #34** | **MongoDB replica set.** Transactions require one. Atlas provides it on every tier including free; a standalone local `mongod` does not | If you are on Atlas you already have it — verify and move on. If local, run a single-node replica set rather than gating the code |
| 4 | **#41** | **Direct uploads — worth it?** Removes a whole vulnerability class and your media bandwidth, at the cost of an asset-verification step and an orphan sweep | **Yes for a video platform.** If this stays avatars-only, skip it and keep the hardened multer from #5 |

One more, smaller but time-sensitive:

- **#42 `/c/:username`.** A reserved-word list is the cheap answer and it works — but it must stay hand-synced with `App.tsx` forever. Namespacing removes the coupling permanently and is cheap *now*, expensive after you have users with usernames.

---

## Section 8 — What is already right

An audit is a list of problems, which is a distorted picture. Verified as correct and worth **not** touching:

- **Passwords are bcrypt-hashed** in a `pre("save")` hook with an `isModified` guard — the guard is the part people get wrong.
- **Refresh tokens are hashed at rest and rotated on use.** Beyond what most projects at this stage do.
- **Cookies are `httpOnly` + `secure` + `sameSite`**, and **nothing** writes a token to `localStorage` — grep confirms the only `localStorage` use is the dark-mode preference. The single most common React auth mistake, avoided.
- **The CORS allowlist is exact-match** — no wildcard, no `startsWith`, no regex.
- **Body size limits (`16kb`)** are set on both parsers.
- **`searchUserText.controller.ts:19` escapes its regex correctly** — the two `getAllVideos` controllers do not, which is what makes that a real finding rather than a style note.
- **Ownership is pushed into the query** (`findOneAndUpdate({_id, owner})`) in three of four playlist mutations. The bug in V20 is only that the fourth does not check the result.
- **`asyncHandler` wraps every controller** — no route can hang on an unhandled rejection.
- **Graceful shutdown** handles `SIGTERM`/`SIGINT` and closes Mongo. Genuinely uncommon.
- **`strict: true`** in both tsconfigs.
- **`.env` is correctly gitignored**, `logs/` too, and `git ls-files` confirms no secret ever reached history.

The recurring theme across all 42 findings is not carelessness. It is that a correct pattern was written once and then copied, and the copies drifted. That is precisely what items **#25** (validation), **#26** (projections), **#28** (pagination) and **#35** (service layer) exist to prevent — they replace "copy the pattern" with "call the one implementation".
