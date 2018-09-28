<template>
  <div id="accessCodeContainer">
    <div id="accessCodeForm">
      <h4>Create new admin account</h4>
      <b-alert :show="shouldShowError" id="accessCodeError" variant="danger">{{errorMessage}}</b-alert>
      <b-form-input v-if="cachedEmail == null || cachedEmail == ''" v-model="email" placeholder="email" type="email" class="textInput"/>
      <div v-else v-b-tooltip.hover title="Your email address has been pre-assigned.">
        <b-form-input disabled v-model="cachedEmail" class="textInput" />
      </div>
      <b-form-input v-model="password" placeholder="password" type="password" class="textInput"/>
      <LoadingButton :is-loading="isLoading" id="accessCodeButton" class="accessCodeButton" @click="onSubmit()" variant="primary" title="Continue"/>
    </div>
  </div>
</template>

<script>
  import LoadingButton from '../../components/LoadingButton';
  import API from '../../API.js';
  export default {
    name: "SignUpAdmin",
    components: {LoadingButton},
    data: function() {
      return {
        API: API,
        isLoading: false,
        shouldShowError: false,
        errorMessage: "",
        accessCode: "",
        cachedEmail: "",
        password: "",
        email: ""
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

        API.signUp(self.cachedEmail == "" ? self.email : self.cachedEmail,
          self.password, self.accessCode, {})
          .then(result => {
            self.$router.push({path: '/dashboard'});
          })
          .catch(error => {
            self.errorMessage = error.message;
            self.shouldShowError = true;
          });
      }
    },
    mounted: function() {
      var accessCode = sessionStorage.getItem('accessCode');
      if (accessCode == null || accessCode == '') {
        this.$router.replace({name: "AccessCode"});
      }
      else {
        this.accessCode = sessionStorage.getItem('accessCode');
        this.cachedEmail = sessionStorage.getItem('cachedEmail');
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
  h4 {
    padding-bottom: 50px;
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
  }
</style>
