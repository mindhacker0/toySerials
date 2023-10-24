<script setup>//setup语法糖
import { ref,provide,reactive } from "vue";
import {RouterLink,RouterView} from "vue-router";
</script>

<template>
  <div>
    <div>
      <div class="nav-menu">
        <div class="menu-item"><RouterLink to="/polygon">多边形</RouterLink></div>
        <div class="menu-item"><RouterLink to="/projection">透视投影</RouterLink></div> 
      </div>
      <div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-menu{
  display: flex;
  gap: 15px;
  place-items: center;
}
</style>
