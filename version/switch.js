const { execSync } = require('child_process');  
const fs = require('fs');
const path = require('path');
const manifest = require("./mainfest.json");
function checkGitStatus() {//当前提交状态
    const buffer = execSync('git status --porcelain');
    const stdout = buffer.toString();
    // 当git status --porcelain输出为空时，表示没有未提交的更改  
    if (stdout.trim() === '') {  
        return {hasUnCommitFile:false};
    } else {  
        console.log('存在未提交的更改');
        return {hasUnCommitFile:true,record:stdout.split("\n")};
    }
}  
function coverFile(filePaths,fromRoot,toRoot){//拷贝覆盖
    filePaths.forEach(filePath => {
        const fromPath = path.join(fromRoot, filePath);
        const toPath = path.join(toRoot, filePath.replace('/', ''));
        fs.copyFileSync(fromPath, toPath);
        console.log(`Copied ${fromPath} to ${toPath}`);
    });
}
function main(){
   const checkModify = checkGitStatus();
   //if(checkModify.hasUnCommitFile) return;
   const args = process.argv.slice(2);
   console.log(args);
   if(args.length <=0) return;
   const filePaths = manifest.exChangeFilePath;
   const fromRoot = `${args[0].replace(/^-/,"")}/`;
   const toRoot = "../";
   console.log(filePaths,fromRoot,toRoot);
   coverFile(filePaths,fromRoot,toRoot);
}
main();