<template>
  <LoadingScreen v-if="!isLoaded" />
  <b-jumbotron v-else header="Welcome!" class="jumbotronContainer">
    <div class="textContainer">
      <b-img src="/static/skills-that-shine-square-text_higha.png" class="logoImage"></b-img>
      <p class="textItem">
        Skills that Shine (StS) is the Washington State Opportunity Scholarship (WSOS)’s professional development mentorship program.
      </p>
      <p class="textItem">
        StS empowers Opportunity Scholars to be confident in today’s high-demand job market by developing career-readiness skills and tools through mentorship.
      </p>
      <p class="textItem">
        <i>
          “This is a great opportunity for both the mentee and mentor. I wish this program would have been around when I was finishing school!” – Jake, StS mentor
        </i>
      </p>
      <p class="textItem">
        <i>
          “This program has really helped me to grow and to learn about my goals.” – Kamola, StS mentee
        </i>
      </p>
    </div>
    <b-btn v-if="!API.loggedIn()" variant="primary" :to="{name: 'Login'}">Login</b-btn>
    <b-btn v-else variant="primary" :to="{name: 'Home'}">Go to Dashboard</b-btn>
  </b-jumbotron>
</template>

<script>
  import API from "../API.js";
  import LoadingScreen from "../components/LoadingScreen";
  export default {
    name: "About",
    components: {LoadingScreen},
    data() {
      return {
        API: API,
        isLoaded: false
      }
    },
    mounted() {
      var self = this;
      var unsubscribe = API.registerLoginListener(user => {
        if (user) { self.$router.replace('Dashboard'); }
        else { self.isLoaded = true; }
        unsubscribe();
      })
    }
  }
</script>

<style scoped>
  .textContainer {
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }
  .textItem {
    padding: 10px;
  }
  .logoImage {
    width: 214px;
    height: 200px;
  }
</style>
