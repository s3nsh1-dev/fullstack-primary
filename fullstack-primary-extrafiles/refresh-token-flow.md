# Refresh Token Flow

This note explains how authentication currently works in this project, with a strict timeline of what happens during login, normal usage, access-token expiry, refresh, invalidation, and revalidation.

## Files Involved

- `server/src/constants.ts`
- `server/src/models/user.model.ts`
- `server/src/controllers/userControllers/generateAccessAndRefreshTokens.ts`
- `server/src/controllers/userControllers/loginUser.ts`
- `server/src/controllers/userControllers/refreshAccessToken.ts`
- `server/src/controllers/userControllers/logoutUser.ts`
- `server/src/middleware/auth.middleware.ts`
- `server/src/middleware/csrf.middleware.ts`
- `server/src/utils/refreshTokenSecurity.ts`
- `server/src/routes/user.routes.ts`
- `client/src/main.tsx`
- `client/src/utilities/csrfFetch.ts`
- `client/src/contexts/AuthContextProvider.tsx`
- `client/src/hooks/data-fetching/useRefreshUser.ts`
- `client/src/hooks/data-fetching/useLogin.ts`
- `client/src/hooks/data-fetching/useLogout.ts`

## Token Lifetimes

- Access token cookie lifetime: `15 minutes`
- Refresh token cookie lifetime: `7 days`
- CSRF token cookie lifetime: `7 days`

These are defined in `server/src/constants.ts`.

## What Gets Created

When the server logs a user in:

1. It creates an `accessToken` JWT.
2. It creates a `refreshToken` JWT.
3. It hashes the refresh token with bcrypt before saving it in MongoDB.
4. It sends the raw access token and raw refresh token back as cookies.
5. It also sends a `csrfToken` cookie.

Important detail:

- The database stores only one refresh token hash per user.
- That means each successful login or refresh replaces the previous refresh-token chain for that user.

## Timeline: Full Auth Cycle

### 1. User Logs In

Client:

- `client/src/hooks/data-fetching/useLogin.ts` sends `POST /users/login`
- `credentials: "include"` is enabled, so cookies can be set by the browser

Server:

- `server/src/controllers/userControllers/loginUser.ts` validates username/email and password
- It calls `generateAccessAndRefreshTokens()`
- `generateAccessAndRefreshTokens()`:
  - generates a fresh access token
  - generates a fresh refresh token
  - hashes the refresh token
  - stores the hashed refresh token in the user document
- `loginUser.ts` then sets these cookies:
  - `accessToken`
  - `refreshToken`
  - `csrfToken`

Result:

- Browser now holds all 3 cookies
- DB holds only the hashed refresh token

### 2. User Makes Normal Protected Requests

For normal protected routes:

- the browser sends cookies automatically
- many client requests use `credentials: "include"` or `withCredentials: true`

Server-side protection happens in `server/src/middleware/auth.middleware.ts`:

1. It validates CSRF for mutating requests.
2. It reads `accessToken` from the cookie.
3. If needed, it can also read `Authorization: Bearer ...` as fallback.
4. It verifies the access token JWT.
5. It fetches the user from MongoDB.
6. If valid, the request continues.

Important:

- During normal requests, the refresh token is not checked.
- Only the access token is used for regular route authentication.

### 3. Access Token Expires

This is the key behavior in the current codebase.

When the `accessToken` expires:

1. The next protected API request still goes out from the client.
2. `verifyJWT` tries to verify the expired access token.
3. JWT verification fails.
4. The server returns `401`.

What does **not** happen automatically:

- There is no axios interceptor.
- There is no global fetch wrapper that catches `401` and retries.
- There is no built-in flow like:
  - request fails
  - call `/users/refresh-token`
  - replay original request

So in this project, when the access token expires mid-session, the immediate protected request simply fails first.

### 4. What Actually Triggers `/users/refresh-token`

The main refresh trigger is app auth bootstrap.

Client startup flow:

1. `client/src/main.tsx` installs the CSRF-aware fetch wrapper.
2. `AuthContextProvider` mounts.
3. `AuthContextProvider` calls `useRefreshUser()`.
4. `useRefreshUser()` sends `POST /users/refresh-token`.
5. While this is pending, `App.tsx` shows the loading screen.

So the project mostly uses refresh as:

- "restore session when the app loads"

not as:

- "silently recover after every expired access token"

This means a common real-world sequence here is:

1. Access token expires while SPA is already open.
2. Next protected request fails with `401`.
3. User refreshes the page or causes auth bootstrap again.
4. Then `/users/refresh-token` gets called.

### 5. What Happens Inside `/users/refresh-token`

Route:

- `POST /users/refresh-token`
- registered in `server/src/routes/user.routes.ts`

Protection:

- it uses CSRF verification via `verifyCsrf`
- the client can satisfy this because `client/src/utilities/csrfFetch.ts` automatically attaches `X-CSRF-Token` from the `csrfToken` cookie for mutating `fetch` requests

