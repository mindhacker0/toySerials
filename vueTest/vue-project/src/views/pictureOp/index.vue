<script setup>
import { usePicture } from './usePicture';
const {screenRef,selectFile} = usePicture();
</script>
<template>
    <div>
        <div class="view-frame">
            <canvas ref="screenRef" width="1280" height="720"></canvas>
        </div>
        <div>
            <button @click="selectFile">文件选择</button>
        </div>
    </div>
</template>
<style scoped>
.view-frame{
    border: 1px solid #ccc;
}
</style>