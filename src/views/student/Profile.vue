<template>
  <LoadingScreen v-if="isLoading" />
  <div v-else>
    <div id="signupContainer">
      <div class="signupSection">
        <h4>First name</h4>
        <b-form-input v-model="firstName"  type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Last name</h4>
        <b-form-input v-model="lastName" type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Birthday</h4>
        <b-form-input disabled v-model="birthday" type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Major</h4>
        <b-form-input v-model="major" type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Phone</h4>
        <b-form-input v-model="phone" type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>LinkedIn</h4>
        <b-form-input v-model="linkedIn" type="text" class="signupItem"/>
      </div>
      <div class="footerSection">
        <b-alert :show="shouldShowError" variant="danger">{{errorMessage}}</b-alert>
        <LoadingButton :is-loading="isLoading" id="continueButton" title="Update Profile" variant="primary" @click="onSubmit()" />
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../../API.js";
  import LoadingScreen from "../../components/LoadingScreen";
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "StudentProfile",
    components: {LoadingScreen,LoadingButton},
    data() {
      return {
        API: API,
        isLoading: false,
        firstName: "",
        lastName: "",
        major: "",
        phone: "",
        linkedIn: "",
        birthday: "",
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        errorMessage: "",
        shouldShowError: false
      }
    },
    methods: {
      showError(message) {
        this.isLoading = false;
        this.shouldShowError = true;
        this.errorMessage = message;
      },
      onSubmit() {
        var self = this;

        this.shouldShowError = false;

        if (self.firstName == "") {
          self.showError("Enter first name");
        }
        else if (self.lastName == "") {
          self.showError("Enter last name");
        }
        else if (self.major == "") {
          self.showError("Enter major");
        }
        else if (self.phone == "") {
          self.showError("Enter phone");
        }
        else {
          var data = {
            firstName: self.firstName,
            lastName: self.lastName,
            birthday: self.birthday,
            major: self.major,
            phone: self.phone,
            linkedIn: self.linkedIn
          };
          self.isLoading = true;
          API.updateProfile(data)
            .then(result => {
              self.isLoading = false;
              console.log(result);
            })
            .catch(error => {
              self.showError(error.message);
            });
        }
      }
    },
    mounted() {
      var self = this;

      self.isLoading = true;
      API.getCurrentUser()
        .then(user => {
          self.isLoading = false;
          self.firstName = user.firstName;
          self.lastName = user.lastName;
          self.birthday = user.birthday;
          self.major = user.major;
          self.phone = user.phone;
          self.linkedIn = user.linkedIn;
        });
    }
  }
</script>

<style scoped>
  #signupContainer {
    padding: 20px;
    width: 100%;
    max-width: 610px;
    text-align: left;
  }
  .signupSection {
    display: block;
    text-align: left;
    padding: 10px;
  }
  .footerSection {
    display: block;
    text-align: left;
    padding: 20px 10px;
  }
</style>
