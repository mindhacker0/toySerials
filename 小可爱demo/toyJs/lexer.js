// const jsLexer = require("./regExpCompiler");
// const fs = require("fs");
//console.log(jsLexer);
function escapehtml(str) {
    //console.log(str);
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
function scan(htmlText,callback){
    let str = escapehtml(htmlText);
    //console.log(str,jsLexer);
    jsLexer.lastIndex = 0;
    while(jsLexer.lastIndex < str.length){
        let r = jsLexer.exec(str);
        callback(r);
        // fs.appendFileSync('./data.txt',JSON.stringify(r)+"\n");
        if(!r[0].length)
            break;
    }
}
// let fullStr = "";
// scan(`function compileRegExp(xregexp,name){
//     let regexp = xregexp[name].source.replace("d",function(str,$1){
//         return compileRegExp(xregexp,$1);
//     });
//     return regexp;
// }
// let compiledRegExp = compileRegExp(xregexp,"InputElement");
// let  lexerRegExp = new RegExp(compiledRegExp,"g");//\s
// module.exports = lexerRegExp;`,(r)=>{
//     console.log(r);
//     fullStr+=r[0];
// });
// console.log(fullStr);