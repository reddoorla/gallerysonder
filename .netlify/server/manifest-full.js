export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png","forms.html","robots.txt","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".html":"text/html",".txt":"text/plain",".webmanifest":"application/manifest+json"},
	_: {
		client: {start:"_app/immutable/entry/start.BEVLLaa3.js",app:"_app/immutable/entry/app.CaPCauSz.js",imports:["_app/immutable/entry/start.BEVLLaa3.js","_app/immutable/chunks/CcoCqU0B.js","_app/immutable/chunks/CtH3rEmS.js","_app/immutable/entry/app.CaPCauSz.js","_app/immutable/chunks/CtH3rEmS.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BBQt5Ejc.js","_app/immutable/chunks/C9cfyg4u.js","_app/immutable/chunks/DJYKlU19.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/api/preview",
				pattern: /^\/api\/preview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/preview/_server.js'))
			},
			{
				id: "/[[preview=preview]]/artists/[uid]",
				pattern: /^(?:\/([^/]+))?\/artists\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/exhibitions/[uid]",
				pattern: /^(?:\/([^/]+))?\/exhibitions\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/intro-test",
				pattern: /^\/intro-test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/news/[uid]",
				pattern: /^(?:\/([^/]+))?\/news\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/rsvp",
				pattern: /^(?:\/([^/]+))?\/rsvp\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/rsvp/[uid]",
				pattern: /^(?:\/([^/]+))?\/rsvp\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/slice-simulator",
				pattern: /^\/slice-simulator\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]",
				pattern: /^(?:\/([^/]+))?\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/[uid]",
				pattern: /^(?:\/([^/]+))?\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			const { match: preview } = await import ('./entries/matchers/preview.js')
			return { preview };
		},
		server_assets: {}
	}
}
})();
