<template>
  <div id="signupContainer">
    <div class="signupSection">
      <h1>Let's get down to business</h1>
    </div>
    <b-form id="signupForm">
      <div class="signupSection">
        <i>
          Your contact information will not be used for fundraising solicitation and will be used for WSOS event purposes only.
        </i>
      </div>
      <div class="signupSection">
        <h4>Select Animal Icon</h4>
        <b-button v-b-modal.imagePickerModal variant="highlighted" id="selectImageButton">
          <b-img rounded="circle" :src="API.profileImageURLPrefix()+profileImage+'.png'" id="selectedImage"></b-img>
        </b-button>
        <b-tooltip show target="selectImageButton" placement="right">
          Click to select
        </b-tooltip>
        <SignUp_ImagePickerModal :selectedImage="profileImage" v-on:selectedImage="profileImage = $event" />
      </div>
      <div class="signupSection">
        <h4>First name</h4>
        <b-form-input v-model="firstName" type="text" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Last name</h4>
        <b-form-input v-model="lastName" type="text" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Email</h4>
        <b-form-input v-if="cachedEmail == null || cachedEmail == ''" v-model="email" type="email" class="textInput"/>
        <div v-else v-b-tooltip.hover title="Your email address has been pre-assigned." class="textInput">
          <b-form-input disabled v-model="cachedEmail" />
        </div>
      </div>
      <div class="signupSection">
        <h4>Password</h4>
        <b-form-input v-model="password" type="password" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Re-enter Password</h4>
        <b-form-input type="password" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Phone</h4>
        <b-form-input v-model="phone" type="tel" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Preferred Pronoun</h4>
        <b-form-radio-group plain v-model="selectedPronoun" :options="pronouns" />
      </div>
      <div class="signupSection">
        <h4>I work in..</h4>
        <b-form-select class="industrySelector" :options="industries" text="Select Industry" v-model="industry">
        </b-form-select>
      </div>
      <div class="signupSection">
        <h4>Employer</h4>
        <b-form-input v-model="employer" type="text" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>Job Title</h4>
        <b-form-input v-model="jobTitle" type="text" class="signupItem textInput" />
      </div>
      <div class="signupSection">
        <h4>I also have experiences in the following industries:</h4>
        <ButtonMultiselect ref="industrySelector" :items="API.industries()" />
      </div>
      <div class="signupSection">
        <h4>In addition to basic work-readiness skills such as preparing a resume and cover letter, I have skills in:</h4>
        <ButtonMultiselect ref="skillSelector" :items="API.skills()" />
      </div>
      <div class="signupSection">
        <h4>I prefer to meet my mentee:</h4>
        <ButtonMultiselect ref="meetingTypesSelector" :items="meetingTypes" />
      </div>
      <div class="signupSection signupHorizontal">
        <h4>I can mentor</h4>
        <b-form-select id="numMentees" class="mb-3 inputItem" v-model="canMentorCount">
          <option value="0" disabled>Number</option>
          <option v-for="idx in 4" :key="idx">{{idx}}</option>
        </b-form-select>
        <h4>mentee(s) this year</h4>
        <b-btn class="inputItem" v-b-tooltip.hover.right title="mentoring one mentee requires a minimum of 6-8 hours throughout the academic year">?</b-btn>
      </div>
      <div class="signupSection">
        <h4>Have an existing WSOS mentee?</h4>
        <b-form-checkbox class="signupCheckbox" v-model="menteeStatus" value="hasMentee" unchecked-value="noMentee" plain>
          I have an existing WSOS mentee
        </b-form-checkbox>
        <b-collapse id="menteeInfoCollapsible" :visible="menteeStatus=='hasMentee'" class="mt-2">
          <b-card>
            <div class="signupSection">
              <h5>Mentee First Name</h5>
              <b-form-input v-model="menteeFirstName" type="text" class="signupItem textInput" />
            </div>
            <div class="signupSection">
              <h5>Mentee Last Name</h5>
              <b-form-input v-model="menteeLastName" type="text" class="signupItem textInput" />
            </div>
          </b-card>
        </b-collapse>
      </div>
      <div class="signupSection">
        <b-button id="nextButton" variant="primary" @click.prevent="nextButtonPressed()">Next</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
  import API from '../../API.js'
  import ButtonMultiselect from "../../components/ButtonMultiselect";
  import SignUp_ImagePickerModal from "./SignUp_ImagePickerModal";
  export default {
    name: "SignUp_Step1",
    components: {SignUp_ImagePickerModal, ButtonMultiselect},
    data() {
      return {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        cachedEmail: "",
        phone: "",
        menteeFirstName: "",
        menteeLastName: "",
        selectedPronoun: 'none',
        pronouns: [
          { text: 'He/Him/His', value: 'hehimhis' },
          { text: 'She/Her/Hers', value: 'sheherhers' },
          { text: 'They/Them/Theirs', value: 'theythemtheirs' }
        ],
        selectedContactType: [],
        menteeStatus: 'noMentee',
        selected: [],
        API: API,
        industries: [],
        industry: "",
        profileImage: 'bird_edited',
        meetingTypes: ["In-person", "via Skype", "via Call", "via Email"],
        canMentorCount: 1,
        employer: "",
        jobTitle: ""
      }
    },
    methods: {
      getData() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.cachedEmail === "" ? this.email : this.cachedEmail,
          password: this.password,
          phone: this.phone,
          pronoun: this.selectedPronoun,
          industry: this.industry,
          otherIndustries: this.$refs.industrySelector.getSelected(),
          skills: this.$refs.skillSelector.getSelected(),
          hasMentee: this.menteeStatus === "hasMentee",
          menteeFirstName: this.menteeFirstName,
          menteeLastName: this.menteeLastName,
          profileImage: this.profileImage,
          meetingTypes: this.$refs.meetingTypesSelector.selected,
          canMentorCount: this.canMentorCount,
          employer: this.employer,
          jobTitle: this.jobTitle
        }
      },
      nextButtonPressed() {
        this.$emit('nextTab');
      }
    },
    mounted() {
      this.industries.push({value: null, text: 'Please select an option', disabled: true});
      this.industries = this.industries.concat(API.industries().map(industry => {
        return { value: industry, text: industry };
      }));
      this.cachedEmail = sessionStorage.getItem('cachedEmail');
    }
  }
</script>

<style scoped>
  #selectImageButton {
    padding: 10px;
    border-radius: 50%;
  }
  #selectedImage {
    height: 100px;
    width: 100px;
  }
  #signupContainer {
  }
  #nextButton {
    padding: 8px 40px 8px 40px;
  }
  .signupSection {
    display: block;
    text-align: left;
    padding: 10px 0 10px 0;
  }
  .textInput {
    max-width: 300px;
  }
  .industrySelector {
    margin-top: 10px;
    margin-bottom: 10px;
    max-width: 300px;
  }
  .signupCheckbox {
    padding: 10px;
  }
  .inputItem {
    max-width: 200px;
    margin: 10px;
  }
  .signupHorizontal {
    display: flex;
    align-items: center;
  }
</style>
