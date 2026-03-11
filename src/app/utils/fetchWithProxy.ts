/**
 * Fetches a JSON resource, trying multiple strategies in order:
 *   1. Direct fetch          — works when the server sets CORS headers (e.g. Vercel APIs)
 *   2. corsproxy.io          — returns the upstream body directly
 *   3. api.codetabs.com      — returns the upstream body directly
 *   4. api.allorigins.win    — returns { contents: "<JSON string>" }
 *
 * Each strategy is tried in sequence; failures (including non-2xx) move to
 * the next one.  AbortError is always re-thrown immediately.
 * Rejects only when every strategy has failed.
 */

type Strategy = {
  buildUrl: (target: string) => string;
  /** true when the proxy wraps the body in { contents: "...JSON..." } */
  wrapped: boolean;
};

const STRATEGIES: Strategy[] = [
  {
    // Direct — no proxy; works for APIs that already set Access-Control-Allow-Origin
    buildUrl: (t) => t,
    wrapped: false,
  },
  {
    buildUrl: (t) => `https://corsproxy.io/?${encodeURIComponent(t)}`,
    wrapped: false,
  },
  {
    buildUrl: (t) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(t)}`,
    wrapped: false,
  },
  {
    buildUrl: (t) => `https://api.allorigins.win/get?url=${encodeURIComponent(t)}`,
    wrapped: true,
  },
];

export async function fetchWithProxy(
  url: string,
  signal: AbortSignal
): Promise<unknown> {
  let lastError: unknown;

  for (const strategy of STRATEGIES) {
    const proxyUrl = strategy.buildUrl(url);
    try {
      const res = await fetch(proxyUrl, { signal });

      if (!res.ok) {
        console.warn(`[fetchWithProxy] ${proxyUrl} → HTTP ${res.status}, trying next…`);
        continue; // try next strategy
      }

      if (strategy.wrapped) {
        const wrapper = await res.json() as { contents: string };
        return JSON.parse(wrapper.contents);
      }
      return await res.json();
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err; // always propagate abort
      lastError = err;
      console.warn(`[fetchWithProxy] ${proxyUrl} failed:`, (err as Error).message, "— trying next…");
    }
  }

  throw lastError;
}
