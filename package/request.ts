import { compose, merge } from "@wsvaio/utils";
import { createContext, mergeContext } from "./context";
import type { Context, WrapperResult } from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";

/**
 * 执行ctx
 */
export const run = <T extends Context>(ctx: T) =>
	compose<T>(
		...ctx.befores,
		...BEFORES
	)(ctx)
		.then(() => MIDDLE(ctx))
		.then(() => compose(...AFTERS, ...ctx.afters)(ctx))
		.catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx, { error })))
		.finally(() => compose(...FINALS, ...ctx.finals)(ctx));

/**
 * 使ctx正常化（不自动抛出error）
 */
export const normalize = <T extends Context>(ctx: T) => (ctx.normal = true);

export const wrapper =
	<C>(context: Context) =>
	(method: Context["method"]): WrapperResult<C> =>
	config1 =>
	config2 =>
		run(
			mergeContext(createContext(), context, typeof config1 === "string" ? { url: config1 } : config1, config2, {
				method,
			})
		).then(({ data }) => data);
