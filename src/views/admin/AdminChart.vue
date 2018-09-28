<template>
  <div>
    <LoadingScreen v-if="isLoading" />
    <div v-else>
      <b-alert show v-if="admins.length == 0">No Admins</b-alert>
      <b-table v-else striped bordered :items="admins" :fields="fields" class="dataTable">
        <template slot="actions" slot-scope="row">
          <LoadingButton class="deleteButton" variant="danger" @click="deleteUser(row.item.uid); row.item.isLoading = true" title="Delete" :is-loading="row.item.isLoading" />
        </template>
        <template slot="created on" slot-scope="row">
          {{row.item.metadata.creationTime}}
        </template>
        <template slot="last logged in" slot-scope="row">
          {{row.item.metadata.lastSignInTime}}
        </template>
      </b-table>
      <div class="buttonContainer">
        <LoadingButton class="bottomButton" variant="primary" @click="refreshAdmins(false)" title="Reload" :is-loading="isRefreshing" />
      </div>
    </div>
  </div>
</template>

<script>
  import API from '../../API.js'
  import LoadingScreen from "../../components/LoadingScreen";
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "AdminChart",
    components: {LoadingButton, LoadingScreen},
    data() {
      return {
        API: API,
        admins: [],
        isLoading: false,
        isRefreshing: false,
        fields: [
          { key: 'email', sortable: true },
          'created on',
          'last logged in',
          'actions'
        ]
      }
    },
    methods: {
      refreshAdmins(showLoader) {
        var self = this;

        self.isLoading = showLoader;
        self.isRefreshing = true;
        API.getAdmins().then(admins => {
          admins.forEach(admin => { admin.isLoading = false; });
          self.admins = admins;
          self.isLoading = false;
          self.isRefreshing = false;
        });
      },
      deleteUser(id) {
        var self = this;

        API.deleteUser(id)
          .then(() => {
            self.refreshAdmins(false);
          })
          .catch(error => {
            console.log(error);
          });
      },
      setup() {
        this.refreshAdmins(true);
      }
    }
  }
</script>

<style scoped>
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
