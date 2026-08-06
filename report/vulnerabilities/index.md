# Vulnerabilities — where to start and how to work through them

There are 20 documents in this folder. **You are not supposed to read them all before starting**, and you are definitely not supposed to fix them all in one sitting. This page is the order to work in and the reasoning behind that order.

---

## Read this before anything else

Some framing, because it matters for how you approach the list.

**This code is not bad for what it is.** It is a first backend, and it has things a lot of "senior" codebases do not: bcrypt with a proper `isModified` guard, hashed refresh tokens with rotation, `httpOnly` cookies with no token in `localStorage`, an exact-match CORS allowlist, body size limits, graceful shutdown, `strict: true`. Those are not accidents. Someone made those choices.

**A large share of this list is inherited, not invented.** The `ApiError` / `ApiResponse` / `asyncHandler` trio, the `uploadOnCloudinary` helper, the model layout, `registerUser` uploading to Cloudinary before validating — this is the standard structure from the widely-followed MERN backend course series, and thousands of repos have the exact same shape. That includes some of its exact bugs: `if (!user) throw` on values that are never falsy, `$or: [{ username, email }]` written with the braces in the wrong place, `.trim()` called before the existence check. You did not get those wrong on your own. You copied a pattern that had them.

That is worth knowing for two reasons. It should take the sting out of the list. And it should make you suspicious of tutorial code in general from now on — which is a genuinely useful instinct to develop.

**Two findings are confirmed in your working tree**, not theoretical:
- `02` — an actual password, in plaintext, in `server/logs/http.log`, right now.
- `06` — account deletion is wrapped in `if (0)` and deletes nothing while reporting success.

Start with those.

---

## The one idea that explains half this list

If you take one thing from this folder, take this:

> **The server must never trust anything the client says about who it is or what it may do.**

Count how many findings are that same mistake wearing a different hat:

| Finding | The client was trusted about... |
|---|---|
| `07` | which user's watch history to write to (`?userId=`) |
| `11` | nothing — but the server never checked whether the viewer may see this video |
| `12` | the *type* of `username`, so an object became a query operator |
| `13` | how many records to return (`?limit=1000000`) |
| `14` | whether the password is long enough |
| `17` | that a valid token means an active account |
| `20` | that the write it asked for actually happened |

Seven of twenty. The pattern is always the same: a value crossed the network boundary and was used without being checked.

The counter-habit is a question to ask about every single line that reads `req.body`, `req.query`, or `req.params`:

1. **What type is this actually?** Not what you assume — `req.query.limit` is `string | string[] | ParsedQs | undefined`, never `number`.
2. **Who is allowed to do this?** And is that derived from the token, or from something the caller sent?
3. **What is the worst value someone could put here?** Not the worst *typo* — the worst *deliberate* value.

Ask those three questions on every handler you write from now on and you will not produce most of this list again.

---

## Your plan

### Week 1 — bleeding stops (about 2 hours total)

These are one-liners and deletions. No new concepts, no design decisions, nothing that can break the app.

| Do this | Doc | Time |
|---|---|---|
| `rm server/logs/*.log` — a real password is in there | [02](02.plaintext-passwords-written-to-logs.md) | 1 min |
| Delete `logData.body = req.body` from `requestLogger.middleware.ts` | [02](02.plaintext-passwords-written-to-logs.md) | 2 min |
| Delete `app.use(express.static("public"))` from `app.ts` | [04](04.unauthenticated-file-upload-to-public-directory.md) | 2 min |
| Add `limits` + `fileFilter` to multer | [04](04.unauthenticated-file-upload-to-public-directory.md) | 20 min |
| Delete `mail.service.ts`, revoke the Gmail App Password | [15](15.smtp-tls-verification-disabled-and-debug-logging.md) | 10 min |
| Remove the fallback secrets from `dotenvHelper.ts`; throw instead | [01](01.hardcoded-fallback-jwt-secrets.md) | 30 min |
| Rotate `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` | [01](01.hardcoded-fallback-jwt-secrets.md) | 5 min |
| Add `npm install express-rate-limit`, limiter on `/login` + `/contact` | [05](05.no-rate-limiting-on-any-endpoint.md) | 40 min |

Rotating the secrets logs everyone out once. That is correct and expected — do it anyway.

After this, the two proven leaks are closed and the two cheapest abuse paths (credential brute force, contact-form email bombing) are bounded.

### Week 2 — the ones that teach you the most

Now the concepts. Each of these will change how you think, not just what your code does.

**[07 — the `?userId=` IDOR](07.unauthenticated-write-to-any-users-watch-history.md)** — start here. It is one route, and it is the cleanest possible illustration of the trust boundary. Fix it, then grep for `req.query.userId` and see the other eight places doing the same thing. That grep is the moment the idea lands.

