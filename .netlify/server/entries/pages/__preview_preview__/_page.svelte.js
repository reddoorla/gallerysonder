import { X as attr_class, _ as bind_props, Y as stringify, W as sanitize_props, a4 as slot, $ as attr_style, V as attr } from "../../../chunks/index2.js";
import { g as getAppState, C as ContentWidth } from "../../../chunks/PrismicRichText.js";
/* empty css                                                                 */
import { S as SliceZone, c as components } from "../../../chunks/index3.js";
import { I as InnerPageNav, F as Footer } from "../../../chunks/InnerPageNav.js";
import { a as ssr_context, e as escape_html } from "../../../chunks/context.js";
import "clsx";
import { f as fallback } from "../../../chunks/utils2.js";
import "@vimeo/player";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function VimeoPlayer_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      videoId,
      autoplay = false,
      muted = true,
      loop = false,
      background = true,
      isPlaying = false,
      onReady = void 0,
      onPlayingChange = void 0
    } = $$props;
    let player;
    onDestroy(() => {
    });
    const play = async () => {
      try {
        await player?.play();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    };
    const pause = async () => {
      try {
        await player?.pause();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    };
    const reload = () => {
    };
    $$renderer2.push(`<div${attr_class(`aspect-video absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${stringify("w-screen min-h-full")} contrast-[1.15] -z-10`)}></div>`);
    bind_props($$props, { isPlaying, play, pause, reload });
  });
}
function ScaleTextToContainer($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div${attr_class(`parent transition-all ${stringify($$sanitized_props.class || "")}`, "svelte-110ckip")} style=""><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div>`);
  });
}
function AnimateIn($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let transitionDelay = 0;
    let style = fallback($$props["style"], "");
    let transitionDelayMax = fallback($$props["transitionDelayMax"], 400);
    let transitionDuration = fallback($$props["transitionDuration"], 2400);
    const checkViewport = () => {
    };
    onDestroy(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", checkViewport);
      }
    });
    $$renderer2.push(`<div${attr_class(`transition ease-fast-slow ${stringify("opacity-0 translate-y-[50%]")}`)}${attr_style(`transition-delay:${stringify(transitionDelay)}ms; transition-duration:${stringify(transitionDuration)}ms; ${stringify(style)}`)}><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { style, transitionDelayMax, transitionDuration });
  });
}
function Intro($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const appState = getAppState();
    const INTRO_DURATION = 6e3;
    let isVideoLoaded = true;
    let isPlaying = true;
    let isVideoDone = true;
    let vimeoPlayer;
    const handleVideoReady = async () => {
      await vimeoPlayer.play();
      isVideoLoaded = true;
      setTimeout(
        async () => {
          await vimeoPlayer.pause();
          isVideoDone = true;
          appState.isIntroRunning = false;
        },
        INTRO_DURATION
      );
    };
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg" class="svelte-10cvnim"><clipPath id="sonderClipPath" class="svelte-10cvnim"><path d="M302.026 13.1236V18.7285H321.051V29.3915H302.026V34.9964H325.493V47.2998H225.973V0.820227H325.493V13.1236H302.026ZM0 41.8316L4.78466 30.8269C9.91108 34.4495 16.4045 36.2951 23.9916 36.2951C29.3231 36.2951 31.7155 35.4065 31.7155 33.4243C31.7155 31.6471 30.4851 31.1686 23.3765 30.4851C7.10864 28.913 2.11892 25.222 2.11892 15.2426C2.11892 5.26312 10.2528 0 24.1967 0C32.4673 0 39.6443 1.91386 45.1125 5.53653L40.3962 16.0628C36.2267 13.2603 31.1686 11.8249 25.4954 11.8249C19.8222 11.8249 17.7032 12.7135 17.7032 14.7641C17.7032 16.5413 18.8652 17.0197 25.9055 17.7032C42.1734 19.2753 47.2998 22.9664 47.2998 32.9458C47.2998 42.9252 39.576 48.12 24.5385 48.12C14.2856 48.12 5.67324 45.9327 0 41.8316ZM52.973 24.06C52.973 9.36426 63.0208 0 78.8102 0C94.5995 0 104.647 9.36426 104.647 24.06C104.647 38.7557 94.5995 48.12 78.8102 48.12C63.0208 48.12 52.973 38.7557 52.973 24.06ZM88.9263 24.06C88.9263 17.4982 84.9619 13.2603 78.8102 13.2603C72.6585 13.2603 68.694 17.4982 68.694 24.06C68.694 30.6218 72.6585 34.8597 78.8102 34.8597C84.9619 34.8597 88.9263 30.6218 88.9263 24.06ZM160.149 0.820227V47.2998H146.137L127.682 20.9158V47.2998H112.986V0.820227H130.006L145.454 22.9664V0.820227H160.149ZM217.839 24.06C217.839 38.4823 208.611 47.2998 193.505 47.2998H170.881V0.820227H193.505C208.611 0.820227 217.839 9.63767 217.839 24.06ZM202.118 24.06C202.118 17.2931 198.632 13.8072 191.865 13.8072H186.328V34.3128H191.865C198.632 34.3128 202.118 30.8269 202.118 24.06ZM364.523 47.2998L354.953 32.2623H349.622V47.2998H334.174V0.820227H361.857C373.819 0.820227 379.97 6.1517 379.97 16.5413C379.97 23.5815 377.099 28.3662 371.563 30.6218L382.226 47.2998H364.523ZM349.622 20.0956H359.533C362.814 20.0956 364.249 19.0019 364.249 16.5413C364.249 14.0806 362.814 12.9869 359.533 12.9869H349.622V20.0956Z" fill="#231F20" class="svelte-10cvnim"></path></clipPath></svg> <div class="w-screen h-screen fixed top-0 left-0 bg-black svelte-10cvnim">`);
      if (!isVideoLoaded) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="w-screen h-screen absolute top-0 left-0 bg-black flex flex-col items-center text-center justify-center gap-10 z-20 svelte-10cvnim"><div class="loading-text svelte-10cvnim">Loading Your</div> <div class="h-12 w-[382px] gradient-logo clip-by-logo svelte-10cvnim"></div> <div class="loading-text svelte-10cvnim">Experience</div></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <div class="w-screen h-screen absolute top-0 left-0 -z-10 transition-opacity svelte-10cvnim">`);
      VimeoPlayer_1($$renderer3, {
        videoId: "1032470650",
        muted: true,
        onReady: handleVideoReady,
        onPlayingChange: (playing) => {
          isPlaying = playing;
        },
        get isPlaying() {
          return isPlaying;
        },
        set isPlaying($$value) {
          isPlaying = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div${attr_class(`bg-black ${stringify(isVideoDone ? "opacity-0" : "")} w-full h-full absolute left-0 -z-20 top-0`, "svelte-10cvnim")}></div> <div${attr_class(`bg-black ${stringify(isVideoDone ? "opacity-20" : "opacity-0")} w-full h-full absolute left-0 top-0 transition-opacity duration-1000`, "svelte-10cvnim")}></div></div> `);
      if (!appState.isIntroRunning && isVideoDone) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="svelte-10cvnim"><!--[-->`);
        slot($$renderer3, $$props, "default", {});
        $$renderer3.push(`<!--]--></div>`);
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
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    getAppState();
    let { data } = $$props;
    let content = data.page.data;
    let slicesSections = data.page.data.slices.map((slice) => slice.primary?.sectionLabel || "");
    let sections = data.page.data.sections.map((section) => section.section || "");
    Intro($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed">`);
        if (content.background_image.url) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<img${attr("src", content.background_image.url)}${attr("alt", content.background_image.alt)} class="absolute bottom-0 left-0 h-full w-full object-cover"/>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div${attr_class(`absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black ${stringify("opacity-20")}`)}></div></div> <div class="fixed w-screen h-screen-75 bottom-0">`);
        ContentWidth($$renderer3, {
          class: "h-full flex flex-col justify-end items-start transition-opacity",
          children: ($$renderer4) => {
            $$renderer4.push(`<span${attr_class(`text-white translate-y-[22%] dates lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow ${stringify("opacity-0")}`, "svelte-10uj5iy")}>${escape_html(content.dates || "")}</span> <h5${attr_class(`text-white translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow ${stringify("opacity-0")}`)}>${escape_html(content.artist || "")}</h5> `);
            ScaleTextToContainer($$renderer4, {
              class: `transition-opacity duration-500 ease-fast-slow ${stringify("opacity-0")}`,
              children: ($$renderer5) => {
                AnimateIn($$renderer5, {
                  children: ($$renderer6) => {
                    $$renderer6.push(`<h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">${escape_html(content.title_line_one || "")}</h1> <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">${escape_html(content.title_line_two || "")}</h1> <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">${escape_html(content.title_line_three || "")}</h1>`);
                  },
                  $$slots: { default: true }
                });
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> <!---->`);
        {
          InnerPageNav($$renderer3, { slicesSections, sections });
        }
        $$renderer3.push(`<!----> <div class="flex flex-col" id="content-container"><div class="h-screen"></div> <div class="h-1"></div> `);
        SliceZone($$renderer3, { slices: data.page.data.slices, components });
        $$renderer3.push(`<!----> `);
        Footer($$renderer3);
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
