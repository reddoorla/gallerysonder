import { V as attr, $ as attr_style, Y as stringify, X as attr_class, a1 as ensure_array_like } from "./index2.js";
import { g as getAppState, C as ContentWidth } from "./PrismicRichText.js";
import { L as LinkArrowButton } from "./LinkArrowButton.js";
import { l as logoExtendedE } from "./SONDER_E.js";
import { e as escape_html } from "./context.js";
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const appState = getAppState();
    $$renderer2.push(`<div aria-hidden="true" class="w-full -z-10 -mt-[40vw] object-cover use-gpu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1081"><path class="transition-all duration-1000" d="M-8.40312e-05 645.743L-2.76537e-05 0.859371L1440 0.859497L1440 1080.86C1294.79 870.352 987.176 769.073 431.897 716.51C212.097 696.382 78.5734 676.511 -8.40312e-05 645.743Z"${attr("fill", appState.backgroundColor)}></path></svg></div> <div class="w-full h-[90vh] sm:h-[40vw] xl:h-[20vw]">`);
    ContentWidth($$renderer2, {
      class: "h-full flex flex-col justify-between md:pt-32",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="sm:pl-20 -mt-[20vw] relative"><h2 class="text-white font-normal mt-32 md:mt-16 sm:w-2/3">Weaving Together the Stories that Define Us</h2> `);
        LinkArrowButton($$renderer3, {
          text: "Subscribe to our newsletter",
          class: "brightness-0 invert ml-0 md:ml-2 mt-4 text-left md:mt-10",
          click: () => {
            appState.hasNewsletterBeenCleared = false;
            appState.isNewsletterActive = true;
          }
        });
        $$renderer3.push(`<!----> <div class="absolute md:left-[3px] top-16 md:top-20 flex md:flex-col justify-center items-center gap-4"><a href="https://www.instagram.com/gallerysonder/" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75" aria-label="Visit Gallery Sonder on Instagram"><i class="fa-brands fa-instagram fa-2xl"></i></a></div></div> <div class="sm:pl-20 md:ml-2 flex flex-col md:flex-row justify-between items-start md:items-end w-full md:mb-12 gap-4 md:gap-8"><div class="gap-3 flex flex-col"><a href="/" class="h-3"><img${attr("src", logoExtendedE)} alt="logo" class="h-full brightness-0 invert"/></a> <div${attr_style(`color:${stringify(appState.backgroundColor)}`)}>3435 E Coast Highway, <br/> Corona del Mar, CA 92625 <br/> (949) 662-0077 <br/> info@gallerysonder.com</div></div> <div class="text-white text-xs md:text-md mb-8 md:mb-0">©${escape_html((/* @__PURE__ */ new Date()).getFullYear())}   |   All Rights Reserved</div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
function InnerPageNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    getAppState();
    let { sections = [], slicesSections } = $$props;
    sections.map((section) => section);
    slicesSections.map((section) => section);
    let activeSection = "";
    $$renderer2.push(`<div class="fixed w-screen h-screen z-10 pointer-events-none">`);
    ContentWidth($$renderer2, {
      class: "h-full relative pointer-events-none flex flex-row items-center justify-center",
      children: ($$renderer3) => {
        $$renderer3.push(`<div${attr_class(`absolute top-2 lg:top-1/2 lg:-translate-y-4 lg:left-[7px] lg:-translate-x-1/2 lg:rotate-90 flex flex-row gap-4 transition ${stringify("pointer-events-none opacity-0")}`)}><!--[-->`);
        const each_array = ensure_array_like(sections);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let section = each_array[i];
          {
            $$renderer3.push("<!--[!-->");
            if (section === activeSection) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<a${attr_class(`floating-links active no-underline uppercase transition-opacity fixed h-24 mx-auto top-6 -translate-x-1/2 ${stringify("opacity-0 pointer-events-none")}`, "svelte-1vfyews")}${attr("href", `#${stringify(section)}`)}>${escape_html(section)}</a>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  Footer as F,
  InnerPageNav as I
};
