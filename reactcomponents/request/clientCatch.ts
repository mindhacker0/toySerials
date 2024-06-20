import { message } from "antd";
import { AxiosResponse } from "axios";
export type PickFieldType<T, K extends keyof T> = T[K];
interface ReqReturn<T>{
    data:AxiosResponse<T>|null;
    error:any;
}
export type catchRt<T> = Promise<ReqReturn<T>>;
export async function reqCatch<R=any>(req:()=>Promise<AxiosResponse<R>>):Promise<ReqReturn<R>> {
    try {
      const data = await req();
      return {
        data,
        error: null
      };
    } catch (e:any) {
      // 可在此处定义全局的错误处理方法，也可在外部处理
      message.error(e.response.data.message);
      return {
        data: null,
        error: e
      };
    }
}