**[11 — unpublished videos readable by ID](11.unpublished-videos-readable-by-id.md)** — teaches the difference between "hidden from listings" and "access controlled". Also teaches why you return **404 instead of 403** when someone asks for something they cannot see, which is a genuinely non-obvious piece of craft.

**[12 — NoSQL operator injection](12.nosql-operator-injection.md)** — the moment you understand that `?inp[$ne]=x` arrives as an *object*, you will never write `const { x } = req.query` the same way again. Try the exploit against your own local server first. Watching it work is worth more than reading about it.

**[20 — silent authorization failures](20.silent-authorization-failures.md)** — `deleteOne()` returns `{acknowledged: true, deletedCount: 0}`, which is truthy, so `if (!result) throw` never fires. Teaches you to check what a library function actually returns instead of assuming. Then go find the ~30 other places in your codebase with the same shape.

**[14 — password policy and `.trim()` on `undefined`](14.weak-registration-validation.md)** — small, and it forces you to think about validation before you build the general solution for it.

### Week 3 — the browser security model

**[03 — CSRF](03.no-csrf-protection-with-cross-site-cookies.md)** is the hardest thing in this folder to *understand*, and it is not hard to *implement*. Budget the time for the understanding.

The thing to sit with: **CORS does not stop the request from happening.** It stops the attacker from *reading the response*. The write already went through. Almost everyone gets this wrong the first time, and if you can explain it clearly you are ahead of a lot of working developers.

Build the proof of concept in the document — a plain HTML file, opened from `file://` or a different localhost port, that posts a tweet as you. Seeing your own API accept it is the part that makes it real.

Do [18](18.cors-allows-requests-with-no-origin.md) in the same sitting; it is the same subject and the two documents have to agree with each other.

### Week 4+ — session management

**[10](10.password-change-does-not-revoke-sessions.md)**, **[16](16.tokens-returned-in-response-body.md)**, **[17](17.auth-middleware-ignores-account-status.md)** are one project, not three. They all edit the same auth path and they share a design.

Read [`../suggestions/04.unify-auth-session-model.md`](../suggestions/04.unify-auth-session-model.md) **before** starting, so you decide the token payload shape once instead of three times.

### Whenever — the rest

[08](08.user-object-overexposure.md), [09](09.email-addresses-exposed-on-public-endpoints.md), [13](13.unbounded-pagination-and-unpaginated-search.md), [19](19.dead-privilege-fields.md) are mechanical once you have the habits from weeks 2-3.

[06](06.account-deletion-is-a-noop.md) — the `if (0)` — is last **on purpose**, even though it is ranked 8. Deleting the `if (0)` is trivial; writing a *correct* cascade delete needs transactions, which needs a replica set, which needs [`../suggestions/12.atomic-cascade-deletes.md`](../suggestions/12.atomic-cascade-deletes.md). Do not rush it. In the meantime, **remove the delete button from the UI** so the app stops making a promise it does not keep. That is a two-minute fix for the honesty problem, and it buys you time to do the real one properly.

---

## Difficulty, honestly

| Doc | Effort | New concept needed? | Worth the learning time |
|---|---|---|:---:|
| [02](02.plaintext-passwords-written-to-logs.md) logs | one line | no | ★★☆ |
| [15](15.smtp-tls-verification-disabled-and-debug-logging.md) SMTP | delete a file | TLS basics | ★★☆ |
| [01](01.hardcoded-fallback-jwt-secrets.md) env fallbacks | 30 min | fail-fast config | ★★★ |
| [04](04.unauthenticated-file-upload-to-public-directory.md) uploads | 30 min | middleware order | ★★★ |
| [05](05.no-rate-limiting-on-any-endpoint.md) rate limiting | 45 min | `trust proxy` | ★★★ |
| [07](07.unauthenticated-write-to-any-users-watch-history.md) IDOR | 30 min | **trust boundary** | ★★★★★ |
| [11](11.unpublished-videos-readable-by-id.md) unpublished | 30 min | 404 vs 403 | ★★★★ |
| [12](12.nosql-operator-injection.md) NoSQL injection | 1 hr | operator injection | ★★★★★ |
| [20](20.silent-authorization-failures.md) silent failures | 1 hr | reading return types | ★★★★ |
| [14](14.weak-registration-validation.md) validation | 1 hr | password policy | ★★★ |
| [13](13.unbounded-pagination-and-unpaginated-search.md) unbounded limits | 2 hrs | resource exhaustion | ★★★ |
| [03](03.no-csrf-protection-with-cross-site-cookies.md) **CSRF** | 3-4 hrs | **browser security model** | ★★★★★ |
| [18](18.cors-allows-requests-with-no-origin.md) CORS | 1 hr | preflight | ★★★★ |
| [08](08.user-object-overexposure.md)/[09](09.email-addresses-exposed-on-public-endpoints.md) exposure | 2 hrs | allowlist > denylist | ★★★★ |
| [16](16.tokens-returned-in-response-body.md) tokens in body | 2 hrs | why `httpOnly` exists | ★★★★ |
| [17](17.auth-middleware-ignores-account-status.md) account status | 1 hr | — | ★★☆ |
| [10](10.password-change-does-not-revoke-sessions.md) session revocation | 3 hrs | token versioning | ★★★★ |
| [19](19.dead-privilege-fields.md) dead fields | 30 min | — | ★★☆ |
| [06](06.account-deletion-is-a-noop.md) account deletion | 4-6 hrs | **transactions** | ★★★★★ |

