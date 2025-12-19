import { V as attr } from "../../../../../chunks/index2.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "../../../../../chunks/client.js";
import { g as getAppState, C as ContentWidth, P as PrismicImage, a as PrismicRichText } from "../../../../../chunks/PrismicRichText.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    getAppState();
    let formName = "";
    let formEmail = "";
    let formGuests = "";
    let { data } = $$props;
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
    }
    $$renderer2.push(`<section class="w-screen min-h-lvh h-full flex bg-black text-white relative">`);
    ContentWidth($$renderer2, {
      class: "h-full flex flex-col md:flex-row items-start justify-start py-16 md:py-24 relative w-full",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="w-full md:w-1/2 flex flex-col items-start justify-start"><div class="text-white ml-0.5">${escape_html(data.page.data.dates || "")}</div> <h2 class="text-white">${escape_html(data.page.data.name || toTitleCase(data.page.uid))}</h2> `);
        PrismicImage($$renderer3, {
          field: data.page.data.image,
          class: "w-full md:w-4/5 mt-4 rounded-sm h-full max-h-[50vh] object-cover"
        });
        $$renderer3.push(`<!----> <div class="text-white mt-4 md:mt-12">`);
        PrismicRichText($$renderer3, { field: data.page.data.body_text });
        $$renderer3.push(`<!----></div></div> <div class="w-full md:w-1/2 flex flex-col gap-2 items-start mt-12 md:mt-0">`);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-white">Name</p> <input type="text" name="name"${attr("value", formName)} required placeholder="First and Last Name" class="w-full max-w-md border-1 border-white p-2 mb-4 svelte-1py5bp5"/> <p class="text-white">Email</p> <input type="email" name="email"${attr("value", formEmail)} required placeholder="you@domain.com" class="w-full max-w-md border-1 border-white p-2 mb-4 svelte-1py5bp5"/> <p class="text-white">Number of Guests</p> <input type="number" name="guests"${attr("value", formGuests)} required placeholder="1" min="1" class="w-full max-w-xs border-1 border-white p-2 mb-4 svelte-1py5bp5"/> <button type="submit" class="text-black border-b-2 bg-white hover:bg-gray-200 p-3 font-bold border-black cursor-pointer">Submit RSVP</button> <div class="text-white absolute bottom-0 left-0">By clicking submit you agree to receive emails under the terms of our privacy policy.</div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section>`);
  });
}
export {
  _page as default
};
