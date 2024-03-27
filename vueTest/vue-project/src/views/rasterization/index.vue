<script setup>
import { useRaster } from '@/game/rasterization';
const {viewRef,fpsShow} = useRaster();
</script>
<template>
    <div class="view-frame">
        <canvas ref="viewRef" width="1280" height="720"></canvas>
        <input ref="fpsShow"/>
    </div>
</template>
<style scoped>
.view-frame{
    border: 1px solid #ccc;
}
</style>