import type { BaseContext, ConfigContext, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { request } from "./request";

export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C) => {
  const context: Record<any, any> = createContext();
  mergeContext(context, config);

  return {
    get: request<C>(context)("GET"),
    post: request<C>(context)("POST"),
    put: request<C>(context)("PUT"),
    del: request<C>(context)("DELETE"),
    head: request<C>(context)("HEAD"),
    connect: request<C>(context)("CONNECT"),
    trace: request<C>(context)("TRACE"),
    options: request<C>(context)("OPTIONS"),
    request: request<C>(context)()(),
    extendAPI: <C1 extends object = {}>(config1 = {} as ConfigContext & C1 & Partial<C>) => {
      const context1: Record<any, any> = createContext();
      mergeContext(context1, context);
      mergeContext(context1, config1);
      return createAPI(context1);
    },
    use:
      <K extends "befores" | "afters" | "errors" | "finals">(key: K) =>
      (...args: MiddlewareContext<C>[K]) =>
        context[key].push(...args),
  };
};

export const run = <T extends BaseContext>(ctx: T) => request({})()()(ctx);
