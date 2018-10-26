<template>
  <div class="chartContainer">
    <LoadingScreen v-if="isLoading" />
    <div v-else>
      <b-alert show v-if="mentors.length == 0">No Mentors</b-alert>
      <b-table v-else striped bordered :items="mentors" :fields="fields" class="dataTable">
        <template slot="name" slot-scope="row">
          {{row.item.firstName}} {{row.item.lastName}}
        </template>
        <template slot="actions" slot-scope="row">
          <LoadingButton class="deleteButton" variant="danger" @click="deleteUser(row.item.uid); row.item.isLoading = true" title="Delete" :is-loading="row.item.isLoading" />
        </template>
        <template slot="pronoun" slot-scope="row">
          {{pronounLocalization(row.item.pronoun)}}
        </template>
      </b-table>
      <div class="buttonContainer">
        <LoadingButton class="bottomButton" variant="primary" @click="refreshMentors(false)" title="Reload" :is-loading="isRefreshing" />
        <b-button class="bottomButton" variant="primary" @click.prevent="download()">Download</b-button>
      </div>
    </div>
  </div>
  <!--<div>-->
    <!--<b-table striped bordered fixed :items="objects" :fields="mentorFields" class="dataTable">-->
      <!--<template slot="actions" slot-scope="row">-->
        <!--<b-button variant="primary" v-b-modal.mentorModal>Edit Profile</b-button>-->
      <!--</template>-->
    <!--</b-table>-->

    <!--<MentorEditModal />-->
  <!--</div>-->
</template>

<script>
  import API from '../../API.js';
  import LoadingScreen from "../../components/LoadingScreen";
  import LoadingButton from "../../components/LoadingButton";
  import MentorEditModal from "./MentorEditModal";

  const ObjectsToCsv = require('objects-to-csv');

  export default {
    name: "MentorChart",
    components: {LoadingButton, LoadingScreen},
    data() {
      return {
        API: API,
        mentors: [],
        isLoading: false,
        isRefreshing: false,
        fields: [
          { key: 'name', sortable: true},
          { key: 'email', sortable: true },
          { key: 'phone', sortable: false },
          { key: 'pronoun', sortable: true },
          { key: 'canMentorCount', label: 'Available Slots', sortable: true },
          { key: 'employer', sortable: true },
          { key: 'jobTitle', sortable: true },
          'actions'
        ]
      }
    },
    methods: {
      refreshMentors(showLoader) {
        var self = this;

        self.isLoading = showLoader;
        self.isRefreshing = true;
        API.getMentors().then(mentors => {
          mentors.forEach(mentor => { mentor.isLoading = false; });
          self.mentors = mentors;
          self.isLoading = false;
          self.isRefreshing = false;
        });
      },
      pronounLocalization(input) {
        if (input === "hehimhis") { return "He/Him/His"; }
        else if (input === "sheherhers") { return "She/Her/Hers"; }
        else { return "They/Them/Theirs"; }
      },
      deleteUser(id) {
        var self = this;

        API.deleteUser(id)
          .then(() => {
            self.refreshMentors(false);
          }).catch(error => {
            console.log(error);
          });
      },
      setup() {
        this.refreshMentors(true);
      },
      download() {
        let csv = new ObjectsToCsv(this.mentors);

        csv.toString().then(result => {
          API.download("mentors.csv", result);
        });
      }
    }
  }
</script>

<style scoped>
  .chartContainer {
    overflow: scroll;
  }
  .deleteButton {
    width: 100px;
  }
  .buttonContainer {
    margin-top: 20px;
  }
  .bottomButton {
    margin: 10px;
    width: 150px;
  }
</style>
