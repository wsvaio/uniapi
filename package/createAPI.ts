import type { Context, CreateAPIResult } from "./types.d";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

export const createAPI = <C extends Record<any, any>>(config = {} as Context<C>): CreateAPIResult<C> => {
	const context = mergeContext(createContext(), config as Context);
	return {
		get: wrapper<C>(context)("GET"),
		post: wrapper<C>(context)("POST"),
		put: wrapper<C>(context)("PUT"),
		del: wrapper<C>(context)("DELETE"),
		head: wrapper<C>(context)("HEAD"),
		connect: wrapper<C>(context)("CONNECT"),
		trace: wrapper<C>(context)("TRACE"),
		options: wrapper<C>(context)("OPTIONS"),
		request: wrapper<C>(context)("GET")({}),
		extendAPI: config => createAPI(mergeContext(createContext(), context, config as Context)),
		use:
			key =>
				(...args) =>
					context[`${key}s`].push(...args as []),
	} as CreateAPIResult<C>;
};
