<template>
  <div id="app">
    <header>
      <input placeholder="search or run something..." type="text" v-model='query' v-smart-routes='routes'>
      <p>You can write <b>about</b>, <b>search: {query}</b>, <b>user {username}</b>, <b>user {id}</b>, <b>user {username} {id}</b> or <b>a mail address and the subject</b>, also <b>async {query}</b> will return an async response.</p>
    </header>
    <nav>
      <ul v-if='routes.length'>
        <li @click='route.handler' v-for='route in routes' :key='route.name + Math.random()' v-html='route.title' />
      </ul>
      <div v-else>
        ...
      </div>
    </nav>
    <main>
      <router-view></router-view>
    </main>
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

#app {
  display: grid;
  grid-template-areas:
    "header header"
    "nav main";
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-gap: 0 20px;
}

header {
  grid-area: header;
}

nav {
  grid-area: nav;
}

main {
  grid-area: main;
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
}

li {
  display: block;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

li:hover {
  background-color: #eee;
}

mark {
  background-color: transparent;
  color: #222;
  padding: 2px 0;
  border-bottom: 4px dotted #888;
  font-weight: bold;
}
</style>
