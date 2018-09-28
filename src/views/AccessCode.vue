<template>
  <div id="accessCodeContainer">
    <div id="accessCodeForm">
      <div id="accessCodeMessage">
        <h5>Sign Up</h5>
        Enter the access code you received from us in your email.
      </div>
      <b-alert :show="shouldShowError" id="accessCodeError" variant="danger">{{errorMessage}}</b-alert>
      <b-form-input v-model="accessCode" required placeholder="access code" type="password" class="textInput" :disabled="isLoading" />
      <LoadingButton :is-loading="isLoading" id="accessCodeButton" class="accessCodeButton" @click="onSubmit()" variant="primary" title="Continue"/>
    </div>
  </div>
</template>

<script>
  import API from '../API.js'
  import LoadingButton from "../components/LoadingButton";
  export default {
    name: "AccessCode",
    components: {LoadingButton},
    data: function() {
      return {
        isLoading: false,
        shouldShowError: false,
        errorMessage: "",
        accessCode: ""
      }
    },
    methods: {
      showError(message) {
        this.isLoading = false;
        this.shouldShowError = true;
        this.errorMessage = message;

        this.accessCode = "";
      },
      onSubmit() {
        var self = this;

        self.isLoading = true;
        self.shouldShowError = false;

        API.getAccessCode(this.accessCode)
          .then(obj => {
            if (obj == null) {
              self.showError("Access code not found");
            } else if (obj.claimed === true) {
              self.showError("Access code already used");
            } else {
              var role = obj.role;

              if (role === "student") {
                self.$router.push({name: "SignUpStudent"});
                sessionStorage.setItem("accessCode", obj.code);
                sessionStorage.setItem("cachedEmail", obj.email);
              } else if (role === "mentor") {
                self.$router.push({name: "SignUpMentor"});
                sessionStorage.setItem("accessCode", obj.code);
                sessionStorage.setItem("cachedEmail", obj.email);
              } else if (role === "admin") {
                self.$router.push({name: "SignUpAdmin"});
                sessionStorage.setItem("accessCode", obj.code);
                sessionStorage.setItem("cachedEmail", obj.email);
              } else {
                self.showError("Invalid access code");
              }
            }
          })
          .catch(error => {
            self.showError(error.message);
          })
          .finally(()=> {
            self.isLoading = false;
          });
      }
    },
    mounted: function() {
      sessionStorage.removeItem("accessCode");
      sessionStorage.removeItem("cachedEmail");

      const accessCode = this.$route.params.accessCode;

      if (accessCode != null && accessCode != "") {
        this.accessCode = accessCode;
        this.onSubmit();
      }
    }
  }
</script>

<style scoped>
  #accessCodeContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  #accessCodeForm {
    max-width: 300px;
    width: 80%;
  }
  #accessCodeMessage {
    margin-bottom: 30px;
  }
  #accessCodeError {
    padding: 10px;
  }
  .textInput {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .accessCodeButton {
    flex: 1;
    width: 100%;
    margin-top: 10px;
  }
</style>
