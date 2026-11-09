/**
 * The visit's UTM tags, carried from the page someone lands on to every form
 * they submit later in the same visit (Gallery Sonder, 2026-11-09: "tagging a
 * campaign link is enough").
 *
 * The root layout used to read them only from the URL of the first page it
 * mounted on, into in-memory app state. Client-side navigation kept them, but
 * any full page load (a reload, a link opened in a new tab, a Prismic link that
 * leaves the router) mounted the layout again on a URL with no tags, and the
 * campaign was gone by the time the visitor reached a form.
 *
 * Now the landing tags are also written to `sessionStorage`, which lives as
 * long as the tab and is copied into a tab opened from it. A URL that carries
 * tags always wins and replaces what was stored, so the newest campaign link a
 * visitor followed is the one credited (last touch within the visit).
 */

export type UtmParams = {
	source: string;
	medium: string;
	campaign: string;
	term: string;
	content: string;
};

type UtmStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const UTM_STORAGE_KEY = 'gallerysonder:utm';

const KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const;

/** What a form sends when the visit carries no tags: UtmFields renders these
 *  and submitForm drops the 'none' values. */
export const NO_UTM: UtmParams = {
	source: 'none',
	medium: 'none',
	campaign: 'none',
	term: 'none',
	content: 'none'
};

function fromUrl(search: Pick<URLSearchParams, 'get'>): UtmParams | null {
	const read = (key: (typeof KEYS)[number]) => search.get(`utm_${key}`)?.trim() || '';
	const values = Object.fromEntries(KEYS.map((k) => [k, read(k)])) as UtmParams;
	if (KEYS.every((k) => values[k] === '')) return null;
	return Object.fromEntries(KEYS.map((k) => [k, values[k] || 'none'])) as UtmParams;
}

function fromStorage(storage: UtmStorage | null): UtmParams | null {
	try {
		const raw = storage?.getItem(UTM_STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return null;
		const p = parsed as Record<string, unknown>;
		const values = Object.fromEntries(
			KEYS.map((k) => [k, typeof p[k] === 'string' && p[k] ? (p[k] as string) : 'none'])
		) as UtmParams;
		return KEYS.every((k) => values[k] === 'none') ? null : values;
	} catch {
		return null;
	}
}

/**
 * The UTM tags for this page load: the URL's when it carries any (saved for the
 * rest of the visit), else the visit's saved ones, else {@link NO_UTM}. Never
 * throws: storage can be missing or refuse access (private modes, blocked site
 * data), and then only the URL counts.
 */
export function landingUtm(
	search: Pick<URLSearchParams, 'get'>,
	storage: UtmStorage | null
): UtmParams {
	const url = fromUrl(search);
	if (url) {
		try {
			storage?.setItem(UTM_STORAGE_KEY, JSON.stringify(url));
		} catch {
			// Storage refused: the tags still reach this page's forms.
		}
		return url;
	}
	return fromStorage(storage) ?? { ...NO_UTM };
}

/** `window.sessionStorage`, or null where reading the accessor itself throws. */
export function visitStorage(): UtmStorage | null {
	try {
		return typeof window === 'undefined' ? null : window.sessionStorage;
	} catch {
		return null;
	}
}
