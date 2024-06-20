
import { getSreverJson } from "@/utils/serverApi/home";
import { plainObjVisitParse,type ParseRet } from "./routeParse";
import { TransFn, handleSlot } from "./common";
// translation for serverside
export enum Lang {
  zh = "zh",
  en = "en"
}
const jsonCache = new Map;
export const InitTranslation  = async (namespace:string,lang = "en")=>{
    const cachekey = `${lang}:${namespace}`;
    if(!jsonCache.has(cachekey)){
        const langFile = await getSreverJson(`/locales/${lang}/${namespace}.json`);
        const data = langFile.data;
        if(data) jsonCache.set(cachekey,data);
    }
    const curSource = jsonCache.get(cachekey);
    const transFn:TransFn = (key,replacements)=>{
      if(!curSource||!key) return;
      const parse:ParseRet[] = plainObjVisitParse(key);
      let value:any = curSource;
      for(let i=0;i<parse.length;++i){
        if(parse[i].type === "var") value = value[parse[i].payload];
        if(parse[i].type === "bracket") value = value[parse[i].payload];
      }
      if(typeof value === "string" && typeof replacements!=="undefined"){//插槽类型处理
        return handleSlot(value,replacements);
      } 
      return value;
    }
    return transFn;
};