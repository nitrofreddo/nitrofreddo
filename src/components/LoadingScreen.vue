<template>
  <div id="loadingContainer">
    <div id="spinnerContainer">
      <div class="spinner" >
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LoadingScreen"
  }
</script>

<style scoped>
  #loadingContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
  }
  #spinnerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
  }
</style>
