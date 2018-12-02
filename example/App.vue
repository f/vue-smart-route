<template>
  <div>
    <input placeholder="search or run something..." type="text" v-model='query' v-smart-routes='routes'>
    <ul>
      <li @click='route.handler' v-for='route in routes' :key='route.name + Math.random()' v-html='route.title' />
    </ul>
    <hr>
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

<style>
body {
  padding: 20px;
}
* {
  font-family: Avenir, sans-serif;
}
input {
  font-size: 1.5rem;
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgb(230, 230, 230);
  outline: none;
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding: 0;
  background-color: rgb(250, 250, 250);
  border-radius: 5px;
  padding: 10px;
}

li {
  display: block;
  margin: 4px;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 4px;
}

li:hover {
  background-color: pink;
}

mark {
  background-color: red;
  color: #fff;
  display: inline-block;
  padding: 2px 5px;
  border-radius: 3px;
}
</style>
