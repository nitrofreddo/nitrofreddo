<template>
  <LoadingScreen v-if="!isLoaded" />
  <StudentDashboard :objects="objects" v-else-if="userType == 'student'" />
  <MentorDashboard :objects="objects" v-else-if="userType == 'mentor'" />
  <AdminDashboard :objects="objects" v-else-if="userType == 'admin'" />
</template>

<script>
  import LoadingScreen from "../components/LoadingScreen";
  import StudentDashboard from "./student/Dashboard";
  import MentorDashboard from "./mentor/Dashboard";
  import AdminDashboard from "./admin/Dashboard";
  import API from "../API.js";
  export default {
    name: "Dashboard",
    components: {AdminDashboard, MentorDashboard, StudentDashboard, LoadingScreen},
    data: function () {
      return {
        isLoaded: false,
        API: API,
        objects: [],
        userType: ""
      }
    },
    mounted() {
      var self = this;
      if (API.loggedIn()) {
        API.getCurrentUser()
          .then(user => {
            self.userType = user.role;
            self.isLoaded = true;
          });
      }
      else {
        self.$router.replace({name: "Home"});
      }
    },

  }
</script>

<style scoped>

</style>
