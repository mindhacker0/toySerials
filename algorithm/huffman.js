let codeText  = "sfaosfaspfgiogiqgqwpghgquwgwq[gwqphguwqguwqpgwguhgpwqghewugqwpgwghpgqg";
let stsObj = Object.create(null);
for(let i of codeText){//统计词频
    if(typeof stsObj[i]==="undefined"){
        stsObj[i] = 0;
    }
    stsObj[i]++;
}
//console.log(stsObj);
let arr = [];
for(let i in stsObj){
    arr.push({
        key:i,
        val:stsObj[i]
    });
}
arr.sort((a,b)=>a.val-b.val);//按频次排序
//console.log(arr);
function TreeNode(val, key, left, right) {
    this.val = (val===undefined ? 0 : val);
    this.key = (key===undefined ? 0 : key);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
}
let root = null;
{//第一步（小左大右）
    let leftKey = arr.shift();
    let rightKey = arr.shift();
    let leftNode = new TreeNode(leftKey.val,leftKey.key);
    let rightNode = new TreeNode(rightKey.val,rightKey.key);
    let parent = new TreeNode(leftKey.val+rightKey.val,null,leftNode,rightNode);
    root = parent;
}
console.log("step 1",root);
{//第二部

}
