// resources/js/Services/http.ts

/** Returns the CSRF token stored in the <meta name="csrf-token"> tag */
export function getCsrfToken(): string {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token?.getAttribute('content') ?? '';
}

/**
 * Wrapper around fetch that:
 * • Sends the CSRF token automatically.
 * • Includes cookies (credentials: 'include').
 * • Gracefully handles 204/205 or empty-body responses.
 *
 * @param url       Request URL.
 * @param options   Standard RequestInit plus:
 *                  └ expectJson?: boolean – set false if you know no JSON is returned.
 *
 * @returns Parsed JSON (T) or undefined when there is no body.
 */
export async function fetchWithCsrf<T = unknown>(
  url: string,
  options: RequestInit & { expectJson?: boolean } = {},
): Promise<T> {
  const csrfToken = getCsrfToken();

  /** Merge caller headers with defaults + CSRF */
  const headers: HeadersInit = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers ?? {}),
    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
  };

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  /** Throw with response text (or status text) if NOT ok */
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || response.statusText);
  }

  /** Caller explicitly said “don’t parse JSON” */
  if (options.expectJson === false) return undefined as T;

  /** 204/205 or empty body → nothing to parse */
  if (
    response.status === 204 ||
    response.status === 205 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined as T;
  }

  /** Otherwise parse the JSON payload */
  return (await response.json()) as T;
}
