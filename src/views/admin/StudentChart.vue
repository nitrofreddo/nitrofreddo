<template>
  <div class="chartContainer">
    <LoadingScreen v-if="isLoading" />
    <div v-else>
      <b-alert show v-if="students.length == 0">No Mentees</b-alert>
      <b-table v-else striped bordered :items="students" :fields="fields" class="dataTable">
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
        <LoadingButton class="bottomButton" variant="primary" @click="refreshStudents(false)" title="Reload" :is-loading="isRefreshing" />
        <b-button class="bottomButton" variant="primary" @click.prevent="download()">Download</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '../../API.js'
  import LoadingScreen from "../../components/LoadingScreen";
  import LoadingButton from "../../components/LoadingButton";
  import StudentEditModal from "./StudentEditModal";
  const ObjectsToCsv = require('objects-to-csv');
  export default {
    name: "StudentChart",
    components: {LoadingButton, LoadingScreen},
    data() {
      return {
        API: API,
        students: [],
        isLoading: false,
        isRefreshing: false,
        fields: [
          { key: 'name', sortable: true},
          { key: 'email', sortable: true },
          { key: 'phone', sortable: false },
          { key: 'birthday', sortable: true },
          { key: 'major', sortable: true },
          { key: 'linkedIn', label: 'LinkedIn Profile', sortable: false },
          'actions'
        ]
      }
    },
    methods: {
      refreshStudents(showLoader) {
        var self = this;

        self.isLoading = showLoader;
        self.isRefreshing = true;
        API.getStudents().then(students => {
          students.forEach(student => { student.isLoading = false; });
          self.students = students;
          self.isLoading = false;
          self.isRefreshing = false;
        });
      },
      deleteUser(id) {
        var self = this;

        API.deleteUser(id)
          .then(() => {
            self.refreshStudents(false);
          })
          .catch(error => {
            console.log(error);
          });
      },
      setup() {
        this.refreshStudents(true);
      },
      download() {
        let csv = new ObjectsToCsv(this.students);

        csv.toString().then(result => {
          API.download("mentees.csv", result);
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
