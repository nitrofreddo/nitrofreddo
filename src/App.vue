<template>
  <div id="app">
    <b-navbar toggleable="md" variant="faded" type="light">
      <b-navbar-brand>
        <router-link :to="{name: 'Home'}">
          <b-img src="/static/hero.png" class="d-inline-block align-top heroimg" />
        </router-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item class="navlink" :to="{name: 'About'}">About</b-nav-item>
          <div v-if="API.loggedIn()" class="toolbarInner">
            <b-nav-item v-if="API.userType() == 'student'" class="navlink" :to="{name: 'Home'}">Match with Mentor</b-nav-item>
            <b-nav-item class="navlink" @click="logout()">Logout</b-nav-item>
          </div>
          <b-nav-item v-else class="navlink" :to="{name: 'Login'}">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
  import API from './API.js';

  export default {
    name: 'App',
    components: {},
    data() {
      return {
        API: API
      }
    },
    methods: {
      logout() {
        var self = this;
        API.logout(() => { self.$router.replace('About'); });
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .heroimg {
    height: 72px;
    width: 200px;
    padding: 10px;
  }
  .navlink {
    padding: 10px;
  }
  .toolbarInner {
    display: flex;
  }
</style>
