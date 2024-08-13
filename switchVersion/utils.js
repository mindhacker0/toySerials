const { execSync,spawnSync } = require('child_process');  
const path = require('path');
const fs = require('fs');

function checkGitStatus() {//当前提交状态
    const buffer = execSync('git status --porcelain');
    const stdout = buffer.toString();
    // 当git status --porcelain输出为空时，表示没有未提交的更改  
    if (stdout.trim() === '') {  
        return {hasUnCommitFile:false};
    } else {  
        console.log('存在未提交的更改',stdout.split("\n"));
        return {hasUnCommitFile:true,record:stdout.split("\n")};
    }
}
function getFileRecentCommitHash(filePath) {//获取文件最后的提交hash
    const buffer = execSync('git log -1 --format="%H" -- '+filePath);
    const stdout = buffer.toString();
    return stdout;
}

function getFileContentByCommitHash(hash,filePath){//根据commit hash获取文件的内容
    const result = spawnSync('git', ['show', `${hash}:${filePath}`], { maxBuffer: 1024 * 1024 * 10 }); // Increase buffer size to 10MB
    if (result.error) {
        throw result.error;
    }
    return result.stdout.toString();
}
function copyRecursiveSync(src, dest) {
    const srcState = fs.statSync(src);
    const destDir = path.dirname(dest);

    // Ensure the destination directory exists
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (srcState.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        const files = fs.readdirSync(src);
        files.forEach(function (file) {
            copyRecursiveSync(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function coverFile(filePaths, fromRoot, toRoot) { // 目录拷贝覆盖
    filePaths.forEach(filePath => {
        const fromPath = path.join(fromRoot, filePath);
        const toPath = path.join(toRoot, filePath);
        
        copyRecursiveSync(fromPath, toPath);
        console.log(`Copied ${fromPath} to ${toPath}`);
    });
}
function arePathsEqual(path1, path2) {
  const normalizedPath1 = path.normalize(path1);
  const normalizedPath2 = path.normalize(path2);
  const resolvedPath1 = path.resolve(normalizedPath1);
  const resolvedPath2 = path.resolve(normalizedPath2);
  return fs.realpathSync(resolvedPath1) === fs.realpathSync(resolvedPath2);
}

function saveManifest(manifest) {
    const savePath = path.join(__dirname,"manifest.json")
    fs.writeFileSync(savePath, JSON.stringify(manifest, null, 2), 'utf-8');
}

function createFileAndWrite(filePath, content) {
    // Ensure that the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Write the content to the file
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Created file ${filePath} and wrote content to it`);
}

function deleteFileOrDirectoryRecursive(targetPath) {
    if (fs.existsSync(targetPath)) {
        if (fs.lstatSync(targetPath).isDirectory()) {
            // Recursively delete contents of the directory
            fs.readdirSync(targetPath).forEach(file => {
                const curPath = path.join(targetPath, file);
                deleteFileOrDirectoryRecursive(curPath);
            });
            // Remove the directory itself
            fs.rmdirSync(targetPath);
        } else {
            // It's a file, delete it
            fs.unlinkSync(targetPath);
        }
    }
}
module.exports = {
    checkGitStatus,
    coverFile,
    arePathsEqual,
    saveManifest,
    createFileAndWrite,
    getFileRecentCommitHash,
    getFileContentByCommitHash,
    deleteFileOrDirectoryRecursive
};