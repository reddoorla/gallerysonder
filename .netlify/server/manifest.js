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
		client: {start:"_app/immutable/entry/start.CJ7HPGk4.js",app:"_app/immutable/entry/app.hVdjLWLF.js",imports:["_app/immutable/entry/start.CJ7HPGk4.js","_app/immutable/chunks/CKza6y4e.js","_app/immutable/chunks/CO9sfcJX.js","_app/immutable/entry/app.hVdjLWLF.js","_app/immutable/chunks/CO9sfcJX.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DVair6XY.js","_app/immutable/chunks/JzFz2FpW.js","_app/immutable/chunks/n_9o9Bd3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js'))
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
				id: "/[[preview=preview]]/essays/[uid]",
				pattern: /^(?:\/([^/]+))?\/essays\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/exhibitions/[uid]",
				pattern: /^(?:\/([^/]+))?\/exhibitions\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/intro-test",
				pattern: /^\/intro-test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/news/[uid]",
				pattern: /^(?:\/([^/]+))?\/news\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/rsvp",
				pattern: /^(?:\/([^/]+))?\/rsvp\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/[[preview=preview]]/rsvp/[uid]",
				pattern: /^(?:\/([^/]+))?\/rsvp\/([^/]+?)\/?$/,
				params: [{"name":"preview","matcher":"preview","optional":true,"rest":false,"chained":true},{"name":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/slice-simulator",
				pattern: /^\/slice-simulator\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
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
		prerendered_routes: new Set(["/intro-test","/intro-test/__data.json","/rsvp","/rsvp/__data.json","/slice-simulator","/slice-simulator/__data.json","/__data.json","/artists/noosha-golab","/artists/noosha-golab/__data.json","/artists/jae-ford","/artists/jae-ford/__data.json","/artists/pilar-wiley","/artists/pilar-wiley/__data.json","/artists/gary-lang","/artists/gary-lang/__data.json","/artists/susan-maddux","/artists/susan-maddux/__data.json","/artists/sheng-lor","/artists/sheng-lor/__data.json","/artists/herbst-hogman/__data.json","/artists/david-spriggs/__data.json","/artists/alex-sutcliffe/__data.json","/artists/lachlan-turczan/__data.json","/artists/lydia-baker/__data.json","/artists/ruben-benjamin/__data.json","/artists/kathryn-macnaughton/__data.json","/artists/alex-cutler/__data.json","/artists/kevin-yaun/__data.json","/artists/willie-wayne-smith/__data.json","/artists/jacqueline-surdell/__data.json","/artists/dylan-gebbia-richards/__data.json","/artists/helen-beard/__data.json","/artists/thrush-holmes/__data.json","/artists/theo-hirschfield/__data.json","/artists/anthony-james/__data.json","/artists/borja-colom/__data.json","/essays/test/__data.json","/exhibitions/the-thing-in-itself/__data.json","/exhibitions/some-still-wonder/__data.json","/exhibitions/threshold-of-the-infinite/__data.json","/exhibitions/you-and-me/__data.json","/exhibitions/silent-doors/__data.json","/exhibitions/lensing-water/__data.json","/exhibitions/symbiosis/__data.json","/exhibitions/in-the-hollow/__data.json","/exhibitions/prologue/__data.json","/news/test-one","/news/test-one/__data.json","/rsvp/the-thing-in-itself","/rsvp/the-thing-in-itself/__data.json","/home-the-thing-in-itself/__data.json","/exhibitions/__data.json","/artists","/artists/__data.json","/cms-demo/__data.json","/about/__data.json","/vimeo-demo/__data.json","/news/__data.json","/contact/__data.json","/test/__data.json"]),
		matchers: async () => {
			const { match: preview } = await import ('./entries/matchers/preview.js')
			return { preview };
		},
		server_assets: {}
	}
}
})();
