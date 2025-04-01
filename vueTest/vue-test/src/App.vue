<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
     console.log(this)
  }
}
</script>

<style>
#cont {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  margin: 0;
  padding: 0;
  outline: none;
}
</style>
