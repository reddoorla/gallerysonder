/**
 * Helpers for serving responsively-sized Prismic (imgix) images.
 *
 * Prismic image URLs are imgix URLs, so appending `w`/`auto`/`q` query params
 * makes the CDN return a correctly-sized, modern-format (WebP/AVIF) image.
 * Without a width param the full-resolution source is shipped — the single
 * largest Lighthouse performance cost on this site (multi-MB heroes served
 * into ~800px boxes). See `srcset()` / `imgix()` below.
 */

const PRISMIC_IMAGE_HOST = 'images.prismic.io';

/** Width breakpoints used to build srcset candidates (device-pixel aware). */
export const DEFAULT_IMAGE_WIDTHS = [480, 768, 1024, 1440, 1920, 2560];

/** True when `url` is a Prismic/imgix asset we can transform with query params. */
export function isPrismicImageUrl(url: string | null | undefined): url is string {
	return typeof url === 'string' && url.includes(PRISMIC_IMAGE_HOST);
}

/**
 * Return `url` with imgix params applied. Always sets `auto=format,compress`.
 * Non-Prismic or malformed URLs are returned unchanged.
 */
export function imgix(
	url: string | null | undefined,
	params: Record<string, string | number> = {}
): string {
	if (!url) return '';
	if (!isPrismicImageUrl(url)) return url;
	try {
		const u = new URL(url);
		u.searchParams.set('auto', 'format,compress');
		for (const [key, value] of Object.entries(params)) {
			u.searchParams.set(key, String(value));
		}
		return u.toString();
	} catch {
		return url;
	}
}

/**
 * Build a width-descriptor srcset for a Prismic image URL.
 * Returns `undefined` for non-Prismic URLs so the attribute can be omitted.
 */
export function srcset(
	url: string | null | undefined,
	widths: number[] = DEFAULT_IMAGE_WIDTHS
): string | undefined {
	if (!isPrismicImageUrl(url)) return undefined;
	return widths.map((w) => `${imgix(url, { w })} ${w}w`).join(', ');
}
