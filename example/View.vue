<template>
  <div>
    <pre>{{ JSON.stringify({
      name: $route.name,
      path: $route.path,
      query: $route.query,
      params: $route.params
    }, null, 2) }}</pre>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$route)
  }
}
</script>


<style>
pre {
  background-color: #ddd;
  padding: 10px;
  border-radius: 5px;
  font-family: Menlo, 'Courier New', Courier, monospace;
}
</style>
