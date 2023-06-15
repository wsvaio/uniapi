import type { ConfigContext, Context, CreateAPIResult, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

/**
 * 创建API
 * @param config API配置上下文
 * @returns CreateAPIResult<C>
 * @template C
 */
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
		/**
		 * 扩展API
		 * @param config1 API配置上下文
		 * @returns CreateAPIResult<C & Custom>
		 * @template Custom
		 */
		extendAPI: <Custom extends object = {}>(config1 = {} as ConfigContext & Partial<C> & Custom) =>
			createAPI(mergeContext(mergeContext(createContext(), context), config1)),
		/**
		 * 使用中间件
		 * @param key 中间件类型
		 * @param args 中间件函数
		 */
		use:
			<K extends "before" | "after" | "error" | "final">(key: K) =>
				(...args: MiddlewareContext<C>[`${K}s`]) =>
					context[`${key}s`].push(...args),
	};
};
