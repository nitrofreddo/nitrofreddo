<template>
  <ConfirmationStudent v-if="confirmationType == 'student'" />
  <ConfirmationMentor v-else-if="confirmationType == 'mentor'" />
</template>

<script>
  import ConfirmationStudent from "./student/Confirmation";
  import ConfirmationMentor from "./mentor/Confirmation";
  export default {
    name: "Confirmation",
    components: {ConfirmationMentor, ConfirmationStudent},
    computed: {
      confirmationType: function() {
        return localStorage.getItem('confirmationType');
      }
    },
    mounted: function() {
      if (this.confirmationType != 'student' && this.confirmationType != 'mentor') {
        this.$router.replace({name: "Home"});
      }
    }
  }
</script>

<style scoped>
</style>
