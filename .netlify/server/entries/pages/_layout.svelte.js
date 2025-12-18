import { h as head, a as attr, s as sanitize_props, b as attr_class, c as stringify, d as clsx, e as store_get, f as attr_style, u as unsubscribe_stores, g as store_set, j as attributes, k as ensure_array_like, l as bind_props, m as slot } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { getToolbarSrc, isFilled as isFilled$1 } from "@prismicio/client";
import { i as isNewsletterActive, b as backgroundColor, L as LinkArrowButton, h as hasNewsletterBeenCleared, a as activeArtwork, s as showInquiryForm, c as activeArtist, l as lightboxImageUrl, p as page, d as isLightboxActive } from "../../chunks/lightbox.js";
import { r as repositoryName } from "../../chunks/prismicio.js";
import "@vimeo/player";
import { i as isIntroRunning } from "../../chunks/intro.js";
import { C as ContentWidth, P as PrismicImage, a as PrismicRichText } from "../../chunks/PrismicRichText.js";
import { S } from "../../chunks/S.js";
import { l as logoExtendedE } from "../../chunks/SONDER_E.js";
import { useSwipe } from "svelte-gestures";
import { isFilled } from "@prismicio/helpers";
import { T as escape_html } from "../../chunks/context.js";
import { w as writable } from "../../chunks/index.js";
function PrismicPreview($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      repositoryName: repositoryName2
    } = $$props;
    const toolbarSrc = getToolbarSrc(repositoryName2);
    head("9url44", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<script defer${attr("src", toolbarSrc)}><\/script><!---->`);
    });
  });
}
const SonderLogoActive = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20data-name='Layer%201'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20168%2021.12'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23231f20;%20stroke-width:%200px;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='cls-1'%20d='m34.59,21.12c-6.93,0-11.34-4.11-11.34-10.56S27.66,0,34.59,0h24.85C66.37,0,70.78,4.11,70.78,10.56s-4.41,10.56-11.34,10.56m-48.67,0c6.6,0,9.99-2.25,9.99-6.66s-2.25-6-9.39-6.69c-3.09-.3-3.6-.51-3.6-1.29,0-.9,1.05-1.29,3.42-1.29,2.49,0,4.71.63,6.54,1.86l2.07-4.62C17.4.84,14.25,0,10.62,0,4.5,0,.93,2.49.93,6.69s2.19,6,9.33,6.69c3.12.3,3.66.51,3.66,1.29,0,.87-1.05,1.26-3.39,1.26-3.33,0-6.18-.81-8.43-2.4l-2.1,4.83c2.49,1.8,6.27,2.76,10.77,2.76ZM88.35.36v9.72L81.57.36h-7.47v20.4h6.45v-11.58l8.1,11.58h6.15V.36h-6.45Zm21.09,0h-9.93v20.4h9.93c6.63,0,10.68-3.87,10.68-10.2S116.07.36,109.44.36Zm-.72,14.7h-2.43V6.06h2.43c2.97,0,4.5,1.53,4.5,4.5s-1.53,4.5-4.5,4.5Zm34.23-9.3V.36h-19.17v20.4h19.17v-5.4h-12.39v-2.46h10.44v-4.68h-10.44v-2.46h12.39Zm25.05,15l-4.68-7.32c2.43-.99,3.69-3.09,3.69-6.18,0-4.56-2.7-6.9-7.95-6.9h-12.15v20.4h6.78v-6.6h2.34l4.2,6.6h7.77Zm-14.31-15.06h4.35c1.44,0,2.07.48,2.07,1.56s-.63,1.56-2.07,1.56h-4.35v-3.12Z'/%3e%3c/svg%3e";
const logoExtendedN = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20data-name='Layer%201'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20167.91%2021.12'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23231f20;%20stroke-width:%200px;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='cls-1'%20d='m94.83.36v20.4h-30.89l-8.1-11.58v11.58h-6.45V.36h7.47l6.78,9.72V.36h31.19ZM0,18.36l2.1-4.83c2.25,1.59,5.1,2.4,8.43,2.4,2.34,0,3.39-.39,3.39-1.26,0-.78-.54-.99-3.66-1.29C3.12,12.69.93,11.07.93,6.69S4.5,0,10.62,0c3.63,0,6.78.84,9.18,2.43l-2.07,4.62c-1.83-1.23-4.05-1.86-6.54-1.86s-3.42.39-3.42,1.29c0,.78.51.99,3.6,1.29,7.14.69,9.39,2.31,9.39,6.69s-3.39,6.66-9.99,6.66c-4.5,0-8.28-.96-10.77-2.76Zm23.25-7.8c0-6.45,4.41-10.56,11.34-10.56s11.34,4.11,11.34,10.56-4.41,10.56-11.34,10.56-11.34-4.11-11.34-10.56Zm15.78,0c0-2.88-1.74-4.74-4.44-4.74s-4.44,1.86-4.44,4.74,1.74,4.74,4.44,4.74,4.44-1.86,4.44-4.74Zm81,0c0,6.33-4.05,10.2-10.68,10.2h-9.93V.36h9.93c6.63,0,10.68,3.87,10.68,10.2Zm-6.9,0c0-2.97-1.53-4.5-4.5-4.5h-2.43v9h2.43c2.97,0,4.5-1.53,4.5-4.5Zm17.34-4.8v2.46h10.44v4.68h-10.44v2.46h12.39v5.4h-19.17V.36h19.17v5.4h-12.39Zm29.67,15l-4.2-6.6h-2.34v6.6h-6.78V.36h12.15c5.25,0,7.95,2.34,7.95,6.9,0,3.09-1.26,5.19-3.69,6.18l4.68,7.32h-7.77Zm-6.54-11.94h4.35c1.44,0,2.07-.48,2.07-1.56s-.63-1.56-2.07-1.56h-4.35v3.12Z'/%3e%3c/svg%3e";
const logoExtendedD = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20data-name='Layer%201'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20167.76%2021.12'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23231f20;%20stroke-width:%200px;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='cls-1'%20d='m0,18.36l2.1-4.83c2.25,1.59,5.1,2.4,8.43,2.4,2.34,0,3.39-.39,3.39-1.26,0-.78-.54-.99-3.66-1.29C3.12,12.69.93,11.07.93,6.69S4.5,0,10.62,0c3.63,0,6.78.84,9.18,2.43l-2.07,4.62c-1.83-1.23-4.05-1.86-6.54-1.86s-3.42.39-3.42,1.29c0,.78.51.99,3.6,1.29,7.14.69,9.39,2.31,9.39,6.69s-3.39,6.66-9.99,6.66c-4.5,0-8.28-.96-10.77-2.76Zm23.25-7.8c0-6.45,4.41-10.56,11.34-10.56s11.34,4.11,11.34,10.56-4.41,10.56-11.34,10.56-11.34-4.11-11.34-10.56Zm15.78,0c0-2.88-1.74-4.74-4.44-4.74s-4.44,1.86-4.44,4.74,1.74,4.74,4.44,4.74,4.44-1.86,4.44-4.74ZM70.29.36v20.4h-6.15l-8.1-11.58v11.58h-6.45V.36h7.47l6.78,9.72V.36h6.45Zm60.03,5.4v2.46h10.44v4.68h-10.44v2.46h12.39v5.4h-19.17V.36h19.17v5.4h-12.39Zm29.67,15l-4.2-6.6h-2.34v6.6h-6.78V.36h12.15c5.25,0,7.95,2.34,7.95,6.9,0,3.09-1.26,5.19-3.69,6.18l4.68,7.32h-7.77Zm-6.54-11.94h4.35c1.44,0,2.07-.48,2.07-1.56s-.63-1.56-2.07-1.56h-4.35v3.12Zm-32.06,1.74c0,6.33-4.05,10.2-10.68,10.2h-35.78V.36h35.78c6.63,0,10.68,3.87,10.68,10.2Z'/%3e%3c/svg%3e";
const logoExtendedR = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20data-name='Layer%201'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20167.76%2021.12'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%23231f20;%20stroke-width:%200px;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='cls-1'%20d='m134.7,20.76l-4.2-6.6h-2.34v6.6h-6.78V.36h37.44c5.25,0,7.95,2.34,7.95,6.9,0,3.09-1.26,5.19-3.69,6.18l4.68,7.32h-33.06ZM0,18.36l2.1-4.83c2.25,1.59,5.1,2.4,8.43,2.4,2.34,0,3.39-.39,3.39-1.26,0-.78-.54-.99-3.66-1.29C3.12,12.69.93,11.07.93,6.69S4.5,0,10.62,0c3.63,0,6.78.84,9.18,2.43l-2.07,4.62c-1.83-1.23-4.05-1.86-6.54-1.86s-3.42.39-3.42,1.29c0,.78.51.99,3.6,1.29,7.14.69,9.39,2.31,9.39,6.69s-3.39,6.66-9.99,6.66c-4.5,0-8.28-.96-10.77-2.76Zm23.25-7.8c0-6.45,4.41-10.56,11.34-10.56s11.34,4.11,11.34,10.56-4.41,10.56-11.34,10.56-11.34-4.11-11.34-10.56Zm15.78,0c0-2.88-1.74-4.74-4.44-4.74s-4.44,1.86-4.44,4.74,1.74,4.74,4.44,4.74,4.44-1.86,4.44-4.74ZM70.29.36v20.4h-6.15l-8.1-11.58v11.58h-6.45V.36h7.47l6.78,9.72V.36h6.45Zm25.32,10.2c0,6.33-4.05,10.2-10.68,10.2h-9.93V.36h9.93c6.63,0,10.68,3.87,10.68,10.2Zm-6.9,0c0-2.97-1.53-4.5-4.5-4.5h-2.43v9h2.43c2.97,0,4.5-1.53,4.5-4.5Zm17.34-4.8v2.46h10.44v4.68h-10.44v2.46h12.39v5.4h-19.17V.36h19.17v5.4h-12.39Z'/%3e%3c/svg%3e";
function RotatingLogo($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    const logoArray = [
      SonderLogoActive,
      logoExtendedN,
      logoExtendedD,
      logoExtendedE,
      logoExtendedR
    ];
    let activeLogoIndex = 0;
    $$renderer2.push(`<div${attr_class(`relative ${stringify($$sanitized_props.class || "")}`)}><!---->`);
    {
      $$renderer2.push(`<img${attr("src", S)} alt="sonder logo"${attr_class(clsx($$sanitized_props.class || ""))}/>`);
    }
    $$renderer2.push(`<!----> <img${attr("src", logoArray[activeLogoIndex])} alt="sonder logo"${attr_class(`absolute top-0 left-0 hidden md:flex ${stringify($$sanitized_props.class || "")}`)}/></div>`);
  });
}
function NewsletterSignup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let submitted = false;
    let error = false;
    let emailValue;
    const enableScroll = () => {
      if (window) {
        window.onscroll = function() {
        };
      }
    };
    const disableScroll = () => {
      if (window) {
        const x = window.scrollX;
        const y = window.scrollY;
        window.onscroll = function() {
          window.scrollTo(x, y);
        };
      }
    };
    let hiddenForm;
    const submitForm = async (formElement) => {
      const formData = new FormData(formElement);
      const response = await fetch("/forms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //@ts-ignore
        body: new URLSearchParams(formData).toString()
      });
      submitted = true;
      if (response.status !== 200) error = true;
    };
    const triggerSubmitButton = () => {
      hiddenForm = document?.getElementById("netlifyNewsletterSignup");
      if (hiddenForm) {
        const hiddenEmail = hiddenForm.querySelector('[name="email"]');
        hiddenEmail.value = emailValue;
      }
      submitForm(hiddenForm);
      console.log("email: " + emailValue);
      store_set(hasNewsletterBeenCleared, true);
    };
    {
      store_get($$store_subs ??= {}, "$isNewsletterActive", isNewsletterActive);
      if (typeof document !== "undefined" && document.getElementsByTagName("body")) {
        const body = document.getElementsByTagName("body")[0];
        if (store_get($$store_subs ??= {}, "$isNewsletterActive", isNewsletterActive)) {
          body.style.overflow = "hidden";
          disableScroll();
        } else {
          body.style.overflow = "auto";
          enableScroll();
        }
      }
    }
    if (store_get($$store_subs ??= {}, "$isNewsletterActive", isNewsletterActive)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="w-screen h-screen fixed top-0 left-0 z-40 backdrop-blur"><div class="w-full h-full absolute top-0 left-0 opacity-95"${attr_style(`background-color:${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}`)}></div> `);
      ContentWidth($$renderer2, {
        class: "h-full relative flex flex-col items-start justify-center gap-10",
        children: ($$renderer3) => {
          $$renderer3.push(`<button class="absolute top-12 left-0 hover:opacity-80" aria-label="Close newsletter signup"><i class="fa-thin fa-sharp fa-close fa-2xl scale-200"></i></button> <a href="/" class="absolute top-5 right-0 hover:opacity-80">`);
          RotatingLogo($$renderer3, { class: "h-6" });
          $$renderer3.push(`<!----></a> `);
          if (!submitted) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div><h2>Join Our Community</h2> <p>Sign up for our newsletter to receive updates <br/> on exhibitions, artists, and community events.</p></div> <div><input type="email"${attr("value", emailValue)} name="email" placeholder="Enter Your Email" class="h-12 pl-2"/> `);
            LinkArrowButton($$renderer3, { class: "mt-6", text: "Subscribe", click: triggerSubmitButton });
            $$renderer3.push(`<!----></div> <p class="text-sm mt-24">By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic <br/> communications from Gallery Sonder. You can unsubscribe or change your preferences at any time.</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
            if (error) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<h2>We're sorry, there appears to be an error. Please email info@gallerysonder.com with your inquiry.</h2>`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<h2>Thank you for joining our email list</h2>`);
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Slideshow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let imageArray = [];
    let tripledImages = [];
    const setImageArray = () => {
      imageArray = [];
      if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork)?.data.primary_image && isFilled.image(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.primary_image)) {
        imageArray.push(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.primary_image);
        if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork)?.data.secondary_images && store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.secondary_images.length > 0) {
          store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.secondary_images.forEach((e) => {
            if (e.image && isFilled.image(e.image)) {
              imageArray.push(e.image);
            }
          });
        }
      }
      tripledImages = [...imageArray, ...imageArray, ...imageArray];
      console.log("Image Array:", imageArray);
      console.log("Tripled Images:", tripledImages);
    };
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
      console.log("Current slide index:", sliderIndex);
    };
    const slideLeft = () => {
      sliderIndex++;
      if (sliderIndex >= imageArray.length) resetSliderToStart();
      console.log("Current slide index:", sliderIndex);
    };
    function handleSwipe(event) {
      if (event.detail.direction === "left") slideLeft();
      if (event.detail.direction === "right") slideRight();
    }
    if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork)) {
      setImageArray();
    }
    $$renderer2.push(`<div${attributes({
      class: "w-full h-full overflow-hidden relative",
      ...useSwipe(handleSwipe, () => ({ touchAction: "pan-y" }))
    })}>`);
    if (tripledImages.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_style(`width: ${stringify(tripledImages.length * 100)}%; transform:translateX(${stringify((-sliderIndex / tripledImages.length - 1 / 3) * 100)}%);`)}${attr_class(`flex flex-row justify-between flex-nowrap h-full w-full overflow-hidden ${stringify(isSlideAnimated ? "transition-transform duration-[2000ms]" : "")}`)}><!--[-->`);
      const each_array = ensure_array_like(tripledImages);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let image = each_array[i];
        $$renderer2.push(`<div${attr_style(`width: ${stringify(100 / tripledImages.length)}%;`)} class="h-full relative overflow-hidden">`);
        PrismicImage($$renderer2, {
          field: image,
          class: "min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex flex-row justify-between items-center absolute bottom-6 left-6 gap-12"><button class="bump" aria-label="Previous image"><i class="fa-sharp fa-regular fa-arrow-left text-white fa-2xl shadow-sm"></i></button> <button class="bump" aria-label="Next image"><i class="fa-sharp fa-regular fa-arrow-right text-white fa-2xl shadow-sm"></i></button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="w-full h-full flex items-center justify-center"><p>No images available</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Lightbox($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let submitted = false;
    let error = false;
    let formName;
    let formPhone;
    let formEmail;
    let formMessage;
    let formRole;
    const submitForm = async (formElement) => {
      const formData = new FormData(formElement);
      const response = await fetch("/forms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //@ts-ignore
        body: new URLSearchParams(formData).toString()
      });
      submitted = true;
      if (response.status !== 200) error = true;
    };
    const triggerSubmitButton = () => {
      const hiddenForm = document.getElementById("netlifyInquiryForm");
      if (hiddenForm) {
        const hiddenName = hiddenForm.querySelector('[name="name"]');
        const hiddenPhone = hiddenForm.querySelector('[name="phone"]');
        const hiddenEmail = hiddenForm.querySelector('[name="email"]');
        const hiddenMessage = hiddenForm.querySelector('[name="message"]');
        const hiddenPiece = hiddenForm.querySelector('[name="piece"]');
        const hiddenArtist = hiddenForm.querySelector('[name="artist"]');
        const hiddenRole = hiddenForm.querySelector('[name="role"]');
        if (hiddenName) hiddenName.value = formName;
        if (hiddenPhone) hiddenPhone.value = formPhone;
        if (hiddenEmail) hiddenEmail.value = formEmail;
        if (hiddenMessage) hiddenMessage.value = formMessage;
        if (hiddenPiece && store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork)) hiddenPiece.value = store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.title + ", " + store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.year;
        if (hiddenArtist && store_get($$store_subs ??= {}, "$activeArtist", activeArtist)) hiddenArtist.value = store_get($$store_subs ??= {}, "$activeArtist", activeArtist).data.full_name;
        if (hiddenRole) hiddenRole.value = formRole;
        submitForm(hiddenForm);
        console.log("submitted inquiry");
      }
    };
    if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="w-screen h-screen fixed top-0 left-0 flex justify-center items-start lg:items-center z-40 overflow-y-scroll md:overflow-hidden"${attr_style(`background-color:${stringify(store_get($$store_subs ??= {}, "$backgroundColor", backgroundColor))}`)}>`);
      ContentWidth($$renderer2, {
        class: "w-full fixed top-0 h-16 flex items-center justify-between px-4 md:px-0 z-40",
        children: ($$renderer3) => {
          $$renderer3.push(`<button class="h-6" aria-label="Close modal"><i class="text-black fa-sharp fa-solid fa-close fa-2xl hover:opacity-80 transition"></i></button> <a href="/">`);
          RotatingLogo($$renderer3, { class: "h-6 hover:opacity-80 transition" });
          $$renderer3.push(`<!----></a>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      ContentWidth($$renderer2, {
        class: "min-h-screen h-screen w-full relative flex flex-col lg:flex-row justify-center items-start lg:items-center gap-6 lg:gap-0 overflow-y-scroll lg:overflow-hidden",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mt-20 md:mt-0 w-full lg:w-1/2 h-2/5 lg:h-4/5 relative flex items-center justify-center"><div${attr_class(`w-full ${stringify(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.orientation === "landscape" ? "aspect-[4/3] " : store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.orientation === "portrait" ? "md:w-auto md:aspect-[3/4] h-full" : "max-w-full h-full max-h-full")}`)}><i class="fa-regular fa-circle-notch fa-spin fa-2xl text-black/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"></i> `);
          if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.secondary_images[0] && isFilled$1.image(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.secondary_images[0].image) && store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.orientation !== "fit") {
            $$renderer3.push("<!--[-->");
            Slideshow($$renderer3);
          } else {
            $$renderer3.push("<!--[!-->");
            PrismicImage($$renderer3, {
              class: `${stringify(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.orientation === "fit" ? "object-contain" : "object-cover")} w-full h-full z-10 relative`,
              field: store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.primary_image
            });
          }
          $$renderer3.push(`<!--]--></div></div> <div class="w-full lg:w-1/2 lg:h-4/5 lg:p-16 lg:pr-0 flex flex-col items-start justify-center gap-6">`);
          if (!store_get($$store_subs ??= {}, "$showInquiryForm", showInquiryForm)) {
            $$renderer3.push("<!--[-->");
            if (store_get($$store_subs ??= {}, "$activeArtist", activeArtist)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<a class="cursor-pointer hover:opacity-80 transition uppercase no-underline"${attr("href", `/artists/${stringify(store_get($$store_subs ??= {}, "$activeArtist", activeArtist).uid)}`)}><h5><b>${escape_html(store_get($$store_subs ??= {}, "$activeArtist", activeArtist).data.full_name)}</b></h5></a>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div class="flex flex-col gap-1">`);
            if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.title) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p><i>${escape_html(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.title)}</i></p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.year) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p>${escape_html(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.year)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.medium) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p>${escape_html(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.medium)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.dimensions) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p>${escape_html(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.dimensions)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (isFilled$1.richText(store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.body)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="rich-text">`);
              PrismicRichText($$renderer3, {
                field: store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork).data.body
              });
              $$renderer3.push(`<!----></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (!store_get($$store_subs ??= {}, "$showInquiryForm", showInquiryForm)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<button class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer">Inquire</button>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (store_get($$store_subs ??= {}, "$showInquiryForm", showInquiryForm)) {
            $$renderer3.push("<!--[-->");
            if (!submitted) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="w-full flex flex-col mt-64 md:mt-20"><h2>Inquire</h2> <p class="mb-8 mt-4">Fill out the form below to learn more about this piece.</p> <p>Name</p> <input type="text" name="name"${attr("value", formName)} required placeholder="first and last name" class="w-full border-2 border-mid p-2 mb-4"/> <p>Phone</p> <input type="phone" name="phone"${attr("value", formPhone)} required placeholder="000-000-0000" class="w-full border-2 border-mid p-2 mb-4"/> <p>Email</p> <input type="email" name="email"${attr("value", formEmail)} required placeholder="you@domain.com" class="w-full border-2 border-mid p-2 mb-4"/> <p class="hidden"><label>Don’t fill this out if you’re human: <input name="bot-field"/></label></p> <p>Message</p> <textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-2 border-mid p-2 mb-4">`);
              const $$body = escape_html(formMessage);
              if ($$body) {
                $$renderer3.push(`${$$body}`);
              }
              $$renderer3.push(`</textarea> <p>What best describes you?</p> <div>`);
              $$renderer3.select(
                {
                  name: "role",
                  id: "role",
                  class: "bg-white border-2 border-mid p-2 mb-8 cursor-pointer",
                  value: formRole
                },
                ($$renderer4) => {
                  $$renderer4.option({ value: "First Time Buyer" }, ($$renderer5) => {
                    $$renderer5.push(`First Time Buyer`);
                  });
                  $$renderer4.option({ value: "Occasional Buyer" }, ($$renderer5) => {
                    $$renderer5.push(`Occasional Buyer`);
                  });
                  $$renderer4.option({ value: "experienced" }, ($$renderer5) => {
                    $$renderer5.push(`Experienced Collector`);
                  });
                  $$renderer4.option({ value: "Experienced Collector" }, ($$renderer5) => {
                    $$renderer5.push(`Art Advisor`);
                  });
                  $$renderer4.option({ value: "Curator" }, ($$renderer5) => {
                    $$renderer5.push(`Curator`);
                  });
                  $$renderer4.option({ value: "Art Enthusiast" }, ($$renderer5) => {
                    $$renderer5.push(`Art Enthusiast`);
                  });
                }
              );
              $$renderer3.push(`</div> `);
              LinkArrowButton($$renderer3, {
                class: "uppercase",
                click: triggerSubmitButton,
                text: "Submit"
              });
              $$renderer3.push(`<!----> <p class="text-xs mt-12 w-2/3 mb-24">By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic
communications from Gallery Sonder. You can unsubscribe or change your preferences at any time.</p></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
              if (error) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<h2>We're sorry, there appears to be an error. Please email info@gallerysonder.com with your inquiry.</h2>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<h2>Thank you for reaching out!</h2>`);
              }
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!store_get($$store_subs ??= {}, "$activeArtwork", activeArtwork) && store_get($$store_subs ??= {}, "$lightboxImageUrl", lightboxImageUrl)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center z-40"><button class="absolute w-full h-full" aria-label="Close image"></button> <div class="w-11/12 h-11/12 max-h-11/12 max-w-11/12 lg:w-4/5 lg:h-4/5 lg:max-w-4/5 lg:max-h-4/5"><img${attr("src", store_get($$store_subs ??= {}, "$lightboxImageUrl", lightboxImageUrl))} alt="lightbox" class="w-full h-full object-contain"/></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CookieConsent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const cookieConsent = writable(false);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$cookieConsent", cookieConsent)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1547698656610293&amp;ev=PageView&amp;noscript=1" alt=""/></noscript>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { cookieConsent });
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let data = $$props["data"];
    let navDelayDone = false;
    let currentUtmParams = {
      source: "none",
      medium: "none",
      campaign: "none",
      term: "none",
      content: "none"
    };
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Gallery Sonder</title>`);
      });
      $$renderer3.push(`<link rel="stylesheet" href="https://use.typekit.net/oqt1xky.css"/> `);
      if (store_get($$store_subs ??= {}, "$page", page).data.meta_description) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="description"${attr("content", store_get($$store_subs ??= {}, "$page", page).data.meta_description)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$page", page).data.meta_title) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="og:title"${attr("content", store_get($$store_subs ??= {}, "$page", page).data.meta_title)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$page", page).data.meta_image) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="og:image"${attr("content", store_get($$store_subs ??= {}, "$page", page).data.meta_image.url)}/> <meta name="twitter:card" content="summary_large_image"/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    NewsletterSignup($$renderer2);
    $$renderer2.push(`<!----> `);
    CookieConsent($$renderer2, {});
    $$renderer2.push(`<!----> `);
    $$renderer2.push(`<!----> <main>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!store_get($$store_subs ??= {}, "$isIntroRunning", isIntroRunning) && navDelayDone) ;
    else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main> `);
    if (store_get($$store_subs ??= {}, "$isLightboxActive", isLightboxActive)) {
      $$renderer2.push("<!--[-->");
      Lightbox($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    PrismicPreview($$renderer2, { repositoryName });
    $$renderer2.push(`<!----> <form class="hidden" name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyContactForm"><input type="hidden" name="form-name" value="contact"/> <p>Name</p> <input type="text" name="name" required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4"/> <p>Company Name</p> <input type="text" name="company" placeholder="company name" class="w-full border-1 border-mid p-2 mb-4"/> <p>Phone</p> <input type="phone" name="phone" required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4"/> <p>Email</p> <input type="email" name="email" required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4"/> <p class="hidden"><label>Don't fill this out if you're human: <input name="bot-field"/></label></p> <p>Message</p> <textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4"></textarea> <input type="hidden" name="utm_source"${attr("value", currentUtmParams.source)}/> <input type="hidden" name="utm_medium"${attr("value", currentUtmParams.medium)}/> <input type="hidden" name="utm_campaign"${attr("value", currentUtmParams.campaign)}/> <input type="hidden" name="utm_term"${attr("value", currentUtmParams.term)}/> <input type="hidden" name="utm_content"${attr("value", currentUtmParams.content)}/> <button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button></form> <form class="hidden" name="inquiry" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyInquiryForm"><input type="hidden" name="form-name" value="inquiry"/> <p>Name</p> <input type="text" name="name" required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4"/> <p>Phone</p> <input type="phone" name="phone" required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4"/> <p>Email</p> <input type="email" name="email" required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4"/> <p class="hidden"><label>Don't fill this out if you're human: <input name="bot-field"/></label></p> <p>Message</p> <textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4"></textarea> <input name="piece" type="text"/> <input name="artist" type="text"/> <input name="role" type="text"/> <input type="hidden" name="utm_source"${attr("value", currentUtmParams.source)}/> <input type="hidden" name="utm_medium"${attr("value", currentUtmParams.medium)}/> <input type="hidden" name="utm_campaign"${attr("value", currentUtmParams.campaign)}/> <input type="hidden" name="utm_term"${attr("value", currentUtmParams.term)}/> <input type="hidden" name="utm_content"${attr("value", currentUtmParams.content)}/> <button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button></form> <form class="hidden" name="news" method="POST" id="netlifyNewsletterSignup" data-netlify="true" data-netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="news"/> <p class="hidden"><label>Don’t fill this out if you’re human: <input name="bot-field"/></label></p> <input name="name" type="text"/> <input type="email" name="email"/> <input type="hidden" name="utm_source"${attr("value", currentUtmParams.source)}/> <input type="hidden" name="utm_medium"${attr("value", currentUtmParams.medium)}/> <input type="hidden" name="utm_campaign"${attr("value", currentUtmParams.campaign)}/> <input type="hidden" name="utm_term"${attr("value", currentUtmParams.term)}/> <input type="hidden" name="utm_content"${attr("value", currentUtmParams.content)}/> <button type="submit" id="hiddenNewsSubmitButton" aria-label="Submit newsletter signup"></button></form> <form class="hidden" name="rsvp" method="POST" id="netlifyRsvpForm" data-netlify="true" data-netlify-honeypot="bot-field"><p class="hidden"><label>Don’t fill this out if you’re human: <input name="bot-field"/></label></p> <input type="hidden" name="form-name" value="rsvp"/> <input name="name" type="text"/> <input type="email" name="email"/> <input type="text" name="event"/> <input name="guests" type="number"/> <input type="hidden" name="utm_source"${attr("value", currentUtmParams.source)}/> <input type="hidden" name="utm_medium"${attr("value", currentUtmParams.medium)}/> <input type="hidden" name="utm_campaign"${attr("value", currentUtmParams.campaign)}/> <input type="hidden" name="utm_term"${attr("value", currentUtmParams.term)}/> <input type="hidden" name="utm_content"${attr("value", currentUtmParams.content)}/> <button type="submit" id="hiddenRsvpSubmitButton" aria-label="Submit RSVP"></button></form>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
