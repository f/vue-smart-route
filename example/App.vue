<template>
  <div>
    <input type="text" v-model='query' v-smart-routes='routes'>
    <ul>
      <li @click='route.handler' v-for='route in routes' :key='route.name + Math.random()' v-html='route.title' />
    </ul>
    <hr>
    <h4>Router View:</h4>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      routes: []
    }
  }
}
</script>
