const fs = require('fs');
const path = require('path');
const manifest = require("./manifest.json");
const { checkGitStatus, coverFile, saveManifest } = require('./utils');

//文件完整性检查
function manifestCheck(check){//check -0  check current pack files, -1 check all pack files.
    const packFiles = manifest.packFiles;
    const currentPack = manifest.currentPack;
    const packEnum = manifest.packEnum;
    const missingFiles = [];
    let packsToCheck = [];
    if (check === 0) {
        packsToCheck = [currentPack];
    } else if (check === 1) {
        packsToCheck = packEnum;
    }
    // Check each file in each pack
    packsToCheck.forEach(pack => {
        const filePaths = packFiles[pack];
        filePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, pack,path.normalize(filePath));
            console.log("check ",fullPath);
            if (!fs.existsSync(fullPath)) {
                missingFiles.push(fullPath);
            }
        });
    });
    if (missingFiles.length > 0) {
        console.log('Missing files:', missingFiles);
        return false;
    } else {
        console.log('All files exist.');
        return true;
    }
}
function filesToClean(pack){
    const packFiles = manifest.packFiles;
    const currentPack = pack;
    for (let pack in packFiles) {
        if (pack !== currentPack) {
            const filePaths = packFiles[pack];
            filePaths.forEach(filePath => {
                const fullPath = path.join(__dirname,"../", path.normalize(filePath));
                console.log("Cleaning ", fullPath);
                if (fs.existsSync(fullPath)) {
                    fs.rmSync(fullPath, { recursive: true, force: true });
                }
            });
        }
    }
}
function main(){
    const args = process.argv.slice(2);
    if(args.length <=0) throw new Error("command error!");
    const subPara = args.length>1?args[1].replace(/^--/,""):"";
    if(subPara!=="force"){
        const checkModify = checkGitStatus();
        if(checkModify.hasUnCommitFile) throw new Error("commit error!");
    }
    const checkCompletenes = manifestCheck(1);
    if(!checkCompletenes) throw new Error("mainfest check error!");
    const pack = args[0].replace(/^-/,"");
    const filePaths = manifest.packFiles[pack];
    const fromRoot = path.join(__dirname,`${pack}/`);
    const toRoot = path.join(__dirname,"../");
    filesToClean(pack);
    coverFile(filePaths,fromRoot,toRoot);
    manifest.currentPack = pack;
    saveManifest(manifest);//修改清单内容
    return 0;
}
main();

