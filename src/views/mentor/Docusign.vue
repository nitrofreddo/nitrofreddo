<template>
    <b-card id="frameContainer">
      <h4>
        To continue, sign the form below and click Continue
      </h4>
      <iframe id="docusignFrame" src="https://demo.docusign.net/MEMBER/PowerFormSigning.aspx?PowerFormId=ac940fc6-f585-43f5-82a4-526138771d8a"/>
      <b-button id="nextButton" variant="primary" @click.prevent="nextButtonPressed()">Next</b-button>
    </b-card>
</template>

<script>
  export default {
    name: "Docusign",
    methods: {
      nextButtonPressed() {
        this.$router.push({path: '/confirmation'});
      }
    }
  }
</script>

<style scoped>
  #frameContainer {
    margin: 20px;
  }
  #docusignFrame {
    width: 100%;
    height: 500px;
  }
  #nextButton {
    margin: 20px;
    padding: 8px 40px 8px 40px;
  }
</style>
