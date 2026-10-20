import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SIMULATOR_MARKERS = ['slice-simulator--root', 'sliceSimulatorAccessedDirectly'];
const SIMULATOR_FRAME_ANCESTORS =
	"frame-ancestors 'self' http://localhost:* https://*.prismic.io https://prismic.io";
const CMS_FRAMED_ROUTE = '/slice-simulator';

const client = '.svelte-kit/output/client';
const manifestPath = join(client, '.vite/manifest.json');
const appPath = '.svelte-kit/generated/build/client-optimized/app.js';
const built = existsSync(manifestPath) && existsSync(appPath);

type Chunk = { file: string; imports?: string[]; isEntry?: boolean };

test.describe('the built client', () => {
	test.skip(!built && !process.env.CI, 'no production build to inspect');

	const read = () => {
		expect(built, 'CI must build before the smoke suite').toBe(true);
		const manifest: Record<string, Chunk> = JSON.parse(readFileSync(manifestPath, 'utf8'));
		const node = readFileSync(appPath, 'utf8').match(/"\/slice-simulator":\s*\[~?(\d+)/)?.[1];
		expect(node, 'no client node for /slice-simulator').toBeDefined();
		const entries = Object.keys(manifest).filter((key) => manifest[key].isEntry);
		const closure = (key: string, seen = new Set<string>()): Set<string> => {
			if (seen.has(key)) return seen;
			seen.add(key);
			for (const next of manifest[key]?.imports ?? []) closure(next, seen);
			return seen;
		};
		const simulatorFiles = (entry: string) =>
			[...closure(entry)]
				.map((key) => manifest[key].file)
				.filter((file) => {
					const source = readFileSync(join(client, file), 'utf8');
					return SIMULATOR_MARKERS.some((marker) => source.includes(marker));
				});
		const isSimulatorNode = (key: string) => key.endsWith(`/nodes/${node}.js`);
		return { entries, simulatorFiles, isSimulatorNode };
	};

	test('loads the slice simulator on /slice-simulator', () => {
		const { entries, simulatorFiles, isSimulatorNode } = read();
		const node = entries.find(isSimulatorNode);
		expect(node).toBeDefined();
		expect(simulatorFiles(node!).length).toBeGreaterThan(0);
	});

	test("keeps it out of every other entry's static imports", () => {
		const { entries, simulatorFiles, isSimulatorNode } = read();
		const others = entries.filter((key) => !isSimulatorNode(key));
		expect(others.length).toBeGreaterThan(2);
		for (const key of others) expect(simulatorFiles(key), key).toEqual([]);
	});
});

test('the framed route id names a route that exists', () => {
	const dir = join('src/routes', ...CMS_FRAMED_ROUTE.split('/').filter(Boolean));
	expect(readdirSync(dir).some((file) => file.startsWith('+page.'))).toBe(true);
});

for (const path of ['/slice-simulator', '/slice%2Dsimulator', '/slice%2dsimulator']) {
	test(`${path} gets the simulator's framing`, async ({ request }) => {
		const response = await request.get(path, { maxRedirects: 0 });
		expect(response.status()).toBe(200);
		expect(response.headers()['x-frame-options']).toBeUndefined();
		const policy = response.headers()['content-security-policy'] ?? '';
		expect(policy.match(/frame-ancestors[^;]*/)?.[0]).toBe(SIMULATOR_FRAME_ANCESTORS);
	});
}

// The Type Builder frames /slice-simulator from an https://*.prismic.io page
// and sends it slices through @prismicio/simulator's channel. Outside
// development the simulator ignores the handshake from any other origin, so
// the host page is served at a prismic.io URL that Playwright answers itself.
// The handshake mirrors the library's ChannelEmitter: the frame posts `ready`,
// the host answers with `connect` and a MessagePort, acknowledges `ready`, then
// sends `setSliceZone` over the port.
const HOST = 'https://simulator-smoke.prismic.io/';
const QUOTE = 'Simulator smoke quotation';
const SLICE = {
	id: 'quote_block$smoke',
	slice_type: 'quote_block',
	slice_label: null,
	variation: 'default',
	version: 'initial',
	primary: {
		quotation: [{ type: 'paragraph', text: QUOTE, spans: [] }],
		signature: {},
		sectionLabel: null,
		shape_top: '0',
		hide: false,
		text_size: null
	},
	items: []
};

test('/slice-simulator renders a slice the Type Builder sends it', async ({ page, baseURL }) => {
	await page.route(HOST, (route) =>
		route.fulfill({
			contentType: 'text/html',
			body: `<!doctype html><iframe src="${baseURL}/slice-simulator" width="1280" height="800"></iframe>
<script>
  const frame = document.querySelector("iframe");
  const ok = (requestID) => ({ requestID, status: 200, msg: "ok", data: undefined });
  addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow || event.data?.type !== "ready") return;
    const ready = event.data.requestID;
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      if (data.requestID === "emitter-connect") {
        frame.contentWindow.postMessage(ok(ready), "*");
        channel.port1.postMessage({ requestID: "client-slices", type: "setSliceZone", data: [${JSON.stringify(SLICE)}] });
      } else if (data.requestID === "client-slices") {
        window.setSliceZoneStatus = data.status;
      } else if (data.type) {
        channel.port1.postMessage(ok(data.requestID));
      }
    };
    frame.contentWindow.postMessage({ requestID: "emitter-connect", type: "connect", data: {} }, "*", [channel.port2]);
  });
</script>`
		})
	);
	// Chrome's Local Network Access check blocks a public origin from framing
	// localhost unless the browser has granted that origin the permission.
	await page.context().grantPermissions(['local-network-access'], { origin: new URL(HOST).origin });
	await page.goto(HOST);
	await expect
		.poll(() => page.evaluate(() => (window as { setSliceZoneStatus?: number }).setSliceZoneStatus))
		.toBe(200);
	const slice = page
		.frameLocator('iframe')
		.locator('.slice-simulator--root [data-slice-type="quote_block"]');
	await expect(slice).toContainText(QUOTE);
});

test("an ordinary page does not get the simulator's framing", async ({ request }) => {
	const response = await request.get('/');
	expect(response.status()).toBe(200);
	const policy = response.headers()['content-security-policy'] ?? '';
	expect(policy.match(/frame-ancestors[^;]*/)?.[0] ?? '').not.toBe(SIMULATOR_FRAME_ANCESTORS);
});
