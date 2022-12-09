const wordList = ["adc","ffs","ggr","ppp"];
const sentence = (function(){let s = '';for(var i=0;i<10000;i++){s+=String.fromCharCode(97+(~~(Math.random()*26)));} return s;})();
console.log(sentence);function Trie(){//字典树
    this.Head = Object.create(null);
    let endSign = Symbol.for("$end");
    this.endSymbol = endSign;
    this.addStr = function(str){//添加字符到字典树
        let node = this.Head;
        for(let i in str){
            if(str.hasOwnProperty(i)){
                if(!node[str[i]]){
                    node[str[i]] = {};
                }
                node=node[str[i]];
            }
        }
        node[endSign]?node[endSign]++:(node[endSign]=1);
    }
    this.match = function(str){//匹配字符串中的字符
        let node = this.Head;
        let frag = '';//已匹配片段
        let result = [];
        let i=0;
        let start = 0;
        while(i<str.length){
            if(node[str[i]]){
                if(frag===''){
                    start = i;
                }
                frag+=str[i];
                node = node[str[i]];
                i++;
            }else{
                if(frag!==''){
                    if(node[endSign]){//已找到匹配目标
                        result.push({
                            start,
                            end:i,
                            content:frag,
                            mask:str.slice(start,i)
                        });
                    }else{
                        //匹配失败
                    }
                    i=start+1;
                    node = this.Head;
                    frag='';
                }else{
                    i++;
                }
            }
        }
        if(frag!==''){
            if(node[endSign]){
                result.push({
                    start,
                    end:i,
                    content:frag
                });
            }else{  
                
            }
            node = this.Head;
            frag='';
        }
        return result;
    }
    this.hightLightkeyWords=(str)=>{//敏感词高亮
        let matchs = this.match(str);
        let point=0;
        let hlight = [];
        for(let i=0;i<matchs.length;i++){
            const {start,end,content} = matchs[i];
            if(point>start&&i>0){//敏感词交叉
                hlight.pop();
                hlight.push(`<span class="key-word" data-keyword="${matchs[i-1].content}">${str.slice(matchs[i-1].start,matchs[i-1].start+point-start-1)}</span>`);
                hlight.push(`<span class="key-word" data-keyword="${content},${matchs[i-1].content}">${str.slice(matchs[i-1].start+point-start-1,point)}</span>`);//交叉词
                hlight.push(`<span class="key-word" data-keyword="${content}">${str.slice(point,end)}</span>`);
            }else{
                hlight.push(str.slice(point,start));
                hlight.push(`<span class="key-word" data-keyword="${content}">${content}</span>`);
            }
            point = end;
        }
        hlight.push(str.slice(point));
        return {
            content:hlight.join(""),
            match:matchs
        };
    }
}

