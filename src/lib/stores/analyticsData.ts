import { writable } from "svelte/store";

export const utmParams = writable({
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: ""
});