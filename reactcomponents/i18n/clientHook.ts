"use client";
import React, { createContext , ReactNode, useRef, useEffect,useState } from "react";
import { useCallback } from 'react';
import { plainObjVisitParse,type ParseRet } from "../utils";
import { getLangJson } from '@/lib/reducer/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { TransFn, handleSlot } from "./common";

export enum Lang {
  zh = "zh",
  en = "en"
}
const useTranslations  = (namespace:string)=>{
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state=>state.user.uiControl.lang);
  const langCache = useAppSelector(state=>state.user.langCache);
  const cachekey = `${lang}:${namespace}`;
  useEffect(()=>{
    dispatch(getLangJson({namespace,lang}));
  },[lang]);
  const t = useCallback<TransFn>((key,replacements)=>{
    const curSource = langCache[cachekey];
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
  },[langCache]);
  return t;
};
export { useTranslations };