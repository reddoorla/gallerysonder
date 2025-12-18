import * as server from '../entries/pages/__preview_preview__/news/_uid_/_page.server.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/__preview_preview__/news/_uid_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[[preview=preview]]/news/[uid]/+page.server.js";
export const imports = ["_app/immutable/nodes/6.DdF4HqGX.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/NOZO0C2U.js","_app/immutable/chunks/CtH3rEmS.js","_app/immutable/chunks/6qaIXEnA.js","_app/immutable/chunks/C84w0KwQ.js","_app/immutable/chunks/CcoCqU0B.js","_app/immutable/chunks/BBQt5Ejc.js","_app/immutable/chunks/C9cfyg4u.js","_app/immutable/chunks/DnQt79-e.js","_app/immutable/chunks/CKf3qYLZ.js","_app/immutable/chunks/DJYKlU19.js","_app/immutable/chunks/DIr6X2W9.js","_app/immutable/chunks/CHzgDdPA.js","_app/immutable/chunks/btHO8s2y.js","_app/immutable/chunks/1XEIkcuK.js"];
export const stylesheets = ["_app/immutable/assets/index.esm.wRXGmxSm.css","_app/immutable/assets/index.DHnUc25t.css","_app/immutable/assets/InnerPageNav.BFK45HUA.css","_app/immutable/assets/ScaleTextToContainer.BQ5yspRC.css"];
export const fonts = [];