Server refresh flow in `server/src/controllers/userControllers/refreshAccessToken.ts`:

1. Read `refreshToken` from cookies.
2. If missing, reject with `401`.
3. Verify the refresh JWT signature and expiry.
4. Read `_id` from the decoded refresh token.
5. Load that user from MongoDB.
6. Reject if user is suspended.
7. Reject if user is deactivated.
8. Compare incoming raw refresh token with stored DB hash using bcrypt.
9. If comparison passes:
   - generate a new access token
   - generate a new refresh token
   - hash and store the new refresh token in DB
   - generate a new CSRF token
   - set all 3 cookies again

Result:

- old refresh token is no longer the active one
- new access token becomes the active auth token
- this is token rotation, not just access-token renewal

### 6. Revalidation After Refresh

If refresh succeeds:

- the browser receives:
  - new `accessToken`
  - new `refreshToken`
  - new `csrfToken`
- the DB now stores the hash of only the newest refresh token
- future requests continue normally using the new access token cookie

This is the revalidation point of the session.

## Invalidation Cases

### Logout

`server/src/controllers/userControllers/logoutUser.ts`:

1. requires authenticated user
2. removes `refreshToken` from the user record using `$unset`
3. clears:
   - `accessToken` cookie
   - `refreshToken` cookie
   - `csrfToken` cookie

Result:

- session is invalid both in browser and server-side refresh storage

### Refresh Token Replay / Mismatch

Inside `refreshAccessToken.ts`:

- if the incoming refresh token does not match the stored hash:
  - server unsets the stored refresh token from DB
  - server rejects with `401`

This is the "expired or used" branch.

Meaning:

- if an older refresh token is reused after rotation, it should fail
- the server then forces the user out of the refresh flow

### Refresh JWT Expiry

If the refresh token JWT itself is expired:

- JWT verification fails
- refresh endpoint clears cookies
- request returns `401`

At that point, the user must log in again.

### User Suspended or Deactivated

Refresh is also blocked if:

- `user.isSuspended === true`
- `user.isDeactivated === true`

So even with a valid refresh token cookie, the session will not be renewed.

## Exact Realistic Timeline In This Project

### Case A: Happy Path

1. User logs in.
2. Server sets `accessToken`, `refreshToken`, `csrfToken`.
3. User makes protected requests.
4. Server authenticates each protected request using `accessToken`.
5. Before or after reload, app bootstrap calls `/users/refresh-token`.
6. Server validates refresh token and rotates all tokens.
7. Session continues with new cookies.

### Case B: Access Token Expires While SPA Is Still Open

1. User logs in.
2. User stays on the SPA for more than 15 minutes.
3. `accessToken` expires.
4. User clicks some protected action.
5. Protected API request reaches server.
6. `verifyJWT` rejects the expired access token.
7. That request fails with `401`.
8. No automatic refresh-and-retry happens in the current client architecture.
9. If the app reloads and auth bootstrap runs, `useRefreshUser()` calls `/users/refresh-token`.
10. If refresh token is still valid, server rotates tokens and session is restored.

### Case C: Refresh Token Is Expired or No Longer Valid

1. Client sends `POST /users/refresh-token`.
2. Server fails to verify refresh JWT, or bcrypt comparison fails.
3. Server clears auth cookies.
4. Server rejects with `401`.
5. `useRefreshUser()` fails.
6. `AuthContextProvider` resolves user as `null`.
7. User is effectively logged out and must log in again.

## CSRF Part Of The Flow

This project protects cookie-authenticated mutating requests with a CSRF token.

Flow:

1. Server sets `csrfToken` cookie on login and refresh.
2. `client/src/utilities/csrfFetch.ts` patches `window.fetch`.
3. For `POST`, `PUT`, `PATCH`, `DELETE`, it reads the `csrfToken` cookie.
4. It sends that value in `X-CSRF-Token`.
5. Server checks that cookie and header match.

Why this matters for refresh:

- `/users/refresh-token` is a `POST`
- so refresh depends on the CSRF token being present and sent correctly

## One Important Architectural Conclusion

This project has refresh-token rotation on the server, but it does **not** currently have a full silent-refresh request-retry pipeline on the client.

So the current design is:

- access token authenticates normal requests
- refresh token restores session and rotates credentials
- refresh is mainly triggered by auth bootstrap through `useRefreshUser()`

not:

- every `401` automatically refreshes and retries the failed request

## Short Final Summary

- `accessToken` is for normal protected route access.
- `refreshToken` is only for `/users/refresh-token`.
- `csrfToken` protects cookie-based mutating requests.
- login creates all three cookies.
- refresh rotates all three cookies.
- logout clears all three cookies and unsets DB refresh token.
- expired access token causes protected requests to fail immediately.
- current client code does not automatically call refresh on that failure.
- refresh mostly happens when the app boots and `useRefreshUser()` runs.
