import { dateFormat, is, merge } from "@wsvaio/utils";
import type {
  AfterContext,
  BeforeContext,
  Context,
  ErrorContext,
  FinalContext,
  Middleware,
} from "./types";

export const BEFORES: Middleware<BeforeContext>[] = [
  // 拼接请求url
  async (ctx) => {
    ctx.param ||= ctx.p;
    ctx.query ||= ctx.q;
    ctx.body ||= ctx.b;
    // param拼接
    const body = is("Object")(ctx.body) ? ctx.body : {};
    ctx.url.match(/:[\w_][\w\d_]*\??/gims).forEach((matched) => {
      const key = matched.slice(1, matched.length - (matched.endsWith("?") ? 1 : 0));
      const val = ctx.param[key] || body[key] || "";
      if (!val && !matched.endsWith("?")) return;
      ctx.url = ctx.url.replace(matched, val);
    });
    ctx.url = ctx.url.replace(/\/+/imgs, "/");

    // query拼接
    ctx.url += ctx.url.includes("?") ? "&" : "?";
    Object.entries(ctx.query).forEach(([k, v]) =>
      Array.isArray(v)
        ? v.forEach(item => (ctx.url += `${k}=${item}&`))
        : (![null, undefined, ""].includes(v) && (ctx.url += `${k}=${v}&`)),
    );
    ctx.url = ctx.url.substring(0, ctx.url.length - 1);
  },
];

export const MIDDLE = async <T extends Context>(ctx: T) =>
  await new Promise((resolve) => {
    uni.request({
      ...ctx,
      timeout: ctx.timeout || undefined,
      url: ctx.baseURL + ctx.url,
      data: ctx.body,
      success: data => (ctx.successResult = data),
      fail: error => (ctx.failResult = error),
      complete: resolve,
    });
  });

export const AFTERS: Middleware<AfterContext>[] = [
  // 检查返回结果
  async (ctx) => {
    if (ctx.failResult) throw new Error(ctx.failResult.errMsg);
    else if (!ctx.successResult) throw new Error("no result");
    const { statusCode, errMsg: message, data } = ctx.successResult;
    const ok = statusCode >= 200 && statusCode <= 299;
    merge(ctx, { data, message, statusCode, ok });
    if (!ok) throw new Error(ctx.message);
  },
];

export const ERRORS: Middleware<ErrorContext>[] = [
  async (ctx, next) => {
    ctx.message = ctx.error.message;
    await next();
    throw ctx.error;
  },
];

export const FINALS: Middleware<FinalContext>[] = [
  async (ctx, next) => {
    await next();
    if (!ctx.log) return;
    const status = ctx.successResult
      ? `${ctx.successResult.statusCode} ${ctx.message}`
      : `${ctx.message}`;
    const Params = Object.setPrototypeOf({}, new function params() {}());
    const Result = Object.setPrototypeOf({}, new function result() {}());
    const Context = Object.setPrototypeOf({}, new function context() {}());
    merge(Params, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge(Result, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge(Context, ctx);
    console.groupCollapsed(
      `%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${status} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${
        ctx.ok ? "#67C23A" : "#F56C6C"
      }; border-radius: 0 3px 3px 0;`,
    );
    console.log(Params);
    console.log(Result);
    console.log(Context);
    console.groupEnd();
  },
];
