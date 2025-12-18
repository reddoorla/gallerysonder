import { k as ensure_array_like, n as spread_props, s as sanitize_props, b as attr_class, a as attr, c as stringify, l as bind_props, e as store_get, u as unsubscribe_stores, f as attr_style, m as slot, d as clsx, g as store_set, j as attributes } from "./index2.js";
import "clsx";
import { C as ContentWidth, a as PrismicRichText, h as html, P as PrismicImage } from "./PrismicRichText.js";
import { f as fallback } from "./utils2.js";
import { b as backgroundColor, L as LinkArrowButton, p as page, h as hasNewsletterBeenCleared, i as isNewsletterActive } from "./lightbox.js";
import { T as escape_html } from "./context.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
import * as prismicHelpers from "@prismicio/helpers";
import { isFilled } from "@prismicio/helpers";
import { isFilled as isFilled$1 } from "@prismicio/client";
import { useSwipe } from "svelte-gestures";
function TodoComponent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { slice } = $$props;
    "slice_type" in slice ? slice.slice_type : slice.type;
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function SliceZone($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      slices = [],
      components: components2 = {},
      context = {},
      defaultComponent = void 0
    } = $$props;
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(slices);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let slice = each_array[index];
      const type = "slice_type" in slice ? slice.slice_type : slice.type;
      const Component = components2[type] || defaultComponent;
      if (Component) {
        $$renderer2.push("<!--[-->");
        if (slice.__mapped) {
          $$renderer2.push("<!--[-->");
          const { __mapped, ...mappedProps } = slice;
          $$renderer2.push(`<!---->`);
          Component($$renderer2, spread_props([mappedProps]));
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!---->`);
          Component($$renderer2, { slice, slices, context, index });
          $$renderer2.push(`<!---->`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        TodoComponent($$renderer2, { slice });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function LinkPlusToggle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let text = fallback($$props["text"], "");
    let href = fallback($$props["href"], "");
    let click = fallback($$props["click"], () => {
    });
    let togglable = fallback($$props["togglable"], true);
    let startsActive = fallback($$props["startsActive"], false);
    if (href) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr_class(`relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit ${stringify($$sanitized_props.class || "")}`)}${attr("href", href)}><span class="h-5 uppercase no-underline svelte-ub3v0a">${escape_html(text)}</span> <i${attr_class(`fa-sharp fa-bold fa-plus fa text-black ml-[10px] transition-transform duration-300 ${stringify("")} ${stringify("")}`)}></i></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attr_class(`relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit ${stringify($$sanitized_props.class || "")}`)}><span class="h-5 uppercase no-underline svelte-ub3v0a">${escape_html(text)}</span> <i${attr_class(`fa-sharp fa-bold fa-plus fa text-black ml-[10px] transition-transform duration-300 ${stringify("")} ${stringify("")}`)}></i></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { text, href, click, togglable, startsActive });
  });
}
function Gallery($$renderer, $$props) {
  sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let slice = $$props["slice"];
    let willBlur = fallback($$props["willBlur"], false);
    let isRegular = fallback($$props["isRegular"], true);
    let isList = fallback($$props["isList"], false);
    let isTruncated = slice.primary.show_more_button;
    let galleryItems = [];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="w-full flex justify-center items-center py-32"><i class="fa-solid fa-spinner-third fa-spin fa-2xl"></i></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (slice.primary.show_more_button && galleryItems.length > 4) {
        $$renderer3.push("<!--[-->");
        LinkPlusToggle($$renderer3, {
          text: isTruncated ? "Show More" : "Show Less",
          click: () => isTruncated = !isTruncated,
          class: "mt-8"
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { slice, willBlur, isRegular, isList });
  });
}
function TopShape($$renderer, $$props) {
  var $$store_subs;
  let shapeNumber = fallback($$props["shapeNumber"], "0");
  if (shapeNumber === "1") {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<svg fill="none" viewBox="0 22.704 1324.5729303547962 416.24" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000 -mb-[120px] sm:-mb-[200px] md:-mb-[300px] lg:-mb-[420px] xl:-mb-[700px] xxl:-mb-[900px]"><path${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu" d="M0 946V0C0 119.057 88.2714 156.271 500.067 193.896C1244.87 264.342 1514.09 428.714 1542 852.622V946H0Z"></path></svg>`);
  } else {
    $$renderer.push("<!--[!-->");
    if (shapeNumber === "2") {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<svg class="use-gpu w-screen transition-all duration-1000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 214" fill="none"><path d="M-70 -27.1159L-69.9999 -542.084L2012 -542.084L2012 98.0816C1816.53 174.725 1543.66 213.916 1195.42 213.916C678.079 213.916 253.735 130.986 -69.8142 -27.1159L-70 -27.1159Z"${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu"></path></svg>`);
    } else {
      $$renderer.push("<!--[!-->");
      if (shapeNumber === "3") {
        $$renderer.push("<!--[-->");
        $$renderer.push(`<svg viewBox="-518 0 1968 206.5289256198347" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000 -mb-[10px] sm:-mb-[50px] md:-mb-[60px] lg:-mb-[120px] xl:-mb-[160px] xxl:-mb-[220px]"><path${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu" d="M1450 143.557V714.277H-518V174.008C-320.779 59.0298 -5.64624 0.277344 422.66 0.277344C821.314 0.277344 1165.05 49.1745 1450 143.557Z"></path></svg>`);
      } else {
        $$renderer.push("<!--[!-->");
        if (shapeNumber === "4") {
          $$renderer.push("<!--[-->");
          $$renderer.push(`<svg class="use-gpu w-screen transition-all duration-1000 -mb-[100px] sm:-mb-[180px] md:-mb-[280px] lg:-mb-[320px] xl:-mb-[500px] xxl:-mb-[640px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 259.4548302872063 1200 250.7388825065274" fill="none"><path${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu" d="M-563 1384V0C-563 174.18 -433.913 228.624 168.292 283.671C1257.49 386.732 1651.18 627.21 1692 1247.39V1384H-563Z"></path></svg>`);
        } else {
          $$renderer.push("<!--[!-->");
          if (shapeNumber === "5") {
            $$renderer.push("<!--[-->");
            $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 245" fill="none" class="w-screen -mb-[60px] md:-mb-[120px] lg:-mb-[200px] xl:-mb[240px] xxl:-mb-[320px]"><path d="M-51 129.383V807H1553V587.649C1553 201.215 1251.96 0 671.343 0C394.19 0 152.646 44.1272 -50.8569 129.383H-51Z"${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu"></path></svg>`);
          } else {
            $$renderer.push("<!--[!-->");
            if (shapeNumber === "6") {
              $$renderer.push("<!--[-->");
              $$renderer.push(`<svg fill="none" viewBox="0 0 1429.8387096774193 196.02" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000 -mb-[30px] md:-mb-[120px] lg:-mb-[200px] xl:-mb[240px] xxl:-mb-[320px]"><path${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} class="transition-all duration-1000 use-gpu" d="M1440 145.592V725.521H0V176.534C144.308 59.7004 374.893 0 688.288 0C979.986 0 1231.5 49.6862 1440 145.592Z"></path></svg>`);
            } else {
              $$renderer.push("<!--[!-->");
            }
            $$renderer.push(`<!--]-->`);
          }
          $$renderer.push(`<!--]-->`);
        }
        $$renderer.push(`<!--]-->`);
      }
      $$renderer.push(`<!--]-->`);
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { shapeNumber });
}
function ImageGallery($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let shapeHeight;
    let slice = $$props["slice"];
    let isTruncated = slice.primary.show_more_button;
    if (slice.primary.shape_top !== "0") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_style(`height:${stringify(shapeHeight)}px;`)}></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section${attr("data-slice-type", slice.slice_type)}${attr("data-slice-variation", slice.variation)}${attr_class(`w-screen use-gpu transition duration-1000 ${stringify(slice.primary.hide ? "hidden" : "")}`)}${attr_style(`background-color: ${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}`)}>`);
    if (slice.primary.shape_top !== "0") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="-translate-y-[98%]">`);
      TopShape($$renderer2, { shapeNumber: slice.primary.shape_top || "" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    ContentWidth($$renderer2, {
      class: "lg:pl-20",
      children: ($$renderer3) => {
        if (slice.primary.gallery_eyebrow) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<h5 class="mb-12 mt-24 uppercase"><b>${escape_html(slice.primary.gallery_eyebrow || "")}</b></h5>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <!---->`);
        {
          Gallery($$renderer3, {
            slice,
            isList: slice.primary.islist,
            isRegular: !slice.primary.is_staggered,
            isTruncated
          });
        }
        $$renderer3.push(`<!----> <div class="font-normal mt-12 sm:w-2/3">`);
        PrismicRichText($$renderer3, { field: slice.primary.gallery_closing_text });
        $$renderer3.push(`<!----></div> `);
        if (slice.primary.button_bottom_text && isFilled.link(slice.primary.button_bottom_link)) {
          $$renderer3.push("<!--[-->");
          LinkArrowButton($$renderer3, {
            text: slice.primary.button_bottom_text,
            href: slice.primary.button_bottom_link.url,
            class: "mt-8",
            opensNewTab: slice.primary.button_bottom_link.link_type === "Media"
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
function NameList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let slice = $$props["slice"];
    let shapeHeight;
    if (slice.primary.shape_top !== "0") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_style(`height:${stringify(shapeHeight)}px;`)}></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section${attr_class(`w-full use-gpu transition-all duration-1000 ${stringify(slice.primary.hide ? "hidden" : "")}`)}${attr("id", slice.primary.sectionLabel)}${attr_style(`background-color:${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))};`)}>`);
    if (slice.primary.shape_top !== "0") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="-translate-y-[99%]">`);
      TopShape($$renderer2, { shapeNumber: slice.primary.shape_top || "0" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    ContentWidth($$renderer2, {
      class: "lg:pl-20 relative flex flex-col gap-8 md:gap-16 mb-16",
      children: ($$renderer3) => {
        if (slice.primary.section_eyebrow) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<h5 class="uppercase">${escape_html(slice.primary.section_eyebrow || "")}</h5>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="w-full flex justify-center items-center py-4"><span>Loading artists...</span></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        if (slice.primary.bottom_button_text) {
          $$renderer3.push("<!--[-->");
          LinkArrowButton($$renderer3, {
            text: slice.primary.bottom_button_text || "",
            href: prismicHelpers.isFilled.link(slice.primary.button_bottom_link) ? slice.primary.button_bottom_link.url : "",
            class: "mt-16",
            opensNewTab: slice.primary.button_bottom_link.link_type === "Media"
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
function QuoteBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let customFontSize;
    let slice = $$props["slice"];
    customFontSize = slice.primary.text_size ? slice.primary.text_size / 2 : 42;
    if (!slice.primary.hide) {
      $$renderer2.push("<!--[-->");
      TopShape($$renderer2, { shapeNumber: slice.primary.shape_top });
      $$renderer2.push(`<!----> <section${attr("data-slice-type", slice.slice_type)}${attr("data-slice-variation", slice.variation)}><div class="w-full py-64">`);
      ContentWidth($$renderer2, {
        class: "md:pl-20 flex flex-col justify-center items-center",
        children: ($$renderer3) => {
          if (prismicHelpers.isFilled.image(slice.primary.signature)) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="text-subtle-primary mb-16 mx-16"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5915 8.41463C9.57247 8.89024 8.15915 10.2073 7.83611 11.8171C9.73397 11.8537 11.1473 13.1707 11.1473 14.8902C11.1473 16.6463 9.69361 18 7.75537 18C5.37294 18 4 16.5 4 13.9024C4 9.95122 6.66508 6.80488 10.7031 6L11.5915 8.41463ZM17.2447 11.8171C19.1425 11.8537 20.5558 13.1707 20.5558 14.8902C20.5558 16.6463 19.1021 18 17.1639 18C14.7815 18 13.4086 16.5 13.4086 13.9024C13.4086 9.95122 16.0737 6.80488 20.1117 6L21 8.41463C18.981 8.89024 17.5677 10.2073 17.2447 11.8171Z"${attr("fill", store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}></path></svg></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> <div class="md:mx-16 quote svelte-1f6ajdt"${attr_style(customFontSize ? `--quote-font-size: ${customFontSize}px;` : "")}>`);
          PrismicRichText($$renderer3, { field: slice.primary.quotation });
          $$renderer3.push(`<!----></div> `);
          if (prismicHelpers.isFilled.image(slice.primary.signature)) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<img${attr("src", slice.primary.signature.url)} alt="quote signature" class="h-8 mt-16"/>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
function Label($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let node = $$props["node"];
    if (node.data.label === "codespan") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<code><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></code>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span${attr_class(clsx(node.data.label))}><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></span>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { node });
  });
}
function RichText($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let slice = $$props["slice"];
    $$renderer2.push(`<section${attr_style(`background-color:${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}`)}${attr_class(`w-screen transition duration-1000 ${stringify(slice.primary.hide ? "hidden" : "")}`)}>`);
    ContentWidth($$renderer2, {
      class: `w-full flex flex-col items-start lg:pl-20 py-${stringify(parseInt(slice.primary.slice_vertical_padding) / 2)} sm:py-${stringify(slice.primary.slice_vertical_padding)}`,
      children: ($$renderer3) => {
        $$renderer3.push(`<div${attr_class(`sm:w-${stringify(slice.primary.desktop_width)} whitespace-pre-line rich-text pr-4 md:pr-0`)}>`);
        PrismicRichText($$renderer3, { field: slice.primary.content, components: { label: Label } });
        $$renderer3.push(`<!----> `);
        if (slice.primary.button_text && isFilled$1.link(slice.primary.button_link)) {
          $$renderer3.push("<!--[-->");
          LinkArrowButton($$renderer3, {
            text: slice.primary.button_text || "explore",
            href: slice.primary.button_link.url,
            opensNewTab: slice.primary.button_link.link_type === "Media",
            class: "mt-8"
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
function SplitRichTextAccordian($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let showFullBody = fallback($$props["showFullBody"], false);
    let maxHeight = fallback($$props["maxHeight"], 400);
    let visibleContent = [];
    let hiddenContent = [];
    $$renderer2.push(`<div class="relative"><div class="absolute invisible" aria-hidden="true"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div> `);
    if (visibleContent) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(visibleContent);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let element = each_array[$$index];
        $$renderer2.push(`${html(element.outerHTML)}`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (showFullBody && hiddenContent) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-4"><!--[-->`);
        const each_array_1 = ensure_array_like(hiddenContent);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let element = each_array_1[$$index_1];
          $$renderer2.push(`${html(element.outerHTML)}`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { showFullBody, maxHeight });
  });
}
function TitleBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let slice = $$props["slice"];
    let showFullBody = false;
    let showContactForm = store_get($$store_subs ??= {}, "$page", page).url.searchParams.has("inquire");
    let formName;
    let formCompany;
    let formPhone;
    let formEmail;
    let formMessage;
    let shapeHeight;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (slice.primary.shape_top !== "0") {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div${attr_style(`height:${stringify(shapeHeight)}px;`)}></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <section${attr("data-slice-type", slice.slice_type)}${attr("data-slice-variation", slice.variation)}${attr_class(`w-full transition duration-1000 md:bg-transparent ${stringify(slice.primary.shape_top === "1" ? "lg:mt-[100vh]" : "")} ${stringify(slice.primary.hide ? "hidden" : "")}`)}${attr_style(`background-color: ${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))} `)}>`);
      if (slice.primary.shape_top !== "0") {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="-translate-y-[99%]">`);
        TopShape($$renderer3, { shapeNumber: slice.primary.shape_top || "0" });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      ContentWidth($$renderer3, {
        class: "h-full flex flex-col items-left pt-8 lg:pl-20 relative",
        children: ($$renderer4) => {
          if (slice.variation === "default") {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<h5><b>${escape_html(slice.primary.eyebrow || "")}</b></h5> `);
            if (slice.primary.title) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<h3 class="mt-3">${escape_html(slice.primary.title || "")}</h3>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (slice.primary.subtitle) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<h6 class="mt-3"><b>${escape_html(slice.primary.subtitle || "")}</b></h6>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (slice.primary.body) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div${attr_class(`xl:w-${stringify(slice.primary.desktop_body_width)} rich-text mt-6`)}>`);
              PrismicRichText($$renderer4, { field: slice.primary.body });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (slice.primary.button_text && isFilled.link(slice.primary.button_link)) {
              $$renderer4.push("<!--[-->");
              LinkArrowButton($$renderer4, {
                text: slice.primary.button_text || "",
                href: slice.primary.button_link.url,
                class: "mt-6"
              });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]-->`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (slice.variation === "twoColumn") {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="w-full flex flex-col md:flex-row"><div class="w-full md:w-1/2 mb-10 md:mb-0"><h6 class="font-light">${escape_html(slice.primary.eyebrow || "")}</h6> `);
              if (slice.primary.title) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<h3 class="mt-6">${escape_html(slice.primary.title || "")}</h3>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (slice.primary.subtitle) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<h6 class="mb-6"><b>${escape_html(slice.primary.subtitle || "")}</b></h6>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (slice.primary.body) {
                $$renderer4.push("<!--[-->");
                if (slice.primary.read_more_button) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="rich-text mb-3 md:pr-16"><!---->`);
                  {
                    SplitRichTextAccordian($$renderer4, {
                      get showFullBody() {
                        return showFullBody;
                      },
                      set showFullBody($$value) {
                        showFullBody = $$value;
                        $$settled = false;
                      },
                      children: ($$renderer5) => {
                        PrismicRichText($$renderer5, { field: slice.primary.body });
                      },
                      $$slots: { default: true }
                    });
                  }
                  $$renderer4.push(`<!----></div> `);
                  LinkPlusToggle($$renderer4, {
                    click: () => showFullBody = !showFullBody,
                    text: showFullBody ? "Show Less" : "Read More"
                  });
                  $$renderer4.push(`<!---->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<div class="rich-text mb-6 md:pr-16">`);
                  PrismicRichText($$renderer4, { field: slice.primary.body });
                  $$renderer4.push(`<!----></div>`);
                }
                $$renderer4.push(`<!--]-->`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (slice.primary.button_text && isFilled.link(slice.primary.button_link)) {
                $$renderer4.push("<!--[-->");
                LinkArrowButton($$renderer4, {
                  text: slice.primary.button_text || "",
                  href: slice.primary.button_link.url,
                  class: "mt-6",
                  opensNewTab: slice.primary.button_link.link_type === "Media"
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div> <div class="w-full md:w-1/2 md:pl-16">`);
              PrismicImage($$renderer4, { field: slice.primary.image });
              $$renderer4.push(`<!----></div></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              if (slice.variation === "connect") {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<h5>${escape_html(slice.primary.eyebrow || "")}</h5> `);
                if (slice.primary.title) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<h2 class="mt-6">${escape_html(slice.primary.title || "")}</h2>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                if (slice.primary.subtitle) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<h6 class="mb-6">${escape_html(slice.primary.subtitle || "")}</h6>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                if (slice.primary.body) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="rich-text mb-8">`);
                  PrismicRichText($$renderer4, { field: slice.primary.body });
                  $$renderer4.push(`<!----></div>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> <div class="flex flex-row gap-6 mb-8">`);
                if (slice.primary.button_text) {
                  $$renderer4.push("<!--[-->");
                  LinkPlusToggle($$renderer4, {
                    startsActive: showContactForm,
                    text: slice.primary.button_text || "Inquire",
                    click: () => {
                      showContactForm = !showContactForm;
                    }
                  });
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                if (slice.primary.button_text) {
                  $$renderer4.push("<!--[-->");
                  LinkPlusToggle($$renderer4, {
                    togglable: false,
                    text: slice.primary.button_two_text || "Newsletter",
                    click: () => {
                      store_set(hasNewsletterBeenCleared, false);
                      store_set(isNewsletterActive, true);
                    }
                  });
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div> `);
                if (showContactForm) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="h-full w-full my-12 md:mt-0 md:w-2/3 flex flex-col gap-2 items-start md:pr-24">`);
                  {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`<p>Name</p> <input type="text" name="name"${attr("value", formName)} required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4 svelte-17aavtn"/> <p>Company Name</p> <input type="text" name="company"${attr("value", formCompany)} placeholder="company name" class="w-full border-1 border-mid p-2 mb-4 svelte-17aavtn"/> <p>Phone</p> <input type="phone" name="phone"${attr("value", formPhone)} required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4 svelte-17aavtn"/> <p>Email</p> <input type="email" name="email"${attr("value", formEmail)} required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4 svelte-17aavtn"/> <p class="hidden"><label>Don’t fill this out if you’re human: <input name="bot-field" class="svelte-17aavtn"/></label></p> <p>Message</p> <textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4 svelte-17aavtn">`);
                    const $$body = escape_html(formMessage);
                    if ($$body) {
                      $$renderer4.push(`${$$body}`);
                    }
                    $$renderer4.push(`</textarea> <button type="submit" class="bump text-primary border-b-2 bg-white hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>`);
                  }
                  $$renderer4.push(`<!--]--></div>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> <div class="flex flex-row gap-6">`);
                if (isFilled.link(slice.primary.instagram)) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<a${attr("href", slice.primary.instagram.url)} aria-label="Visit Gallery Sonder on Instagram"><i class="fa-brands fa-instagram fa-lg"></i></a>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
function ContentWidthMedia($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let slice = $$props["slice"];
    let imageArray = [];
    let tripledImages = [];
    if (slice.variation === "slideshow") {
      imageArray = slice.items;
      imageArray.forEach((item) => tripledImages.push(item.image));
      tripledImages = tripledImages.concat(tripledImages).concat(tripledImages);
    }
    let sliderIndex = 0;
    let isSlideAnimated = true;
    const SLIDER_TRANSITION_LENGTH_IN_MS = 2e3;
    const resetSliderToStart = () => {
      setTimeout(() => isSlideAnimated = false, SLIDER_TRANSITION_LENGTH_IN_MS);
      setTimeout(() => sliderIndex = 0, SLIDER_TRANSITION_LENGTH_IN_MS + 20);
      setTimeout(() => isSlideAnimated = true, SLIDER_TRANSITION_LENGTH_IN_MS + 40);
    };
    const resetSliderToEnd = () => {
      setTimeout(() => isSlideAnimated = false, SLIDER_TRANSITION_LENGTH_IN_MS);
      setTimeout(() => sliderIndex = imageArray.length - 1, SLIDER_TRANSITION_LENGTH_IN_MS + 20);
      setTimeout(() => isSlideAnimated = true, SLIDER_TRANSITION_LENGTH_IN_MS + 40);
    };
    const slideRight = () => {
      sliderIndex--;
      if (sliderIndex < 0) resetSliderToEnd();
      console.log(sliderIndex);
    };
    const slideLeft = () => {
      sliderIndex++;
      if (sliderIndex == imageArray.length) resetSliderToStart();
    };
    function handleSwipe(event) {
      if (event.detail.direction === "left") slideLeft();
      if (event.detail.direction === "right") slideRight();
    }
    $$renderer2.push(`<section${attr_class(`w-full ${stringify(slice.primary.hide ? "hidden" : "")}`)}${attr("data-slice-type", slice.slice_type)}${attr("data-slice-variation", slice.variation)}${attr_style(`background-color: ${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}`)}>`);
    if (slice.primary.shape_top !== "0") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="-translate-y-[99%]">`);
      TopShape($$renderer2, { shapeNumber: slice.primary.shape_top || 0 });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    ContentWidth($$renderer2, {
      class: "lg:pl-20",
      children: ($$renderer3) => {
        if (slice.primary.eyebrow) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<h5 class="mt-8 mb-4 md:mt-16 md:mb-12 uppercase"><b>${escape_html(slice.primary.eyebrow || "")}</b></h5>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (slice.variation === "default" && slice.primary.vimeo_id) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="w-full aspect-video relative mt-16" aria-label="Play video"><img${attr("src", slice.primary.placeholder_image.url)} alt="video thumbnail placeholder" class="w-full h-full object-cover"/> <iframe title="background video"${attr("src", `https://player.vimeo.com/video/${slice.primary.vimeo_id.includes("?h=") ? slice.primary.vimeo_id + "&" : slice.primary.vimeo_id + "?"}background=1&muted=1&loop=1&autoplay=1`)} class="aspect-video absolute w-full h-full z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" frameborder="0" allowfullscreen></iframe></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (slice.variation === "default") {
            $$renderer3.push("<!--[-->");
            PrismicImage($$renderer3, {
              field: slice.primary.placeholder_image,
              class: "w-full aspect-video mt-16"
            });
          } else {
            $$renderer3.push("<!--[!-->");
            if (slice.variation === "image") {
              $$renderer3.push("<!--[-->");
              PrismicImage($$renderer3, { field: slice.primary.image, class: "w-full mt-16" });
            } else {
              $$renderer3.push("<!--[!-->");
              if (slice.variation === "slideshow") {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div${attributes({
                  class: "w-full aspect-square md:aspect-video overflow-hidden relative mt-16",
                  ...useSwipe(handleSwipe, () => ({ touchAction: "pan-y" }))
                })}><div${attr_style(`width: ${stringify(tripledImages.length * 100)}%; transform:translateX(${stringify((-sliderIndex / tripledImages.length - 1 / 3) * 100)}%);`)}${attr_class(`flex flex-row justify-between flex-nowrap h-full overflow-hidden will-change-transform ${stringify(isSlideAnimated ? "transition-transform duration-[2000ms] ease-fast-slow" : "")}`)}><!--[-->`);
                const each_array = ensure_array_like(tripledImages);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let image = each_array[$$index];
                  $$renderer3.push(`<div${attr_style(`width: ${stringify(100 / tripledImages.length)}%;`)} class="h-full relative overflow-hidden will-change-transform">`);
                  PrismicImage($$renderer3, {
                    field: image,
                    class: "min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover will-change-transform"
                  });
                  $$renderer3.push(`<!----></div>`);
                }
                $$renderer3.push(`<!--]--></div> <div class="flex flex-row justify-between items-center absolute bottom-6 left-6 gap-12"><button class="bump" aria-label="Previous image">><i class="fa-sharp fa-regular fa-arrow-left fa-2xl text-white drop-shadow-lg"></i></button> <button class="bump" aria-label="Next image">><i class="fa-sharp fa-regular fa-arrow-right fa-2xl text-white drop-shadow-lg"></i></button></div> <div class="flex flex-row justify-between items-end absolute bottom-6 right-6"><button class="bump" aria-label="View full size"><i class="fa-sharp fa-regular fa-plus fa-2xl text-white"></i></button></div></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (slice.variation === "embed") {
                  $$renderer3.push("<!--[-->");
                  if (isFilled.geoPoint(slice.primary.center_point)) {
                    $$renderer3.push("<!--[-->");
                    $$renderer3.push(`<iframe title="google map" class="w-full aspect-video relative mt-16" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade"${attr("src", `https://www.google.com/maps/embed/v1/place?key=AIzaSyChi9O7_yEWrLrRJSt2DyGO8pM5wl48UbY&q=${slice.primary.center_point.latitude},${slice.primary.center_point.longitude}`)} allowfullscreen></iframe>`);
                  } else {
                    $$renderer3.push("<!--[!-->");
                    $$renderer3.push(`<iframe title="google map" class="w-full aspect-video relative mt-16" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.3897009596562!2d-117.87470001146133!3d33.595191804572465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dce185053be61d%3A0x1a37c375339550c8!2sGallery%20Sonder!5e0!3m2!1sen!2sus!4v1738268047328!5m2!1sen!2sus" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
                  }
                  $$renderer3.push(`<!--]-->`);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { slice });
  });
}
const components = {
  image_gallery: ImageGallery,
  name_list: NameList,
  quote_block: QuoteBlock,
  rich_text: RichText,
  title_block: TitleBlock,
  video_block: ContentWidthMedia
};
export {
  SliceZone as S,
  components as c
};
