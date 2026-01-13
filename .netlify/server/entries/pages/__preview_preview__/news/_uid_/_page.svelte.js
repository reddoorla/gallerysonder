import { V as attr, W as attr_class, X as stringify } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { g as getAppState, C as ContentWidth } from "../../../../../chunks/PrismicRichText.js";
import "../../../../../chunks/LinkArrowButton.js";
/* empty css                                                                       */
import { S as SliceZone, c as components } from "../../../../../chunks/index3.js";
import { I as InnerPageNav, F as Footer } from "../../../../../chunks/InnerPageNav.js";
import { e as escape_html } from "../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    getAppState();
    let { data } = $$props;
    let content = data.page.data;
    let slicesSections = [];
    data.page.data.slices.forEach((slice) => slicesSections.push(slice.primary?.sectionLabel || ""));
    let sections = [];
    data.page.data.sections.forEach((section) => sections.push(section.section || ""));
    $$renderer2.push(`<div class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed -z-10"><img${attr("src", content.background_image.url)}${attr("alt", content.background_image.alt)} class="absolute bottom-0 left-0 h-full w-full object-cover -z-10"/> <div${attr_class(`absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black ${stringify("opacity-20")}`)}></div></div> <div class="fixed w-screen h-screen-75 bottom-0">`);
    ContentWidth($$renderer2, {
      class: `h-full flex flex-col justify-end items-start transition-opacity ${stringify("opacity-0")}`,
      children: ($$renderer3) => {
        $$renderer3.push(`<h1 class="mb-0 pb-0 md:translate-y-[22%] lg:translate-y-[18%] w-fit text-white">${escape_html(content.title_line_one || "")}</h1> <h1 class="mb-0 pb-0 md:translate-y-[22%] lg:translate-y-[18%] w-fit text-white md:text-nowrap">${escape_html(content.title_line_two || "")}</h1> <h1 class="mb-0 pb-0 md:translate-y-[22%] lg:translate-y-[18%] w-fit text-white">${escape_html(content.title_line_three || "")}</h1>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <!---->`);
    {
      InnerPageNav($$renderer2, { slicesSections, sections });
    }
    $$renderer2.push(`<!----> <div class="flex flex-col" id="content-container"><div class="h-screen"></div> <div class="h-1"></div> `);
    SliceZone($$renderer2, { slices: data.page.data.slices, components });
    $$renderer2.push(`<!----> `);
    Footer($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
