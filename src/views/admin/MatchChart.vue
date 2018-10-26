<template>
  <div class="chartContainer">
    <LoadingScreen v-if="isLoading" />
    <div v-else>
      <b-table striped bordered :items="matches" :fields="fields" class="dataTable">
        <template slot="mentor" slot-scope="row">
          {{row.item.mentor.email}}
        </template>
        <template slot="mentees" slot-scope="row">
          {{emailsFromMentees(row.item.mentees)}}
        </template>
        <template slot="actions" slot-scope="row">
          <LoadingButton class="deleteButton" variant="danger" @click="deleteMatch(row.item.mentor.uid); row.item.isLoading = true" title="Delete" :is-loading="row.item.isLoading" />
        </template>
      </b-table>
      <div class="buttonContainer">
        <LoadingButton class="bottomButton" variant="primary" @click="refreshMatches(false)" title="Reload" :is-loading="isRefreshing" />
        <b-button class="bottomButton" variant="primary" @click.prevent="download()">Download</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../API";
  import LoadingScreen from "../../components/LoadingScreen";
  import LoadingButton from "../../components/LoadingButton";
  const ObjectsToCsv = require('objects-to-csv');

  export default {
    name: "MatchChart",
    components: {LoadingButton, LoadingScreen},
    data() {
      return {
        isLoading: false,
        isRefreshing: false,
        fields: [
          { key: 'mentor', sortable: true },
          { key: 'mentees', sortable: false },
          'actions'
        ],
        matches: []
      }
    },
    methods: {
      emailsFromMentees(mentees) {
        var emails = "";
        mentees.forEach(mentee => {
          if (mentee != null) {
            emails += " ";
            emails += mentee.email;
          }
        });
        return emails;
      },
      deleteMatch(id) {
        var self = this;

        console.log(id);

        API.deleteMatch(id)
          .then(() => {
            self.refreshMatches(false);
          }).catch(error => {
          console.log(error);
        });
      },
      refreshMatches(showLoader) {
        var self = this;

        self.isLoading = showLoader;
        self.isRefreshing = true;

        API.getAllMatches().then(matches => {
          self.matches = [];
          matches.forEach(match => {
            if (match != null) {
              match.isLoading = false;
              self.matches.push(match);
            }
          });
          self.isLoading = false;
          self.isRefreshing = false;
        });
      },
      setup() {
        this.refreshMatches(true);
      },
      download() {
        let csv = new ObjectsToCsv(this.matches);

        csv.toString().then(result => {
          API.download("matches.csv", result);
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
