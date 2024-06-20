export type ParseRet = {
    type:string;
    payload:string|number;
}
export const plainObjVisitParse = (str:string)=>{// varible string expression parse,part of i18n
    let typeNow = 0;
    let varTemp = "",varIndex = 0;
    let arrTemp = 0;
    const res:ParseRet[] = [];
    const startReg = /[a-zA-Z_$]/;
    const midVar = /[0-9a-zA-Z_$]/;
    function start(s:string){//the first letter must be part of varible
        if(varIndex === 0 && startReg.test(s)){
            varIndex++;
            varTemp+=s;
            typeNow = 1;
            return varOpen;
        }
    }
    function varOpen(s:string){// continue to be varible or meet dot or front bracket
        if(varIndex!==0 && midVar.test(s)){
            varIndex++;
            varTemp+=s;
            return varOpen;
        }
        if(s === '.') return dot;
        if(s === '[') return bracketOpen;
    }
    function dot(s:string){// dot idtentity like a.b
        if(typeNow === 1){
            res.push({type:"var",payload:varTemp});
        }
        res.push({
            type:'dot',
            payload:"."
        });
        varIndex = 0;
        varTemp = "";
        typeNow = 0;
        return start(s);
    }
    function bracketOpen(s:string){// bracket like a[0]
        if(typeNow === 1){
            res.push({type:"var",payload:varTemp});
            varIndex = 0;
            varTemp = "";
            typeNow = 0;
        }
        typeNow = 2;
        if(/[0-9]/.test(s)){
            arrTemp*=10;
            arrTemp+=+s;
            return bracketOpen;
        }
        if(s === ']') return bracketClose;
    }
    function bracketClose(s:string){
        res.push({
            type:'bracket',
            payload:arrTemp
        });
        arrTemp = 0;
        typeNow = 0;
        if(s === ".") return dot;
        if(s === "[") return bracketOpen;
    }
    let state:any = start;
    for(let s of str){
        state = state(s);
    }
    if(typeNow === 1){
        res.push({type:"var",payload:varTemp});
        varIndex = 0;
        varTemp = "";
        typeNow = 0;
    }
    if(typeNow === 2){
        res.push({
            type:'bracket',
            payload:arrTemp
        });
        arrTemp = 0;
        typeNow = 0;
    }
    return res;
}