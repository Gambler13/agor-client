<template>
  <div id="app">
    <div class="title">AGOR</div>
    <Canvas/>
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue'

export default {
  name: 'App',
  components: {
    Canvas
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.title{
  font-size: 3em;
  font-weight: 900;
}
</style>
