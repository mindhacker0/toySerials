<script setup>
import { useRaster } from '@/game/rasterization';
const {viewRef} = useRaster();
</script>
<template>
    <div class="view-frame">
        <canvas ref="viewRef" width="1280" height="720"></canvas>
    </div>
</template>
<style scoped>
.view-frame{
    border: 1px solid #ccc;
}
</style>