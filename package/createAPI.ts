import type { ConfigContext, Context, CreateAPIResult, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C): CreateAPIResult<C> => {
	const context = mergeContext(createContext(), config) as Context<C>;
	return {
		get: wrapper<C>(context)("GET"),
		post: wrapper<C>(context)("POST"),
		put: wrapper<C>(context)("PUT"),
		del: wrapper<C>(context)("DELETE"),
		head: wrapper<C>(context)("HEAD"),
		connect: wrapper<C>(context)("CONNECT"),
		trace: wrapper<C>(context)("TRACE"),
		options: wrapper<C>(context)("OPTIONS"),
		request: wrapper<C>(context)(),
		extendAPI: <Custom extends object = {}>(config1 = {} as ConfigContext & Partial<C> & Custom) =>
			createAPI(mergeContext(mergeContext(createContext(), context), config1)),
		use:
			<K extends "before" | "after" | "error" | "final">(key: K) =>
				(...args: MiddlewareContext<C>[`${K}s`]) =>
					context[`${key}s`].push(...args),
	};
};
