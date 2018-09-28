<template>
  <b-card id="frameContainer">
    <div id="textContainer">
      <h1>
        Confirmation
      </h1>
      <p>
        Thank you for signing up to be a Skills that Shine (StS) mentor with the Washington State Opportunity Scholarship (WSOS)! Please check your email for next steps.
        If you have any questions, please reach out to Hannah Olson at skillsthatshine@waopportunityscholarship.org.
      </p>
      <b-img src="/static/skills-that-shine-square-text_higha.png" class="logoImage"></b-img>
    </div>
    <b-button id="nextButton" variant="primary" @click.prevent="nextButtonPressed()">Finish</b-button>
  </b-card>
</template>

<script>
  export default {
    name: "Confirmation",
    methods: {
      nextButtonPressed() {
        this.$router.push({path: '/dashboard'});
      }
    }
  }
</script>

<style scoped>
  #textContainer {
    width: 80%;
    margin: 0 auto;
  }
  #frameContainer {
    margin: 20px;
  }
  #nextButton {
    margin: 20px;
    padding: 8px 40px 8px 40px;
  }
  .logoImage {
    width: 214px;
    height: 200px;
  }
</style>
