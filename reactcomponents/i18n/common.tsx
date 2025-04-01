import React from "react";
export type ReplaceSlot = Record<string,string|number|React.ReactElement|React.ReactElement[]|Function>;
export interface TransFn{
  (key:string,replacements?:ReplaceSlot):any;
}
export const handleSlot = (textRaw:string,replacements:ReplaceSlot):string|React.ReactElement|React.ReactElement[]=>{
    let retType = "string";
    let regex = /\$\{(.*?)\}/g;
    let match,start = 0;  
    const result = [];
    while ((match = regex.exec(textRaw)) !== null) {  
      result.push(textRaw.slice(start,match.index));
      const replace = replacements[match[1]];
      if(replace){
        const elem = typeof replace === "function"?replace(start,match[1]):replace;
        if(typeof elem === "object" && elem.$$typeof === Symbol.for("react.element")){ retType = "component";}
        result.push(elem);
      }
      start = match.index+match[0].length;
    }
    result.push(textRaw.slice(start));
    return retType === "string"?result.join(""):<>{result.map(v=>v)}</>;
} 