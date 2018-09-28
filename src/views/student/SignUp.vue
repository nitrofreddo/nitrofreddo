<template>
  <div id="signupContainer">
    <div class="signupSection">
      <h1>Basic information</h1>
    </div>
    <div id="signupForm">
      <div class="signupSection">
        <h4>Email</h4>
        <b-form-input v-if="cachedEmail == null || cachedEmail == ''" v-model="email" type="email" class="signupItem"/>
        <div v-else v-b-tooltip.hover title="Your email address has been pre-assigned.">
          <b-form-input disabled v-model="cachedEmail" class="textInput" />
        </div>
      </div>
      <div class="signupSection">
        <h4>Password</h4>
        <b-form-input v-model="password" type="password" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Re-enter Password</h4>
        <b-form-input v-model="passwordReenter" type="password" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>First name</h4>
        <b-form-input v-model="firstName"  type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Last name</h4>
        <b-form-input v-model="lastName" type="text" class="signupItem"/>
      </div>
      <div class="signupSection">
        <h4>Date of birth</h4>
        <div class="dateSection">
          <b-form-select id="month" class="mb-3" value="default">
            <option value="default" disabled>Month</option>
            <option v-for="month in months" :key="month">{{month}}</option>
          </b-form-select>
          <b-form-select id="day" class="mb-3" value="default">
            <option value="default" disabled>Day</option>
            <option v-for="day in 31" :key="day">{{day}}</option>
          </b-form-select>
          <b-form-select id="year" class="mb-3" value="default">
            <option value="default" disabled>Year</option>
            <option v-for="year in 77" :key="year">{{1939 + year}}</option>
          </b-form-select>
        </div>
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
        <h4>LinkedIn profile URL (optional)</h4>
        <b-form-input v-model="linkedIn" type="text" class="signupItem"/>
      </div>
      <div class="footerSection">
        <b-alert :show="shouldShowError" variant="danger">{{errorMessage}}</b-alert>
        <LoadingButton :is-loading="isLoading" id="continueButton" title="Submit" variant="primary" @click="onSubmit()" />
      </div>
    </div>
  </div>
</template>

<script>
  import API from '../../API.js';
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "SignUpStudent",
    components: {LoadingButton},
    data() {
      return {
        API: API,
        isLoading: false,
        shouldShowError: false,
        errorMessage: "",
        accessCode: "",
        cachedEmail: "",
        password: "",
        passwordReenter: "",
        firstName: "",
        lastName: "",
        major: "",
        phone: "",
        linkedIn: "",
        email: "",
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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

        self.isLoading = true;

        var accessCode = sessionStorage.getItem('accessCode');

        this.shouldShowError = false;

        if (self.email == "") {
          self.showError("Enter email");
        }
        else if (self.password == "") {
          self.showError("Enter password");
        }
        else if (self.passwordReenter != self.password) {
          self.showError("Passwords do not match");
        }
        else if (self.firstName == "") {
          self.showError("Enter first name");
        }
        else if (self.lastName == "") {
          self.showError("Enter last name");
        }
        else if (month.value == "default" || day.value == "default" || year.value == "default") {
          self.showError("Enter a valid birth date");
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
            birthday: month.value + " " + day.value + " " + year.value,
            major: self.major,
            phone: self.phone,
            linkedIn: self.linkedIn
          };
          API.signUp(self.email, self.password, accessCode, data)
            .then(result => {
              self.$router.push({path: '/dashboard'});
            })
            .catch(error => {
              self.showError(error.message);
            });
        }
      },
      mounted: function () {
        var accessCode = sessionStorage('accessCode');

        if (accessCode == null || accessCode == '') {
          this.$router.replace({name: "AccessCode"});
        }
        else {
          this.accessCode = sessionStorage.getItem('accessCode');
          this.cachedEmail = sessionStorage.getItem('cachedEmail');
        }
      }
    }
  }
</script>

<style scoped>
  #day {
    flex-grow: 1;
    margin-left: 10px;
    margin-right: 10px;
  }
  #month {
    flex-grow: 2;
  }
  #year {
    flex-grow: 1;
  }
  #signupContainer {
    padding: 20px;
    width: 100%;
    max-width: 610px;
  }
  #continueButton {
    padding: 10px;
    width: 30%;
  }
  .dateSection {
    display: flex;
    flex-direction: row;
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
