import { compose, merge, omit } from "@wsvaio/utils";
import { createContext, mergeContext } from "./context";
import type {
	AfterContext,
	BeforeContext,
	ConfigContext,
	Context,
	CurryingResult,
	ErrorContext,
	FinalContext,
} from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";

/**
 * 运行中间件处理上下文
 * @param ctx 上下文对象
 * @returns Promise<FinalContext>
 */
export const run = <T extends Context>(ctx: T): Promise<FinalContext> =>
	compose(
		...ctx.befores,
		...BEFORES
	)(ctx as BeforeContext)
		.then(() => MIDDLE(ctx))
		.then(() => compose(...AFTERS, ...ctx.afters)(ctx as AfterContext))
		.catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx as ErrorContext, { error })))
		.finally(() => compose(...FINALS, ...ctx.finals)(ctx as FinalContext));

/**
 * 返回一个包装后的函数，用于处理传入的上下文
 * @param context 上下文对象
 * @returns CurryingResult
 */
export const wrapper
	= <C>(context: Context<C>) =>
		(method?: Context["method"]): CurryingResult<C> =>
			currying<C>({ ...context, method } as Context<C>);

/**
 * 返回一个柯里化后的函数，用于处理请求
 * @param context 上下文对象
 * @returns CurryingResult
 */
function currying<C>(context: Context<C>) {
	/**
	 * 处理请求
	 * @param config 请求配置对象或请求的url
	 * @returns Promise<R> | CurryingResult
	 */
	function result<P extends object = {}, R = any>(
		config: (ConfigContext<C, P, R> & { config: true }) | string
	): CurryingResult<C, P, R>;
	function result<P extends object = {}, R = any>(config?: ConfigContext<C, P, R> & { config?: false }): Promise<R>;
	function result<P extends object = {}, R = any>(
		config = {} as (ConfigContext<C, P, R> & { config?: boolean }) | string
	) {
		const ctx = mergeContext(createContext(), context);
		if (typeof config === "string") config = { url: config, config: true } as ConfigContext<C, P, R> & { config: true };
		mergeContext(ctx, omit(config, ["config"]));
		return config?.config ? currying(ctx) : run(ctx).then(() => ctx.data);
	}
	return result;
}
