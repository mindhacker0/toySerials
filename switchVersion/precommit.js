//提交前的处理
const path = require('path');
const manifest = require("./manifest.json");
const { checkGitStatus, coverFile, getFileRecentCommitHash, getFileContentByCommitHash, createFileAndWrite, saveManifest, deleteFileOrDirectoryRecursive } = require("./utils");
//publicFiles路径中的文件为公共文件，不区分版本修改
const ignorePaths = ["version/",...manifest.publicFiles];
function makeManifestMap(){
    const packFiles = manifest.packFiles;
    const result = new Map;
    for(let key in packFiles){
        for(let i=0;i<packFiles[key].length;++i){
            const filePath = packFiles[key][i];
            const arr = result.get(filePath)||[];
            arr.push(key);
            result.set(filePath,arr);
        }
    }
    return result;
}
function isIgnoredPath(nPath) {
    return ignorePaths.some(ignorePath => nPath.startsWith(ignorePath));
}
function main(){
    const checkModify = checkGitStatus();//文件修改记录
    if(!checkModify.hasUnCommitFile) return;
    const commits = checkModify.record;
    const currentPack = manifest.currentPack;
    const curPackFile = manifest.packFiles[currentPack];
    const packEnum = manifest.packEnum;
    const mainfestMapper = makeManifestMap();
    console.log(mainfestMapper)
    for(let i=0;i<commits.length;++i){
        const commit = commits[i].trim();
        const firstSpaceIndex = commit.indexOf(' ');
        const state = commit.substring(0, firstSpaceIndex);
        const filePath = commit.substring(firstSpaceIndex + 1).trim();
        const cleanPath = filePath.replace(/^"(.*)"$/,(prime,match)=>match);
        if(!cleanPath) continue;
        if(isIgnoredPath(cleanPath)) continue;
        if(state === "M"){//文件修改
            //所有包都没有追踪 其它的包复制修改前的文件，并加入清单，当前的复制修改后的文件，加入清单
            const record = mainfestMapper.get(cleanPath);
            if(typeof record === "undefined"){
                const hash = getFileRecentCommitHash(filePath);
                const fileBeforeModify = getFileContentByCommitHash(hash.replace("\n",""),filePath);
                //其它的同步修改前状态
                packEnum.forEach((name)=>{
                    if(name!==currentPack){
                        console.log(path.join(__dirname+"/"+name+"/",cleanPath))
                        createFileAndWrite(path.join(__dirname+"/"+name+"/",cleanPath),fileBeforeModify);
                        manifest.packFiles[name].push(cleanPath);
                    }
                });
            }
            //当前的同步修改后
            coverFile([cleanPath],path.join(__dirname,"../"),path.join(__dirname+"/"+currentPack+"/"));
            if(manifest.packFiles[currentPack].indexOf(cleanPath)===-1) manifest.packFiles[currentPack].push(cleanPath);
        }
        if(state === "??"||state === "A"){//新增文件
            coverFile([cleanPath],path.join(__dirname,"../"),path.join(__dirname,currentPack+"/"));
            if(curPackFile.indexOf(cleanPath) === -1) curPackFile.push(cleanPath);
        }
        if(state === "D"){//删除文件
            console.log(state,cleanPath)
            const record = mainfestMapper.get(cleanPath);
            if(typeof record === "undefined"){
                const hash = getFileRecentCommitHash(filePath);
                const fileBeforeModify = getFileContentByCommitHash(hash.replace("\n",""),filePath);
                //其它的备份当前的文件
                packEnum.forEach((name)=>{
                    if(name!==currentPack){
                        createFileAndWrite(path.join(__dirname+"/"+name+"/",cleanPath),fileBeforeModify);
                        manifest.packFiles[name].push(cleanPath);
                    }
                })
            }
            deleteFileOrDirectoryRecursive(path.join(__dirname+"/"+currentPack+"/",cleanPath));
            const index = manifest.packFiles[currentPack].indexOf(cleanPath)===-1;
            manifest.packFiles[currentPack][index] = "#D";
        }
    }
    const effectPack = [];
    for(let i=0;i<manifest.packFiles[currentPack].length;++i){
        if(manifest.packFiles[currentPack][i] !== "#D") effectPack.push(manifest.packFiles[currentPack][i]);
    }
    manifest.packFiles[currentPack] = effectPack;
    saveManifest(manifest);
}
main()