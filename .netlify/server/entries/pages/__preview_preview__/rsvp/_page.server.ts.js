import { c as createClient } from "../../../../chunks/prismicio.js";
import { filter } from "@prismicio/client";
import { redirect } from "@sveltejs/kit";
async function load({ params, fetch, cookies, depends }) {
  const client = createClient({ fetch, cookies });
  const page = await client.getFirst({
    filters: [filter.at("document.type", "rsvp")],
    orderings: {
      field: "document.last_publication_date",
      direction: "desc"
    }
  });
  throw redirect(302, "/rsvp/" + page.uid);
}
export {
  load
};
