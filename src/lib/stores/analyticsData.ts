import { writable } from "svelte/store";

export const utmParams = writable({
  source: "none",
  medium: "none",
  campaign: "none",
  term: "none",
  content: "none"
});