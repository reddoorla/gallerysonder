import "clsx";
import { W as invalid_default_snippet } from "../../../chunks/context.js";
import { s as sanitize_props, b as attr_class, f as attr_style, c as stringify, d as clsx, m as slot, l as bind_props } from "../../../chunks/index2.js";
import { getDefaultProps, getDefaultSlices, getDefaultMessage, SimulatorManager, StateEventType, simulatorClass, simulatorRootClass } from "@prismicio/simulator/kit";
import { f as fallback } from "../../../chunks/utils2.js";
import { h as html } from "../../../chunks/PrismicRichText.js";
import { S as SliceZone, c as components } from "../../../chunks/index3.js";
function SliceSimulator($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    const defaultProps = getDefaultProps();
    let zIndex = fallback($$props["zIndex"], () => defaultProps.zIndex, true);
    let background = fallback($$props["background"], () => defaultProps.background, true);
    let slices = getDefaultSlices();
    let message = getDefaultMessage();
    if (typeof window !== "undefined") {
      const simulatorManager = new SimulatorManager();
      simulatorManager.state.on(
        StateEventType.Slices,
        (newSlices) => {
          slices = newSlices;
        },
        "simulator-slices"
      );
      simulatorManager.state.on(
        StateEventType.Message,
        (newMessage) => {
          message = newMessage;
        },
        "simulator-message"
      );
      simulatorManager.init();
    }
    $$renderer2.push(`<div${attr_class(`${stringify(simulatorClass)} ${stringify($$sanitized_props.class)}`)}${attr_style(`z-index: ${stringify(zIndex)}; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; overflow: auto; background: ${stringify(background)}`)}>`);
    if (message) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<article>${html(message)}</article>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (slices.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div id="root"${attr_class(clsx(simulatorRootClass))}><!--[-->`);
        slot($$renderer2, $$props, "default", { slices });
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { zIndex, background });
  });
}
function _page($$renderer) {
  SliceSimulator($$renderer, {
    children: invalid_default_snippet,
    $$slots: {
      default: ($$renderer2, { slices }) => {
        SliceZone($$renderer2, { slices, components });
      }
    }
  });
}
export {
  _page as default
};
