import type { Middleware } from "@wsvaio/utils";

export interface ResponseType<R = any> {
  data: R;
  ok: boolean;
  statusCode: number;
  successResult: UniApp.RequestSuccessCallbackResult;
  failResult?: UniApp.GeneralCallbackResult;
}

export interface RequestType<P = {}> {
  baseURL?: string;

  body: (Partial<P> & Record<any, any>) | BodyInit | null;
  query: Partial<P> & Record<any, any> | null;
  param: Partial<P> & Record<any, any> | null;

  b: Partial<P> & Record<any, any>;
  q: Partial<P> & Record<any, any>;
  p: Partial<P> & Record<any, any>;
}

export interface MiddlewareContext<C = {}, P = {}, R = any> {
  befores: Middleware<BeforeContext<C, P, R>>[];
  afters: Middleware<AfterContext<C, P, R>>[];
  errors: Middleware<ErrorContext<C, P, R>>[];
  finals: Middleware<FinalContext<C, P, R>>[];
}

export type BaseContext = {
  log?: boolean;
  message?: string;
} & UniApp.RequestOptions;

export type { Middleware };

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

export type Context<C = {}> = Partial<FinalContext<C>>;

export interface CurryingResult<C, Param extends object = {}, Result = any> {
  <P extends object = {}, R = Result>(config: ConfigContext<C, P & Param, R> & { config: true } | string): CurryingResult<C, P & Param, R>;
  <P extends object = {}, R = Result>(config?: ConfigContext<C, P & Param, R> & { config?: false }): Promise<R>;
}

export interface CreateAPIResult<C extends object = {}> {
  get: CurryingResult<C, {}, any>;
  post: CurryingResult<C, {}, any>;
  put: CurryingResult<C, {}, any>;
  del: CurryingResult<C, {}, any>;
  head: CurryingResult<C, {}, any>;
  connect: CurryingResult<C, {}, any>;
  trace: CurryingResult<C, {}, any>;
  options: CurryingResult<C, {}, any>;
  request: CurryingResult<C, {}, any>;
  extendAPI: <Custom extends object = {}>(config1?: ConfigContext & Partial<C> & Custom) => CreateAPIResult<Partial<C> & Custom>;
  use: <K extends "error" | "before" | "after" | "final">(key: K) => (...args: MiddlewareContext<C, {}, any>[`${K}s`]) => number;
}
