import type { DeepPartial, Middleware } from "@wsvaio/utils";
export type { Middleware };
/**
 * 定义响应类型
 * @template R 响应数据类型
 */
export interface ResponseType<D = any> {
	data: D; // 响应数据
	ok: boolean; // 响应是否成功
	statusCode: number; // 响应状态码
	response: UniApp.GeneralCallbackResult & UniApp.RequestSuccessCallbackResult; // 响应结果
}

/**
 * 定义请求类型
 * @template P 请求参数类型
 */
export interface RequestType<B = Record<any, any>, Q = Record<any, any>, P = Record<any, any>> {
	baseURL: string;

	body: Record<any, any> | BodyInit | null;
	query: Record<any, any> | null;
	param: Record<any, any> | null;

	b: B & Record<any, any>;
	q: Q & Record<any, any>;
	p: P & Record<any, any>;
}


export type BasicContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = {
	log: boolean;
	message: string;


	befores: Middleware<BeforeContext<C, B, Q, P, D>>[];
	afters: Middleware<AfterContext<C, B, Q, P, D>>[];
	errors: Middleware<ErrorContext<C, B, Q, P, D>>[];
	finals: Middleware<FinalContext<C, B, Q, P, D>>[];
} & C & UniApp.RequestOptions;


export type BeforeContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P>;


export type AfterContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & ResponseType<D>;

export type ErrorContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & Partial<ResponseType<D>> & { error: Error };

export type FinalContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & Partial<ResponseType<D>> & { error?: Error };

export type Context<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = Partial<BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & ResponseType<D>> & { error?: Error };


export type WrapperResult<C> = <
	T extends {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d?: any;
	} = {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d: any;
	}
>(
	config1:
	| (Context<
	C,
	T["b"] extends unknown ? Record<any, any> : T["b"],
	T["q"] extends unknown ? Record<any, any> : T["q"],
	T["p"] extends unknown ? Record<any, any> : T["p"],
	T["d"] extends unknown ? any : T["d"]
		  > &
	Partial<Omit<T, "d">>)
	| string
) => <D = T["d"]>(
	config2?: Context<
	C,
	T["b"] extends unknown ? Record<any, any> : T["b"],
	T["q"] extends unknown ? Record<any, any> : T["q"],
	T["p"] extends unknown ? Record<any, any> : T["p"],
	D extends unknown ? any : D
	> &
	Omit<T, "d">
) => Promise<D>;

export interface CreateAPIResult<C extends Record<any, any>> {
	get: WrapperResult<C>;
	post: WrapperResult<C>;
	put: WrapperResult<C>;
	patch: WrapperResult<C>;
	del: WrapperResult<C>;
	head: WrapperResult<C>;
	connect: WrapperResult<C>;
	trace: WrapperResult<C>;
	options: WrapperResult<C>;
	request: <D>(config?: Context<C>) => Promise<D>;
	extendAPI: <T extends Record<any, any>>(config?: Context<T & C>) => CreateAPIResult<T & C>;
	use: <K extends "error" | "before" | "after" | "final">(key: K) => (...args: Context<C>[`${K}s`]) => number;
}
