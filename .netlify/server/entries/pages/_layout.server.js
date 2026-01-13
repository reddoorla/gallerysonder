import { c as createClient } from "../../chunks/prismicio.js";
const prerender = "auto";
async function load({ params, fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const nav = await client.getSingle("nav");
  return {
    nav
  };
}
export {
  load,
  prerender
};
