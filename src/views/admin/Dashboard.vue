<template>
  <b-card id="dashboardContainer" no-body>
    <b-tabs card v-on:input="tabBecameVisible">
      <b-tab title="Mentors">
        <MentorChart ref="mentorChart" />
      </b-tab>
      <b-tab title="Mentees">
        <StudentChart ref="studentChart" />
      </b-tab>
      <b-tab title="Matches">
        <MatchChart ref="matchChart" />
      </b-tab>
      <b-tab title="Admins">
        <AdminChart ref="adminChart" />
      </b-tab>
      <b-tab title="Access Codes">
        <AccessCodes ref="codeChart" />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import MentorChart from './MentorChart'
  import StudentChart from './StudentChart'
  import LoadingScreen from "../../components/LoadingScreen";
  import MatchChart from "./MatchChart";
  import AccessCodes from "./AccessCodes";
  import AdminChart from "./AdminChart";

  export default {
    name: "AdminDashboard",
    components: {
      AccessCodes,
      MatchChart,
      LoadingScreen,
      MentorChart,
      StudentChart,
      AdminChart
    },
    methods: {
      tabBecameVisible(index) {
        switch(index) {
          case 0: this.$refs.mentorChart.setup();
            break;
          case 1: this.$refs.studentChart.setup();
            break;
          case 2: this.$refs.matchChart.setup();
            break;
          case 3: this.$refs.adminChart.setup();
            break;
          case 4: this.$refs.codeChart.setup();
          default: break;
        }
      }
    }
  }
</script>

<style scoped>
  #dashboardContainer {
    margin: 20px;
  }
</style>
