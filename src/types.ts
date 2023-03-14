import type { Middleware } from "@wsvaio/utils";
export type { Middleware } from "@wsvaio/utils";

export interface ResponseType<R = any> {
  data: R;
  ok: boolean;
  statusCode: number;
  successResult: UniApp.RequestSuccessCallbackResult;
  failResult?: UniApp.GeneralCallbackResult;
}

export interface RequestType<P = {}> {
  baseURL?: string;

  body: (Partial<P> & Record<any, any>) | BodyInit | null; // 请求体
  query: Partial<P> & Record<any, any> | null; // 请求的query参数，会自动拼接到url之后
  param: Partial<P> & Record<any, any> | null; // 请求的param参数，会自动替换url对应的/:key

  b: Partial<P> & Record<any, any>; // 与 body 相同，优先级低
  q: Partial<P> & Record<any, any>; // 与 query 相同，优先级低
  p: Partial<P> & Record<any, any>; // 与 param 相同，优先级低
}

export interface MiddlewareContext<C = {}, P = {}, R = any> {
  befores: Middleware<BeforeContext<C, P, R>>[]; // 前置中间件
  afters: Middleware<AfterContext<C, P, R>>[]; // 后置中间件
  errors: Middleware<ErrorContext<C, P, R>>[]; // 错误中间件
  finals: Middleware<FinalContext<C, P, R>>[]; // 最终中间件
}

export type BaseContext = {
  log?: boolean; // 控制台是否打印日志s
  message?: string; // 存储消息信息，比如发生错误后的error.message
} & UniApp.RequestOptions;

export type ConfigContext<C = {}, P = {}, R = any> = Partial<
  BaseContext & MiddlewareContext<C, P, R> & RequestType<P> & C
>;

export type BeforeContext<C = {}, P = {}, R = any> = BaseContext &
MiddlewareContext<C, P, R> &
RequestType<P> &
C;

export type AfterContext<C = {}, P = {}, R = any> = BaseContext &
MiddlewareContext<C, P, R> &
RequestType<P> &
ResponseType<R> &
C;

export type ErrorContext<C = {}, P = {}, R = any> = BaseContext &
MiddlewareContext<C, P, R> &
RequestType<P> &
Partial<ResponseType<R>> &
C & { error: Error };

export type FinalContext<C = {}, P = {}, R = any> = BaseContext &
MiddlewareContext<C, P, R> &
RequestType<P> &
Partial<ResponseType<R>> &
C & { error?: Error };

export type Context = FinalContext;
