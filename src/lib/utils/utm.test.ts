import { describe, expect, it } from 'vitest';
import { landingUtm, NO_UTM, UTM_STORAGE_KEY } from './utm';

/** A Storage stand-in: a Map, optionally refusing every call the way a
 *  browser with blocked site data does. */
function memoryStorage(refuse = false) {
	const map = new Map<string, string>();
	return {
		map,
		getItem(key: string) {
			if (refuse) throw new Error('SecurityError');
			return map.get(key) ?? null;
		},
		setItem(key: string, value: string) {
			if (refuse) throw new Error('SecurityError');
			map.set(key, value);
		}
	};
}

const q = (s: string) => new URLSearchParams(s);

describe('landingUtm', () => {
	it('takes the landing URL tags and keeps them for the visit', () => {
		const storage = memoryStorage();
		expect(landingUtm(q('utm_source=ig&utm_campaign=fall'), storage)).toEqual({
			...NO_UTM,
			source: 'ig',
			campaign: 'fall'
		});
		// A later full page load with no tags in its URL: the landing tags survive.
		expect(landingUtm(q(''), storage)).toEqual({ ...NO_UTM, source: 'ig', campaign: 'fall' });
	});

	it('a newer tagged link in the same visit replaces the stored tags', () => {
		const storage = memoryStorage();
		landingUtm(q('utm_source=ig'), storage);
		expect(landingUtm(q('utm_source=email&utm_medium=newsletter'), storage)).toEqual({
			...NO_UTM,
			source: 'email',
			medium: 'newsletter'
		});
		expect(landingUtm(q(''), storage).source).toBe('email');
	});

	it('a visit with no tags anywhere sends none', () => {
		expect(landingUtm(q('page=2'), memoryStorage())).toEqual(NO_UTM);
		expect(landingUtm(q('utm_source='), memoryStorage())).toEqual(NO_UTM);
	});

	it('never throws: refused storage still uses the URL, and no storage at all is fine', () => {
		expect(landingUtm(q('utm_source=ig'), memoryStorage(true)).source).toBe('ig');
		expect(landingUtm(q(''), memoryStorage(true))).toEqual(NO_UTM);
		expect(landingUtm(q('utm_source=ig'), null).source).toBe('ig');
	});

	it('ignores a corrupt stored value', () => {
		const storage = memoryStorage();
		storage.map.set(UTM_STORAGE_KEY, '{not json');
		expect(landingUtm(q(''), storage)).toEqual(NO_UTM);
		storage.map.set(UTM_STORAGE_KEY, JSON.stringify(['ig']));
		expect(landingUtm(q(''), storage)).toEqual(NO_UTM);
	});
});
