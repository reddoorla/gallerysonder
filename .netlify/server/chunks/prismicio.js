import * as prismic from "@prismicio/client";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
const enableAutoPreviews = (config2) => {
  if (!config2.cookies) {
    return;
  }
  const cookie = config2.cookies.get(prismic.cookie.preview);
  if (cookie && /\.prismic\.io/.test(cookie)) {
    config2.client.queryContentFromRef(cookie);
  }
};
const repositoryName$1 = "gallerysonder";
const config = {
  repositoryName: repositoryName$1
};
const repositoryName = config.repositoryName;
const routes = [
  {
    type: "page",
    uid: "home",
    path: "/"
  },
  {
    type: "page",
    path: "/:uid"
  },
  {
    type: "artist",
    path: "/artists/:uid"
  },
  {
    type: "exhibit",
    path: "/exhibitions/:uid"
  },
  {
    type: "essay",
    path: "/essays/:uid"
  }
];
const createClient = ({ cookies, ...config2 } = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config2
  });
  enableAutoPreviews({ client, cookies });
  return client;
};
export {
  createClient as c,
  repositoryName as r
};
