import { createAPI } from "@wsvaio/uniapi";

export const { get, use, post } = createAPI({
  baseURL: "/api",
  log: true,
});

use("before")(async (ctx) => {
  console.log("before", ctx);
  // throw new Error("dkslfjaslkdjfljk");
  // ctx.timeout = 0;
});
