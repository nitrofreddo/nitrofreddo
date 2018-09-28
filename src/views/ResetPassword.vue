<template>
  <div id="resetPasswordContainer">
    <div id="resetPasswordForm">
      <div id="resetPasswordMessage">
        <h5>Password Reset</h5>
        Enter your email to get a reset link:
      </div>
      <b-alert :show="showMessage" id="resetPasswordError" :variant="isError ? 'danger' : 'success'">{{message}}</b-alert>
      <b-form-input v-model="emailAddress" required placeholder="email" type="email" class="textInput" :disabled="isLoading" />
      <LoadingButton :is-loading="isLoading" id="resetPasswordButton" class="resetPasswordButton" @click="onSubmit()" variant="primary" title="Continue"/>
    </div>
  </div>
</template>

<script>
  import API from '../API.js'
  import LoadingButton from "../components/LoadingButton";
  export default {
    name: "ResetPassword",
    components: {LoadingButton},
    data: function() {
      return {
        isLoading: false,
        isError: false,
        showMessage: false,
        message: "",
        emailAddress: ""
      }
    },
    methods: {
      showError(message) {
        this.isLoading = false;
        this.isError = true;
        this.showMessage = true;
        this.message = message;

        this.emailAddress = "";
      },
      showSuccess(message) {
        this.isLoading = false;
        this.isError = false;
        this.showMessage = true;
        this.message = message;
      },
      onSubmit() {
        var self = this;

        self.isLoading = true;
        self.showMessage = false;

        API.sendPasswordResetEmail(this.emailAddress)
          .then(() => {
            self.showSuccess("Password reset email sent!");
          })
          .catch(error => {
            self.showError(error.message);
          });
      }
    },
  }
</script>

<style scoped>
  #resetPasswordContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  #resetPasswordForm {
    max-width: 300px;
    width: 80%;
  }
  #resetPasswordMessage {
    margin-bottom: 30px;
  }
  #resetPasswordError {
    padding: 10px;
  }
  .textInput {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .resetPasswordButton {
    flex: 1;
    width: 100%;
    margin-top: 10px;
  }
</style>
