<template>
  <div id="confirmationContainer">
    <div id="messageContainer">
      <div class="confirmationItem">
        <h2>Registration Complete</h2>
      </div>
      <div class="confirmationItem">
        <h5>You have taken an important step in your STEM education. Now, click the button below and find a mentor for yourself! Don't have time now? Come back later!</h5>
      </div>
      <b-btn id="continueButton" variant="primary" :to="{name: 'Dashboard'}">View Mentors</b-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ConfirmationStudent"
  }
</script>

<style scoped>
  #continueButton {
    margin-top: 20px;
    padding: 10px;
    width: 30%;
  }
  #confirmationContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  #messageContainer {
    max-width: 600px;
  }
  .confirmationItem {
    padding: 10px;
    text-align: left;
  }
</style>
