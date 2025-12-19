import { g as getContext, e as escape_html } from "./context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
import { W as sanitize_props, X as attr_class, V as attr, Y as stringify, _ as bind_props } from "./index2.js";
import { f as fallback } from "./utils2.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const linkArrow = "data:image/svg+xml,%3csvg%20width='18'%20height='9'%20viewBox='0%200%2018%209'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12.5157%200L17.8957%204.12571L12.575%209L12.5156%205.00045H0V3.6252H12.5156L12.5157%200Z'%20fill='black'/%3e%3c/svg%3e";
function LinkArrowButton($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let text = fallback($$props["text"], "");
    let href = fallback($$props["href"], "");
    let click = fallback($$props["click"], () => {
    });
    let opensNewTab = fallback($$props["opensNewTab"], false);
    if (href) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr_class(`relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit ${stringify($$sanitized_props.class || "")}`)}${attr("target", opensNewTab ? "_blank" : "")}${attr("href", href)}><span class="h-5 uppercase no-underline svelte-rfhjlj">${escape_html(text)}</span> <img${attr("src", linkArrow)} alt="link arrow"${attr_class(`h-5 w-5 ml-[10px] transition-transform duration-300 ${stringify("")}`)}/> <div class="absolute h-[1.5px] bg-black w-5 top-[9px] right-1"></div></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attr_class(`relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit ${stringify($$sanitized_props.class || "")}`)}><span class="h-5 uppercase no-underline svelte-rfhjlj">${escape_html(text)}</span> <img${attr("src", linkArrow)} alt="link arrow"${attr_class(`h-5 w-5 ml-[10px] transition-transform duration-300 ${stringify("")}`)}/> <div class="absolute h-[1.5px] bg-black w-5 top-[9px] right-1"></div></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { text, href, click, opensNewTab });
  });
}
export {
  LinkArrowButton as L,
  page as p
};
