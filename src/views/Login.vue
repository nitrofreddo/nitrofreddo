<template>
  <div id="loginContainer">
    <b-form id="loginForm" @submit="onSubmit">
      <div id="loginMessage">
        <h6>Welcome to the matching platform!</h6>
        Please sign in
      </div>
      <b-alert id="loginError" show variant="danger"></b-alert>
      <b-form-input id="email" required placeholder="email" type="email" class="textInput"/>
      <b-form-input id="password" required placeholder="password" type="password" class="textInput"/>
      <div class="buttonContainer">
        <b-button id="loginButton" class="loginButton" type="submit" variant="primary">
          <div id="loginButtonText">Login</div>
          <div id="loginSpinner" class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </b-button>
      </div>
      <b-button-toolbar class="buttonContainer">
        <b-button class="loginButton" :to="{name: 'AccessCode'}">Sign Up</b-button>
        <div id="buttonSeparator" />
        <b-button class="loginButton" :to="{name: 'ResetPassword'}">Forgot Password?</b-button>
      </b-button-toolbar>
    </b-form>
  </div>
</template>

<script>
  import API from "../API.js";
  import LoadingButton from "../components/LoadingButton";
  import '../css/custom.css';

  export default {
    name: "Login",
    components: {LoadingButton},
    methods: {
      showError(message) {
        loginButton.disabled = false;
        loginButtonText.style.display = "block";
        loginSpinner.style.display = "none";
        loginError.style.display = "block";
        loginError.innerHTML = message;
      },
      onSubmit(evt) {
        var self = this;

        evt.preventDefault();
        loginButton.disabled = true;
        loginButtonText.style.display = "none";
        loginSpinner.style.display = "block";
        loginError.style.display = "none";

        API.login(email.value, password.value, function(user, error) {
          if (user) {
            self.$router.replace('Dashboard');
          } else {
            self.showError(error.message);
          }
        })
      }
    },
    computed: {

    }
  }
</script>

<style scoped>
  #loginContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  #loginForm {
    max-width: 300px;
    width: 80%;
  }
  #loginMessage {
    margin-bottom: 30px;
  }
  .buttonContainer {
    display: flex;
    width: 100%;
    margin-top: 20px;
  }
  #buttonSeparator {
    width: 10px;
  }
  #loginSpinner {
    display: none;
  }
  #loginError {
    padding: 10px;
    display: none;
  }
  .textInput {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .loginButton {
    flex: 1;
  }
</style>
