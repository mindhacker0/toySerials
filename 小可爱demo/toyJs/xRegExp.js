class XRegExp{
    constructor(source,flag,root){
        this.table = new Map();
        this.regexp = new RegExp(this.compileRegExp(source,root,0).source,flag);
    }
    compileRegExp(source,name,start){
        if(source[name] instanceof RegExp)
            return {
                source:source[name].source,
                length:0
            };
        let length = 0;
        let regexp = source[name].replace(/\<([^>]+)\>/g,function(str,$1){
            this.table.set(start+length,$1);
            this.table.set($1,start+length);
            ++length;
            let r = this.compileRegExp(source,$1,start + length);
            length+=r.length;
            return r.source;
        });
        return {
            source:regexp,
            length:length
        };
    }
    exec(string){
        let r = this.regexp.exec(string);
        console.log(r);
    }
    get lastIndex(){
        return this.regexp.lastIndex;
    }
    set lastIndex(value){
        return this.regexp.lastIndex = value;
    }
}