<template>
  <div id="signupContainer">
    <div class="signupSection">
      <h1>Review</h1>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">First name</h4>
      <div v-if="model.firstName != ''" class="mentorBadge signupItem">{{model.firstName}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Last name</h4>
      <div v-if="model.lastName != ''" class="mentorBadge signupItem">{{model.lastName}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Email</h4>
      <div v-if="model.email != ''" class="mentorBadge signupItem">{{model.email}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Phone</h4>
      <div v-if="model.phone != ''" class="mentorBadge signupItem">{{model.phone}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Preferred Pronoun</h4>
      <div class="mentorBadge signupItem">{{pronoun(model.pronoun)}}</div>
      <b-alert v-if="model.pronoun=='none'" show variant="danger">None Selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Industry</h4>
      <div v-if="model.industry!=''" class="mentorBadge signupItem">{{model.industry}}</div>
      <b-alert v-else show variant="danger">None Selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Employer</h4>
      <div v-if="model.employer!=''" class="mentorBadge signupItem">{{model.employer}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Job Title</h4>
      <div v-if="model.jobTitle!=''" class="mentorBadge signupItem">{{model.jobTitle}}</div>
      <b-alert v-else show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Other Industries</h4>
      <div class="mentorBadge signupItem" v-for="industry in model.otherIndustries" :key="industry">{{industry}}</div>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Skills</h4>
      <div class="mentorBadge signupItem" v-for="skill in model.skills" :key="skill">{{skill}}</div>
      <b-alert v-if="model.skills.length==0" show variant="danger">Left blank</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">Existing Mentee</h4>
      <div v-if="model.hasMentee" pill variant="primary" class="mentorBadge signupItem">{{model.menteeFirstName + " " + model.menteeLastName}}</div>
      <div v-else pill variant="primary" class="mentorBadge signupItem">None</div>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I believe a good mentor interacts with their mentee by being: </h4>
      <div v-for="interaction in model.interactions" :key="interaction" pill variant="primary" class="mentorBadge signupItem">{{interaction}}</div>
      <b-alert v-if="model.interactions.length==0" show variant="danger">None selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I prefer to meet: </h4>
      <div v-for="meetingType in model.meetingTypes" :key="meetingType" pill variant="primary" class="mentorBadge signupItem">{{meetingType}}</div>
      <b-alert v-if="model.meetingTypes.length==0" show variant="danger">None selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I can mentor</h4>
      <div class="mentorBadge signupItem">{{model.canMentorCount + " Mentee(s)"}}</div>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I can share stories about:</h4>
      <div v-for="story in model.stories" :key="story" pill variant="primary" class="mentorBadge signupItem">{{story}}</div>
      <b-alert v-if="model.stories.length==0" show variant="danger">None selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I care about causes such as... </h4>
      <div v-for="cause in model.causes" :key="cause" pill variant="primary" class="mentorBadge signupItem">{{cause}}</div>
      <b-alert v-if="model.causes.length==0" show variant="danger">None selected</b-alert>
    </div>
    <div class="signupSection">
      <h4 class="signupItem">I am a:</h4>
      <div v-for="hobby in model.hobbies" :key="hobby" pill variant="primary" class="mentorBadge signupItem">{{hobby}}</div>
      <b-alert v-if="model.hobbies.length==0" show variant="danger">None selected</b-alert>
    </div>
    <div class="signupSection">
      <LoadingButton id="nextButton" :is-loading="isLoading" variant="primary" @click="nextButtonPressed()" title="Next" />
    </div>
    <b-modal ref="errorModal" title="Error" hide-footer>
      Please fix issues.
      <b-btn class="mt-3" variant="primary" block @click="hideModal">OK</b-btn>
    </b-modal>
  </div>
</template>

<script>
  import API from '../../API.js'
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "SignUp_Step3",
    components: {LoadingButton},
    data() {
      return {
        model: {},
        API: API,
        isLoading: false
      }
    },
    methods: {
      hideModal() {
        this.$refs.errorModal.hide();
      },
      isValid() {
        return this.model.firstName!=''
          && this.model.lastName!=''
          && this.model.email!=''
          && this.model.phone!=''
          && this.model.pronoun!='none'
          && this.model.industry!=''
          && this.model.employer!=''
          && this.model.jobTitle!=''
          && this.model.skills.length>0
          && this.model.interactions.length>0
          && this.model.meetingTypes.length>0
          && this.model.stories.length>0
          && this.model.causes.length>0
          && this.model.hobbies.length>0
      },
      setModel(model) {
        this.model = model;
      },
      pronoun(pronoun) {
        if (pronoun == "hehimhis") { return "He/Him/His"; }
        else if (pronoun == "sheherhers") { return "She/Her/Hers"; }
        else if (pronoun == "theythemtheirs") { return "They/Them/Theirs"; }
      },
      nextButtonPressed() {
        if (this.isValid()) {
          var self = this;
          var email = self.model.email;
          var password = self.model.password;
          var accessCode = sessionStorage.getItem('accessCode');

          self.isLoading = true;

          delete self.model["email"];
          delete self.model["password"];

          API.signUp(email, password, accessCode, self.model)
            .then(result => {
              self.$router.push({path: '/confirmation'});
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$refs.errorModal.show();
        }
      }
    }
  }
</script>

<style scoped>
  #signupContainer {
    display: flex;
    flex-direction: column;
  }
  #nextButton {
    padding: 8px 40px 8px 40px;
  }
  .signupItem {

  }
  .signupSection {
    /*display: block;*/
    display: flex;
    /*display: table;*/
    /*text-align: left;*/
    text-align: left;
    padding: 10px 0 10px 0;

    display:table-cell;
    vertical-align:middle;
  }
  .mentorBadge {
    margin-left: 20px;
    padding: 10px 15px 10px 15px;
  }
</style>
