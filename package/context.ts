import { merge, omit } from "@wsvaio/utils";
import type { Context, MiddlewareContext } from "./types";

const CONTEXT: Context = {};

/**
 * 合并两个上下文对象
 * @param context1 第一个上下文对象
 * @param context2 第二个上下文对象
 * @returns 合并后的上下文对象
 */
export const mergeContext = (context1: Record<any, any>, context2: Record<any, any>) => {
	const keys: (keyof MiddlewareContext)[] = ["befores", "afters", "errors", "finals"];

	keys.forEach(key => {
		!Array.isArray(context1[key]) && (context1[key] = []);
		Array.isArray(context2[key]) && context1[key].push(...context2[key]);
	});

	return merge(context1, omit(context2, keys), {
		deep: Infinity,
	});
};
/**
 * 创建默认上下文对象
 * @returns 默认上下文对象
 */
export const createContext = (): Context =>
	mergeContext(
		{
			method: "GET",
			header: {},
			log: false,
			timeout: 0,
			url: "/",
			baseURL: "",

			b: {},
			q: {},
			p: {},

			query: null,
			body: null,
			param: null,

			befores: [],
			afters: [],
			errors: [],
			finals: [],

			message: "",
		},
		CONTEXT
	);
/**
 * 设置全局上下文对象
 * @param config 要设置的上下文对象
 */
export const setGlobalContext = <C extends object = {}>(config: Context<C>) => mergeContext(CONTEXT, config);
