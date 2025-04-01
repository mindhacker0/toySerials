# 拉取仓库
git clone https://github.com/emscripten-core/emsdk.git

# 进入目录
cd emsdk

# 下载最新 SDK 工具
./emsdk install latest

# 版本设置为最新
./emsdk activate latest

# 将相关命令行工具加入到 PATH 环境变量中（临时）
source ./emsdk_env.sh