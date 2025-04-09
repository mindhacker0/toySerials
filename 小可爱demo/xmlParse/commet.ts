import { TagContent } from ".";
//deal with inline comments.
let commet = "";
function inlineComment(s:string){
    commet = "";
    if(s === "!") return inlineCommentStart;
}

function inlineCommentStart(s:string,count = 0){
    // console.log("CommentStart",s)
    if(s === "-") return (ss:string)=>inlineCommentStart(ss,count+1);
    if(count === 2) return inlineCommentContent(s);
}

function inlineCommentContent(s:string){
    commet+=s;
    // console.log("CommentContent",s)
    if(s === "-") return inlineCommentEnd;
    else return inlineCommentContent;
}

function inlineCommentEnd(s:string,ready = false){
   commet+=s;
   if(s === "-") return (ss:string)=>inlineCommentEnd(ss,true);
   if(ready && s === ">") return inlineClose(s);
   else return inlineCommentContent;
}

function inlineClose(s:string){
    // console.log("inline comment",commet.slice(0,-3));
    return TagContent;
}

export {inlineComment}