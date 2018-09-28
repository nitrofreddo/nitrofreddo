<template>
  <About v-if="!API.loggedIn()" />
  <Dashboard v-else />
</template>

<script>
  import Dashboard from "./Dashboard";
  import About from './About';
  import API from "../API.js";

  export default {
    name: "Home",
    components: {Dashboard, About},
    data() {
      return {
        API: API
      }
    },
  }
</script>

<style scoped>

</style>