The five-star rows are the ones that make you meaningfully better at this. If you only have time for a few, take those.

---

## How to actually do the work

**One branch, one fix, one commit.** Not `fix/security`. `fix/watch-history-idor`, then `fix/csrf`, then `fix/upload-limits`. When something breaks two weeks later you can find and revert exactly one thing.

**Verify the fix by attacking your own server.** Do not just read the code and conclude it is fixed — run the exploit before and after. Get a terminal open with:

```bash
API=http://localhost:3001/api/v1

# 07 — watch history IDOR. Before: 200. After: 401.
curl -i -X POST "$API/users/history/<any-video-id>?userId=<some-user-id>"

# 12 — NoSQL operator injection. Before: "ALREADY EXIST" for a free name.
curl -i "$API/users/check-username?inp\[\$ne\]=zzz"

# 09 — email exposure. Before: emails in the output. After: none.
curl -s "$API/search/q/a" | grep -o '"email":"[^"]*"' | head

# 13 — unbounded limit. Before: honoured. After: clamped.
curl -s "$API/feeds?limit=100000" | head -c 300

# 11 — unpublished video. Before: 200. After: 404.
curl -i "$API/videos/<an-unpublished-video-id>"

# 20 — deleting a playlist you do not own. Before: 200 "DELETED SUCCESSFULLY".
curl -i -X DELETE "$API/playlists/<someone-elses-playlist-id>" -b "accessToken=<your-token>"
```

Save these. Run them again after every change. This is the beginning of a test suite — and when you are ready to write real ones, [`../suggestions/13.add-a-test-suite.md`](../suggestions/13.add-a-test-suite.md) turns exactly these into automated checks.

**Fix the pattern, not just the instance.** Every time you fix one, grep for the same shape:

```bash
cd server
grep -rn "req.query.userId"          src/   # finding 07's pattern
grep -rn "if (!.*) throw new ApiError" src/ # finding 20's pattern
grep -rn "select(\"-"                src/   # findings 08/09's denylist pattern
grep -rn "Number(req.query"          src/   # finding 13's pattern
```

One fix teaches you the shape. The grep finds the rest. That is the difference between fixing a bug and fixing a class of bug, and it is most of what separates a mid-level developer from a junior one.

**When you cannot reproduce the exploit, say so.** Sometimes you will read a finding and not be able to trigger it. That is fine and it is worth investigating rather than assuming — I did that myself on `04`: the path-traversal theory was plausible, I tested it against your installed multer version, and it **did not work**. That claim is not in the document. Verify before you believe, including when the source is a report like this one.

---

## Things not to do

**Do not try to do all 20 in one branch.** You will end up with a 3,000-line diff you cannot review, cannot test, and cannot revert. If you break something you will not know which change did it.

**Do not skip straight to the architectural rewrites.** The `suggestions/` folder is more fun — new patterns, cleaner code, better structure. It is also where you will lose a month and end up with a half-migrated codebase. Get the security fixes in first. They are small and they are finished when they are finished.

**Do not "fix" a finding by hiding it in the UI.** Removing the delete button does not fix `07` — the endpoint is still there and does not care whether your React app calls it. The only exception is the deliberate stopgap noted above for `06`, and that is a stopgap, not a fix.

**Do not paste a fix you do not understand.** Every document explains the *why* before the code. If the why has not landed, the code will be wrong in six months when the surrounding context changes. If a document does not make sense, that is a signal to go read about the underlying concept — not to copy the snippet faster.

---

## Where this folder goes next

Once the security work is settled, the [suggestions](../suggestions/index.md) folder builds the structure that stops these coming back. Roughly:

- `?userId=` everywhere → one `optionalAuth` middleware
- validation in seven styles → one zod schema per route
- authorization logic re-derived per controller → one service function per rule

That folder has its own guide with the same treatment. Do not start it until week 3 or 4 here — the security fixes will teach you *why* those structures matter, and the suggestions land much better after that.

**Full picture, both folders, one implementation order:** [`../00.INDEX.md`](../00.INDEX.md).
