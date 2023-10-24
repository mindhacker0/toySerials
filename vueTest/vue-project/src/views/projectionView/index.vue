<script setup>
import { useProjection } from '@/game/flysimulate';
const {viewRef} = useProjection();
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