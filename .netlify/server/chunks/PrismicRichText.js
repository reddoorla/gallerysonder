import { s as sanitize_props, b as attr_class, c as stringify, m as slot, a as attr, j as attributes, d as clsx, k as ensure_array_like } from "./index2.js";
import "clsx";
import { asTree } from "@prismicio/client/richtext";
import { isFilled, asImagePixelDensitySrcSet, asImageWidthSrcSet, asLinkAttrs } from "@prismicio/client";
import { T as escape_html } from "./context.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function ContentWidth($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div${attr_class(`max-w-[1220px] xxl:max-w-[1640px] xl:mx-auto mx-[4%] ${stringify($$sanitized_props.class || "flex flex-col items-center justify-center my-16 relative")}`)}><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div>`);
  });
}
function PrismicEmbed($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { field } = $$props;
    if (isFilled.embed(field)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr("data-oembed", field.embed_url)}${attr("data-oembed-type", field.type)}${attr("data-oembed-provider", field.provider_name)}>${html(field.html)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function PrismicImage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      field,
      imgixParams = {},
      alt,
      fallbackAlt,
      width,
      height,
      widths,
      pixelDensities,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const { resolvedWidth, resolvedHeight } = (() => {
      if (!isFilled.imageThumbnail(field)) return { resolvedWidth: void 0, resolvedHeight: void 0 };
      const ar = field.dimensions.width / field.dimensions.height;
      let resolvedWidth2 = castInt(width) ?? field.dimensions.width;
      let resolvedHeight2 = castInt(height) ?? field.dimensions.height;
      if (resolvedWidth2 != null && resolvedHeight2 == null) {
        resolvedHeight2 = resolvedWidth2 / ar;
      } else if (resolvedWidth2 == null && resolvedHeight2 != null) {
        resolvedWidth2 = resolvedHeight2 * ar;
      }
      return { resolvedWidth: resolvedWidth2, resolvedHeight: resolvedHeight2 };
    })();
    const { src, srcset } = (() => {
      if (!isFilled.imageThumbnail(field)) return { src: void 0, srcset: void 0 };
      if (pixelDensities) {
        return asImagePixelDensitySrcSet(field, {
          ...imgixParams,
          pixelDensities: pixelDensities === "defaults" ? void 0 : pixelDensities
        });
      }
      return asImageWidthSrcSet(field, {
        ...imgixParams,
        widths: widths === "defaults" ? void 0 : widths
      });
    })();
    function castInt(input) {
      if (typeof input === "number" || typeof input === "undefined" || input === null) {
        return input;
      } else {
        const parsed = Number.parseInt(input);
        if (Number.isNaN(parsed)) {
          return void 0;
        } else {
          return parsed;
        }
      }
    }
    if (isFilled.imageThumbnail(field)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attributes({
        src,
        srcset,
        alt: alt ?? (field.alt || fallbackAlt),
        width: resolvedWidth,
        height: resolvedHeight,
        ...restProps
      })} onload="this.__e=event" onerror="this.__e=event"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function PrismicLink($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      field,
      document,
      rel,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const linkAttrs = asLinkAttrs(field ?? document, { rel: typeof rel === "function" ? rel : void 0 });
    const href = ("href" in restProps ? restProps.href : linkAttrs.href) || "";
    const resolvedRel = typeof rel === "string" ? rel : linkAttrs.rel;
    $$renderer2.push(`<a${attributes({ ...linkAttrs, rel: resolvedRel, href, ...restProps })}>`);
    if (children) {
      $$renderer2.push("<!--[-->");
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`${escape_html(field?.text)}`);
    }
    $$renderer2.push(`<!--]--></a>`);
  });
}
function DefaultComponent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { node, children } = $$props;
    const dirProp = "direction" in node && node.direction === "rtl" ? { direction: "rtl" } : {};
    if (node.type === "heading1") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<h1${attributes({ ...dirProp })}>`);
      children($$renderer2);
      $$renderer2.push(`<!----></h1>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (node.type === "heading2") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2${attributes({ ...dirProp })}>`);
        children($$renderer2);
        $$renderer2.push(`<!----></h2>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (node.type === "heading3") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<h3${attributes({ ...dirProp })}>`);
          children($$renderer2);
          $$renderer2.push(`<!----></h3>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (node.type === "heading4") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<h4${attributes({ ...dirProp })}>`);
            children($$renderer2);
            $$renderer2.push(`<!----></h4>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (node.type === "heading5") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<h5${attributes({ ...dirProp })}>`);
              children($$renderer2);
              $$renderer2.push(`<!----></h5>`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (node.type === "heading6") {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<h6${attributes({ ...dirProp })}>`);
                children($$renderer2);
                $$renderer2.push(`<!----></h6>`);
              } else {
                $$renderer2.push("<!--[!-->");
                if (node.type === "paragraph") {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<p${attributes({ ...dirProp })}>`);
                  children($$renderer2);
                  $$renderer2.push(`<!----></p>`);
                } else {
                  $$renderer2.push("<!--[!-->");
                  if (node.type === "preformatted") {
                    $$renderer2.push("<!--[-->");
                    $$renderer2.push(`<pre>`);
                    children($$renderer2);
                    $$renderer2.push(`<!----></pre>`);
                  } else {
                    $$renderer2.push("<!--[!-->");
                    if (node.type === "strong") {
                      $$renderer2.push("<!--[-->");
                      $$renderer2.push(`<strong>`);
                      children($$renderer2);
                      $$renderer2.push(`<!----></strong>`);
                    } else {
                      $$renderer2.push("<!--[!-->");
                      if (node.type === "em") {
                        $$renderer2.push("<!--[-->");
                        $$renderer2.push(`<em>`);
                        children($$renderer2);
                        $$renderer2.push(`<!----></em>`);
                      } else {
                        $$renderer2.push("<!--[!-->");
                        if (node.type === "list-item") {
                          $$renderer2.push("<!--[-->");
                          $$renderer2.push(`<li${attributes({ ...dirProp })}>`);
                          children($$renderer2);
                          $$renderer2.push(`<!----></li>`);
                        } else {
                          $$renderer2.push("<!--[!-->");
                          if (node.type === "o-list-item") {
                            $$renderer2.push("<!--[-->");
                            $$renderer2.push(`<li${attributes({ ...dirProp })}>`);
                            children($$renderer2);
                            $$renderer2.push(`<!----></li>`);
                          } else {
                            $$renderer2.push("<!--[!-->");
                            if (node.type === "group-list-item") {
                              $$renderer2.push("<!--[-->");
                              $$renderer2.push(`<ul>`);
                              children($$renderer2);
                              $$renderer2.push(`<!----></ul>`);
                            } else {
                              $$renderer2.push("<!--[!-->");
                              if (node.type === "group-o-list-item") {
                                $$renderer2.push("<!--[-->");
                                $$renderer2.push(`<ol>`);
                                children($$renderer2);
                                $$renderer2.push(`<!----></ol>`);
                              } else {
                                $$renderer2.push("<!--[!-->");
                                if (node.type === "image") {
                                  $$renderer2.push("<!--[-->");
                                  $$renderer2.push(`<p class="block-img">`);
                                  PrismicImage($$renderer2, { field: node });
                                  $$renderer2.push(`<!----></p>`);
                                } else {
                                  $$renderer2.push("<!--[!-->");
                                  if (node.type === "embed") {
                                    $$renderer2.push("<!--[-->");
                                    PrismicEmbed($$renderer2, { field: node.oembed });
                                  } else {
                                    $$renderer2.push("<!--[!-->");
                                    if (node.type === "hyperlink") {
                                      $$renderer2.push("<!--[-->");
                                      PrismicLink($$renderer2, {
                                        field: node.data,
                                        children: ($$renderer3) => {
                                          children($$renderer3);
                                          $$renderer3.push(`<!---->`);
                                        },
                                        $$slots: { default: true }
                                      });
                                    } else {
                                      $$renderer2.push("<!--[!-->");
                                      if (node.type === "label") {
                                        $$renderer2.push("<!--[-->");
                                        $$renderer2.push(`<span${attr_class(clsx(node.data.label))}>`);
                                        children($$renderer2);
                                        $$renderer2.push(`<!----></span>`);
                                      } else {
                                        $$renderer2.push("<!--[!-->");
                                        $$renderer2.push(`<!--[-->`);
                                        const each_array = ensure_array_like(node.text.split("\n"));
                                        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
                                          let line = each_array[index];
                                          if (index > 0) {
                                            $$renderer2.push("<!--[-->");
                                            $$renderer2.push(`<br/>`);
                                          } else {
                                            $$renderer2.push("<!--[!-->");
                                          }
                                          $$renderer2.push(`<!--]-->${escape_html(line)}`);
                                        }
                                        $$renderer2.push(`<!--]-->`);
                                      }
                                      $$renderer2.push(`<!--]-->`);
                                    }
                                    $$renderer2.push(`<!--]-->`);
                                  }
                                  $$renderer2.push(`<!--]-->`);
                                }
                                $$renderer2.push(`<!--]-->`);
                              }
                              $$renderer2.push(`<!--]-->`);
                            }
                            $$renderer2.push(`<!--]-->`);
                          }
                          $$renderer2.push(`<!--]-->`);
                        }
                        $$renderer2.push(`<!--]-->`);
                      }
                      $$renderer2.push(`<!--]-->`);
                    }
                    $$renderer2.push(`<!--]-->`);
                  }
                  $$renderer2.push(`<!--]-->`);
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Serialize_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { components, children } = $$props;
    const CHILD_TYPE_RENAMES = {
      "list-item": "listItem",
      "o-list-item": "oListItem",
      "group-list-item": "list",
      "group-o-list-item": "oList"
    };
    function getComponent(child) {
      return components[CHILD_TYPE_RENAMES[child.type] || child.type] || DefaultComponent;
    }
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(children);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let child = each_array[$$index];
      const Component = getComponent(child);
      $$renderer2.push(`<!---->`);
      Component($$renderer2, {
        node: child.node,
        children: ($$renderer3) => {
          if (child.children.length > 0) {
            $$renderer3.push("<!--[-->");
            Serialize_1($$renderer3, { children: child.children, components });
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function PrismicRichText($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { field, components = {} } = $$props;
    const children = asTree(field).children;
    Serialize_1($$renderer2, { children, components });
  });
}
export {
  ContentWidth as C,
  PrismicImage as P,
  PrismicRichText as a,
  html as h
};
