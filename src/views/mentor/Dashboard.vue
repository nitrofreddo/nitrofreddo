<template>
  <b-card id="dashboardContainer" no-body>
    <b-tabs card>
      <b-tab class="flowTab" title="Matches" active>
        <LoadingScreen v-if="isLoading" />
        <div v-else>
          <b-alert v-if="objects.length == 0" show>No matches yet! We'll let you know when you've been matched with a mentee.</b-alert>
          <b-card class="menteeCard" v-else v-for="menteeObj in objects" :key="menteeObj.id">
            <div class="cardHeader">
              <h3>{{menteeObj.firstName + ' ' + menteeObj.lastName}}</h3>
            </div>
            <div class="cardSection">
              <h5>Major</h5>
              <b-badge pill class="mentorBadge" variant="info">{{menteeObj.major}}</b-badge>
            </div>
            <div class="cardSection">
              <h5>Phone</h5>
              <b-badge pill class="mentorBadge" variant="info">{{menteeObj.phone}}</b-badge>
            </div>
            <div class="cardSection">
              <h5>LinkedIn</h5>
              <b-badge pill class="mentorBadge" variant="info">{{menteeObj.linkedIn}}</b-badge>
            </div>
          </b-card>
        </div>
      </b-tab>
      <!--<b-tab title="My Profile">-->
      <!--</b-tab>-->
    </b-tabs>
  </b-card>
</template>

<script>
  import API from "../../API.js";
  import LoadingScreen from "../../components/LoadingScreen";
  export default {
    name: "MentorDashboard",
    components: {LoadingScreen},
    data() {
      return {
        API: API,
        isLoading: false,
        objects: []
      }
    },
    mounted() {
      var self = this;
      self.isLoading = true;
      API.getMatches()
        .then(result => {
          self.objects = result;
          self.isLoading = false;
        });
    }
  }
</script>

<style scoped>
  #dashboardContainer {
    margin: 20px;
  }
  .flowTab {
    display: flex;
    flex-flow: row wrap;
  }
  .menteeCard {
    width: 400px;
    margin: 20px;
  }
  .cardSection {
    padding: 10px;
    text-align: left;
  }
  .cardHeader {
    padding-bottom: 20px;
  }
  .mentorBadge {
    margin: 2px;
    padding: 10px 15px 10px 15px;
  }
</style>
