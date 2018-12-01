<template>
  <div>
    <input type="text" v-model='search' v-smart-results='results'>
    <ul>
      <li @click='result.handler' v-for='result in results' :key='result.name' v-html='result.title' />
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
      search: '',
      results: []
    }
  }
}
</script>
