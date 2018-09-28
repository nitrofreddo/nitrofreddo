<template>
  <div>
    <LoadingScreen v-if="isLoading" />
    <div v-else>
      <b-alert show v-if="accessCodes.length == 0">No Access Codes</b-alert>
      <b-table v-else striped bordered :items="accessCodes" :fields="fields" class="dataTable">
        <template slot="actions" slot-scope="row">
          <LoadingButton class="actionButton" variant="danger" @click="deleteAccessCode(row.item.id); row.item.isLoading = true" title="Delete" :is-loading="row.item.isLoading" />
        </template>
      </b-table>
      <div class="buttonContainer">
        <b-button class="bottomButton" v-b-modal.addNewModal variant="primary">Add New</b-button>
        <LoadingButton class="bottomButton" variant="primary" @click="refreshAccessCodes(false)" title="Reload" :is-loading="isRefreshing" />
        <b-button class="bottomButton" variant="primary" @click.prevent="download()">Download</b-button>
      </div>
      <AddNewCodeModal />
    </div>
  </div>
</template>

<script>
  import API from '../../API.js'
  import LoadingScreen from "../../components/LoadingScreen";
  import AddNewCodeModal from "./AddNewCodeModal";
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "AccessCodes",
    components: {LoadingButton, AddNewCodeModal, LoadingScreen},
    data() {
      return {
        API: API,
        accessCodes: [],
        isLoading: false,
        isRefreshing: false,
        fields: [
          { key: 'code', sortable: true },
          { key: 'role', sortable: true },
          { key: 'claimed', sortable: true },
          { key: 'email', sortable: true },
          'actions'
        ]
      }
    },
    methods: {
      refreshAccessCodes(showLoader) {
        var self = this;

        self.isLoading = showLoader;
        self.isRefreshing = true;
        API.getAccessCodes()
          .then(accessCodes => {
            accessCodes.forEach(accessCode => { accessCode.isLoading = false; });
            self.accessCodes = accessCodes;
            self.isLoading = false;
            setTimeout(() => { self.isRefreshing = false; }, 500);
          });
      },
      deleteAccessCode(id) {
        var self = this;

        API.deleteAccessCode(id, () => { self.refreshAccessCodes(false); });
      },
      setup() {
        this.refreshAccessCodes(true);
      },
      download() {
        let csv = new ObjectsToCsv(this.accessCodes);

        csv.toString().then(result => {
          API.download("accessCodes.csv", result);
        });
      }
    }
  }
</script>

<style scoped>
  .actionButton {
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
