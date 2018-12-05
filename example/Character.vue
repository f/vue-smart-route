<template>
  <div v-if='!loading'>
    <pre>{{ JSON.stringify(person, null, 2) }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      person: {}
    }
  },
  watch: {
    async ['$route.params.id']() {
      await this.getUser()
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    async getUser () {
      this.loading = true
      this.person = await fetch(`https://swapi.co/api/people/${this.$route.params.id}/`).then(r => r.json())
      this.loading = false
    }
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
