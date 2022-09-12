var jsLexer = jsLexer || (function(scope){
    let keywords = /(?:const|yield|import|get|set|async|await|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static)(?![a-zA-Z\d\$_\u00a1-\uffff])/;
    let xregexp = {
        InputElement:"<WhiteSpace>|<LineTerminator>|<Comments>|<Token>",
        WhiteSpace:/ /,//空格符
        //行终结符
        LineTerminator:/\n/,
        //匹配注释
        Comments:/\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
        Token:"<Literal>|<Keywords>|<Constructors>|<Identifier>|<Punctuator>",
        Literal:"<NumberLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
        //数字类型
        NumberLiteral:/(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
        //布尔类型
        BooleanLiteral:/true|false/,
        //匹配字符串、字符串模板、正则
        StringLiteral:/\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'|\`(?:[^'\n]|\\[\s\S])*\`|\/[^\/].*\//,
        NullLiteral:/null/,
        Keywords:keywords,
        //Global的构造函数
        Constructors:/Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|JSON|Math/,
        //变量标识符
        Identifier:/[a-zA-Z\$_\u00a1-\uffff][a-zA-Z\d\$_\u00a1-\uffff]*/,
        //运算符
        Punctuator:/\+|\-|\*|\\|\{|\}|\<|\>|\+\+|\-\-|\=|\(|\)|;|\,|\[|\]|\./,
    };
    function compileRegExp(xregexp,name){//替换当中的字符串最后变成终结符中的正则
        if(xregexp[name] instanceof RegExp) return  `(?<${name}>${xregexp[name].source})`;
        let regexp = xregexp[name].replace(/\<([^>]+)\>/g,function(str,$1){
            return compileRegExp(xregexp,$1);
        });
        return regexp;
    }
    let  compiledRegExp = compileRegExp(xregexp,"InputElement");
    let  lexerRegExp = new RegExp(compiledRegExp,"g");
    return lexerRegExp;
})(typeof window !== "undefined" && window || this);

if(typeof module !== "undefined" && module.exports){
    module.exports = jsLexer;
}
