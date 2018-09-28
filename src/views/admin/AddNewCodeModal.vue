<template>
  <b-modal ref="modal" id="addNewModal" title="Generate Access Codes">
    <div class="container-row">
      <h5 class="container-item">Role: </h5>
      <b-form-select class="container-item" v-model="selected" :options="types" />
    </div>
    <div class="container-list">
      <div v-for="model in models" class="codeCell">
        <b-form-input type="text" class="container-item" placeholder="Access Code" v-model="model.code"> </b-form-input>
        <b-form-input type="email" class="container-item" placeholder="Email" v-model="model.email"> </b-form-input>
      </div>
    </div>
    <div class="container-row">
      <b-button variant="success" class="container-item segmentedButton" @click.prevent="plusButtonClicked()">Add</b-button>
      <b-button variant="danger" class="container-item segmentedButton" @click.prevent="minusButtonClicked()" :disabled="this.models.length <= 1">Remove</b-button>
      <b-button variant="info" class="container-item segmentedButton" v-b-toggle.pasteView>Paste Tool</b-button>
    </div>

    <b-collapse id="pasteView">
      <div id="pasteTextArea">
        <b-form-textarea v-model="pastedText" placeholder="Paste email addresses from a list or Excel sheet..." :rows="6"></b-form-textarea>
        <b-button id="fillButton" variant="info" @click.prevent="parsePastedText()">Fill</b-button>
      </div>
    </b-collapse>

    <div slot="modal-footer">
      <LoadingButton id="submitButton" variant="primary" class="submitButton" @click="sendButtonClicked()" title="Generate" :is-loading="isLoading" />
    </div>
  </b-modal>
</template>

<script>
  import LoadingButton from "../../components/LoadingButton";
  import API from "../../API.js";
  export default {
    name: "AddNewCodeModal",
    components: {LoadingButton},
    data() {
      return {
        API: API,
        models: [],
        types: ["mentor", "student", "admin"],
        selected: "mentor",
        isLoading: false,
        pastedText: ""
      }
    },
    methods: {
      randomString() {
        var chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        var string_length = 6;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
      },
      plusButtonClicked() {
        this.models.push({
          code: this.randomString(),
          email: ""
        });
      },
      minusButtonClicked() {
        if (this.models.length > 1) {
          this.models.pop();
        }
      },
      parsePastedText() {
        var self = this;
        var emails = this.pastedText.split(',');
        emails = this.pastedText.split('\n');
        emails = emails.map(string => { return string.trim(); });
        emails.forEach(email => {
          if (email != "") {
            var lastModel = self.models[self.models.length-1];
            if (lastModel.email == "") { lastModel.email = email; }
            else {
              self.models.push({
                code: self.randomString(),
                email: email
              });
            }
          }
        });
      },
      sendButtonClicked() {
        var self = this;

        self.isLoading = true;

        API.generateAccessCodes(self.selected, self.models, result => {
          self.models = [{
            code: self.randomString(),
            email: ""
          }];
          self.isLoading = false;
          self.$refs.modal.hide();
          self.$parent.refreshAccessCodes();
        });
      }
    },
    mounted() {
      this.models.push({
        code: this.randomString(),
        email: ""
      });
    }
  }
</script>

<style scoped>
  .codeCell {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
  .container-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  .container-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
  }
  .container-item {
    margin: 5px;
  }
  .segmentedButton {
    flex: 1;
  }
  .submitButton {
    width: 120px;
    margin: 5px;
  }
  #pasteView {
    display: flex;
    flex-direction: column;
  }
  #pasteTextArea {
    margin: 30px 5px 10px 5px;
  }
  #fillButton {
    margin-top: 30px;
    width: 100%;
  }
</style>
