import { post } from "./request";

export const test = post<{ q?: { id: number }; d: string }>("/test/:id?");
