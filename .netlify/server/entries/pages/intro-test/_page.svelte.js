import { a0 as store_get, U as head, V as attr, W as attr_class, Z as attr_style, X as stringify, a1 as unsubscribe_stores, Y as clsx } from "../../../chunks/index2.js";
import { w as writable } from "../../../chunks/index.js";
import { n as noop } from "../../../chunks/utils2.js";
import "clsx";
import { interpolateString } from "d3-interpolate";
import { S } from "../../../chunks/S.js";
const now = () => Date.now();
const raf = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (_) => noop()
  ),
  now: () => now(),
  tasks: /* @__PURE__ */ new Set()
};
function loop(callback) {
  let task;
  if (raf.tasks.size === 0) ;
  return {
    promise: new Promise((fulfill) => {
      raf.tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      raf.tasks.delete(task);
    }
  };
}
function linear(t) {
  return t;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = (
      /** @type {Array<any>} */
      b.map((bi, i) => {
        return get_interpolator(
          /** @type {Array<any>} */
          a[i],
          bi
        );
      })
    );
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b) {
      throw new Error("Object cannot be null");
    }
    if (is_date(a) && is_date(b)) {
      const an = a.getTime();
      const bn = b.getTime();
      const delta = bn - an;
      return (t) => new Date(an + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = (
      /** @type {number} */
      b - /** @type {number} */
      a
    );
    return (t) => a + t * delta;
  }
  return () => b;
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    target_value = new_value;
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = linear,
      interpolate = get_interpolator
    } = { ...defaults, ...opts };
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = raf.now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start) return true;
      if (!started) {
        fn = interpolate(
          /** @type {any} */
          value,
          new_value
        );
        if (typeof duration === "function")
          duration = duration(
            /** @type {any} */
            value,
            new_value
          );
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(
      /** @type {any} */
      target_value,
      /** @type {any} */
      value
    ), opts),
    subscribe: store.subscribe
  };
}
const O = "data:image/svg+xml,%3csvg%20width='117'%20height='108'%20viewBox='0%200%20117%20108'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame%20233'%3e%3cpath%20id='Vector'%20d='M0.185547%2054C0.185547%2021.017%2022.7367%200%2058.1742%200C93.6117%200%20116.163%2021.017%20116.163%2054C116.163%2086.9829%2093.6117%20108%2058.1742%20108C22.7367%20108%200.185547%2086.9829%200.185547%2054ZM80.8787%2054C80.8787%2039.2727%2071.981%2029.7614%2058.1742%2029.7614C44.3674%2029.7614%2035.4696%2039.2727%2035.4696%2054C35.4696%2068.7273%2044.3674%2078.2386%2058.1742%2078.2386C71.981%2078.2386%2080.8787%2068.7273%2080.8787%2054Z'%20fill='%23D7E7D9'/%3e%3c/g%3e%3c/svg%3e";
const N = "data:image/svg+xml,%3csvg%20width='107'%20height='106'%20viewBox='0%200%20107%20106'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20d='M106.731%200.841309V105.159H75.2823L33.8619%2045.9436V105.159H0.878906V0.841309H39.0778L73.7482%2050.5459V0.841309H106.731Z'%20fill='%23D7E7D9'/%3e%3c/svg%3e";
const D = "data:image/svg+xml,%3csvg%20width='107'%20height='106'%20viewBox='0%200%20107%20106'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20d='M106.206%2053.0004C106.206%2085.3697%2085.4963%20105.159%2051.5929%20105.159H0.814453V0.841309H51.5929C85.4963%200.841309%20106.206%2020.6311%20106.206%2053.0004ZM70.9224%2053.0004C70.9224%2037.8129%2063.0985%2029.989%2047.911%2029.989H35.4849V76.0118H47.911C63.0985%2076.0118%2070.9224%2068.1879%2070.9224%2053.0004Z'%20fill='%23D7E7D9'/%3e%3c/svg%3e";
const E = "data:image/svg+xml,%3csvg%20width='99'%20height='106'%20viewBox='0%200%2099%20106'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20d='M35.5904%2028.4549V41.0345H88.9767V64.9663H35.5904V77.5459H98.9484V105.159H0.919922V0.841309H98.9484V28.4549H35.5904Z'%20fill='%23D7E7D9'/%3e%3c/svg%3e";
const R = "data:image/svg+xml,%3csvg%20width='109'%20height='106'%20viewBox='0%200%20109%20106'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20d='M68.3187%20105.159L46.8415%2071.4095H34.8755V105.159H0.205078V0.841309H62.3358C89.1824%200.841309%20102.989%2012.8072%20102.989%2036.1254C102.989%2051.9265%2096.546%2062.6652%2084.1198%2067.7277L108.052%20105.159H68.3187ZM34.8755%2044.1027H57.1198C64.4835%2044.1027%2067.7051%2041.6481%2067.7051%2036.1254C67.7051%2030.6027%2064.4835%2028.1481%2057.1198%2028.1481H34.8755V44.1027Z'%20fill='%23D7E7D9'/%3e%3c/svg%3e";
const image1 = "/_app/immutable/assets/intro-1.BihV-vKI.jpg";
const image2 = "/_app/immutable/assets/intro-2.T21Ht4kn.jpg";
const image3 = "/_app/immutable/assets/intro-3.Cvsvzdwd.jpg";
const image4 = "/_app/immutable/assets/sonderIntroPiece9.CZzo1Zki.jpg";
const image5 = "/_app/immutable/assets/intro-5.CaehMR1J.jpg";
const image6 = "/_app/immutable/assets/intro-6.C68cK2zO.jpg";
const image7 = "/_app/immutable/assets/intro-7.Bqd6CmRd.jpg";
const image8 = "/_app/immutable/assets/intro-8.BAzdGWr6.jpg";
const image9 = "/_app/immutable/assets/intro-9.ghb2nKT7.jpg";
const image18 = "/_app/immutable/assets/intro-18.oyCMi7HY.jpg";
const image19 = "/_app/immutable/assets/intro-19.gd5vV_lI.jpg";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const TICK_DURATION = 10;
    const IMAGE_ARRAY_WITH_BG_SHIFTS = [
      { image: image1, left: 0, top: 0, scale: 100 },
      { image: image2, left: 0, top: 0 },
      { image: image3, left: 0, top: 0, scale: 100 },
      { image: image19, left: 0, top: 0, scale: 100 },
      { image: image7, left: 0, top: 0, scale: 100 },
      { image: image8, left: 0, top: 0, scale: 100 },
      { image: image9, left: 0, top: 0, scale: 100 },
      { image: image18, left: 0, top: 0, scale: 100 },
      { image: image5, left: 0, top: 0, scale: 100 },
      { image: image6, left: 0, top: 0, scale: 100 },
      { image: image4, left: -8, top: -30, scale: 120 }
    ];
    let innerWidth;
    let currentPathIndex = 0;
    let currentImageIndex = 0;
    let animatedOOffestLeft = 0;
    let NDERwidth = 720;
    let bgPosition = "0px 0px";
    let hideO = false;
    let isVerticalOpenPhase = false;
    let O_paths = [];
    const basePath = ".44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h";
    for (let i = 1; i < 400; i++) {
      O_paths.push("M" + (70 + i * 15) + basePath + (70 + i * 15) + ".95Z");
    }
    let tweenedPath = tweened(O_paths, { duration: TICK_DURATION, easing: linear, interpolate: interpolateString });
    function calculatePathWidth(path) {
      return 0;
    }
    let pathWidth = 48;
    {
      pathWidth = calculatePathWidth(store_get($$store_subs ??= {}, "$tweenedPath", tweenedPath));
      bgPosition = `calc(${-animatedOOffestLeft}px + ${IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].left}vw) calc( ${IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].top}vh)`;
      currentImageIndex = Math.floor(IMAGE_ARRAY_WITH_BG_SHIFTS.length * currentPathIndex / O_paths.length);
      if (Math.floor(IMAGE_ARRAY_WITH_BG_SHIFTS.length * currentPathIndex / O_paths.length) != Math.floor(IMAGE_ARRAY_WITH_BG_SHIFTS.length * (currentPathIndex + 1) / O_paths.length)) {
        hideO = true;
      } else {
        hideO = false;
      }
      if (pathWidth > innerWidth) {
        isVerticalOpenPhase = true;
      }
    }
    head("1w71fm6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Gallery Sonder Intro</title>`);
      });
    });
    $$renderer2.push(`<svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg"><clipPath id="oClipPath"><path${attr("d", store_get($$store_subs ??= {}, "$tweenedPath", tweenedPath))}></path></clipPath></svg> <div class="w-screen h-screen bg-black"><div${attr_class(`h-24 w-[120%] clip-by-logo absolute top-[40vh] bg-subtle-primary ${stringify("opacity-0")}`, "svelte-1w71fm6")}${attr_style(`left: ${stringify(animatedOOffestLeft)}px`)}></div> <div${attr_class(`h-24 scale-y-110 w-[120%] clip-by-logo absolute top-[40vh] transition-opacity ${stringify(hideO ? "opacity-0 duration-1000" : "duration-50")} ${stringify("opacity-0")}`, "svelte-1w71fm6")}${attr_style(`background-image: url(${stringify(IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].image)}); background-size: ${stringify(IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].scale)}vw; background-position: ${stringify(bgPosition)}; left: ${stringify(animatedOOffestLeft)}px`)}></div> <div${attr_class(` absolute w-[120%] bg-black transition-opacity h-full ${stringify(isVerticalOpenPhase ? "max-h-full" : "opacity-0 max-h-24 translate-y-[40vh]")}`)}${attr_style(`background-image: url(${stringify(IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].image)}); background-size: ${stringify(IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].scale)}vw; background-position: ${stringify(bgPosition)}; left: ${stringify(animatedOOffestLeft)}px; transition: max-height 1s ease-out, transform 1s ease-out; `)}></div> <div${attr_class(`h-24 w-[120%] absolute top-[40vh] flex flex-row items-center gap-4 justify-center transition-transform duration-[750ms] ${stringify("scale-50")} ${stringify(isVerticalOpenPhase ? "hidden" : "")}`)}><img${attr("src", S)} alt="s"${attr_style(`margin-left: calc( ${stringify(pathWidth / 2 - NDERwidth)}px - 10%)`)}${attr_class(clsx(""))}/> <img${attr("src", O)} alt="s"${attr_class(`${stringify("")} max-h-screen transition-opacity`)}${attr_style(`width: ${stringify(pathWidth)}px`)}/> <img${attr("src", N)} alt="n"/> <img${attr("src", D)} alt="d"/> <img${attr("src", E)} alt="e"/> <img${attr("src", R)} alt="r"${attr_style(`margin-right:-${stringify(NDERwidth)}px;`)}/></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
