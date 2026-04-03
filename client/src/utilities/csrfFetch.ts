const csrfCookieName = "csrfToken";
const csrfHeaderName = "X-CSRF-Token";
const csrfProtectedMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const getCookieValue = (cookieName: string) => {
  const cookieEntry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (!cookieEntry) return "";

  return decodeURIComponent(cookieEntry.split("=")[1] || "");
};

const getRequestMethod = (input: RequestInfo | URL, init?: RequestInit) => {
  const method = init?.method || (input instanceof Request ? input.method : "GET");
  return method.toUpperCase();
};

export const installCsrfFetch = () => {
  const currentFetch = window.fetch as typeof window.fetch & {
    __csrfInstalled?: boolean;
  };

  if (currentFetch.__csrfInstalled) return;

  const originalFetch = window.fetch.bind(window);

  const csrfFetch: typeof window.fetch = (input, init) => {
    const method = getRequestMethod(input, init);

    if (!csrfProtectedMethods.has(method)) {
      return originalFetch(input, init);
    }

    const csrfToken = getCookieValue(csrfCookieName);

    if (!csrfToken) {
      return originalFetch(input, init);
    }

    const headers = new Headers(
      init?.headers ?? (input instanceof Request ? input.headers : undefined)
    );

    if (!headers.has(csrfHeaderName)) {
      headers.set(csrfHeaderName, csrfToken);
    }

    return originalFetch(input, { ...init, headers });
  };

  (csrfFetch as typeof window.fetch & { __csrfInstalled?: boolean }).__csrfInstalled =
    true;
  window.fetch = csrfFetch;
};
