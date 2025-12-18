import * as server from '../entries/pages/_layout.server.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.js";
export const imports = ["_app/immutable/nodes/0.CXLhGI28.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/NOZO0C2U.js","_app/immutable/chunks/CtH3rEmS.js","_app/immutable/chunks/BBQt5Ejc.js","_app/immutable/chunks/C9cfyg4u.js","_app/immutable/chunks/CKf3qYLZ.js","_app/immutable/chunks/DnQt79-e.js","_app/immutable/chunks/6qaIXEnA.js","_app/immutable/chunks/C84w0KwQ.js","_app/immutable/chunks/CcoCqU0B.js","_app/immutable/chunks/TC_1J0Sb.js","_app/immutable/chunks/DQDxcE70.js","_app/immutable/chunks/1XEIkcuK.js"];
export const stylesheets = ["_app/immutable/assets/index.esm.wRXGmxSm.css","_app/immutable/assets/0.-RwFZpiK.css"];
export const fonts = [];
