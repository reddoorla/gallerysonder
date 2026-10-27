/** Facebook Pixel queue function injected by the pixel bootstrap snippet. */
type FbqFn = {
	(...args: unknown[]): void;
	callMethod?: (...args: unknown[]) => void;
	push: FbqFn;
	queue: unknown[][];
	loaded: boolean;
	version: string;
};

declare global {
	namespace App {}

	interface Window {
		fbq?: FbqFn;
		_fbq?: FbqFn;
		/** Calls of NewsletterSignup's `checkPosition`; a test hook, see there. */
		__newsletterChecks?: number;
	}
}

export {};
