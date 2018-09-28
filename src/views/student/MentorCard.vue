<template>
  <div>
    <b-modal id="mentorCard" v-if="object!=null" hide-footer hide-header>
      <b-img class="mentorImage" rounded="circle" :src="API.profileImageURLPrefix()+object.profileImage+'.png'" />
      <div class="cardHeader">
        <h3>{{object.firstName}}</h3>
        <b-badge pill class="mentorBadge" variant="info">{{object.industry}}</b-badge>
      </div>
      <div class="cardHeader">
        <h5>Also knows:</h5>
        <b-badge pill class="mentorBadge" variant="info" v-for="industry in object.additional" :key="industry">
          {{industry}}
        </b-badge>
      </div>
      <div class="cardSection">
        <h5>Skills</h5>
        <b-badge pill class="mentorBadge" variant="secondary" v-for="skill in object.skills" :key="skill">
          {{skill}}
        </b-badge>
      </div>
      <div class="cardSection">
        <h5>I care about causes such as...</h5>
        <b-badge pill class="mentorBadge" variant="secondary" v-for="cause in object.causes" :key="cause">
          {{cause}}
        </b-badge>
      </div>
      <div class="cardSection">
        <h5>I can share stories about...</h5>
        <b-badge pill class="mentorBadge" variant="secondary" v-for="story in object.stories" :key="story">
          {{story}}
        </b-badge>
      </div>
      <div class="cardSection">
        <h5>I am a...</h5>
        <b-badge pill class="mentorBadge" variant="secondary" v-for="hobby in object.hobbies" :key="hobby">
          {{hobby}}
        </b-badge>
      </div>
      <div class="cardFooter">
        <b-button class="moreButton" variant="primary" v-b-modal.modal1>Request Match</b-button>
      </div>
    </b-modal>

    <b-modal ref="modal" id="modal1" hide-footer hide-header>
      <p class="my-4">Are you sure you want to match with {{object.firstName}}?</p>
      <b-alert :show="showError" variant="danger">{{errorMessage}}</b-alert>
      <LoadingButton class="modalButton" :is-loading="requestingMatch" @click="requestMatch" title="Yes"/>
      <b-btn class="modalButton" @click="hideModal">No</b-btn>
    </b-modal>

    <b-modal ref="confirmModal" id="modal2" hide-footer hide-header>
      <p class="my-4">Congratulations! You have been matched with {{object.name}}! Please check your email for next steps including a sample email to invite your mentor to your first meeting. If you have any questions, please reach out to Stan Pichinevskiy at SkillsthatShine@waopportunityscholarship.org.</p>
      <b-btn class="modalButton" variant="primary" @click="closeConfirmation">Close</b-btn>
    </b-modal>
  </div>
</template>

<script>
  import API from "../../API.js";
  import LoadingButton from "../../components/LoadingButton";
  export default {
    name: "MentorCard",
    components: {LoadingButton},
    data() {
      return {
        API: API,
        object:{},
        isLoading: false,
        requestingMatch: false,
        showError: false,
        errorMessage: ""
      }
    },
    methods: {
      requestMatch() {
        var self = this;
        self.requestingMatch = true;
        self.API.requestMatch(self.object.id)
          .then(response => {
            self.$refs.modal.hide();
            self.$refs.confirmModal.show();
          })
          .catch(error => {
            self.showError = true;
            if (error == 'count-invalid') {
              self.errorMessage = "This mentor has already been matched.";
            } else if (error == 'not-mentor') {
              self.errorMessage = "This user is not a mentor.";
            } else {
              self.errorMessage = error.message;
            }
          })
          .finally(() => {
            self.requestingMatch = false;
            this.$emit('needsRefresh');
          });
      },
      hideModal() {
        this.$refs.modal.hide()
      },
      closeConfirmation() {
        this.$refs.confirmModal.hide()
      }
    }
  }
</script>

<style scoped>
  .cardSection {
    padding: 10px;
    text-align: left;
  }
  .cardHeader {
    padding-bottom: 20px;
  }
  .cardFooter {
    padding-top: 30px;
  }
  .mentorBadge {
    margin: 2px;
    padding: 10px 15px 10px 15px;
    max-width: 100%;
    word-wrap: break-word;
    white-space:normal;
  }
  .mentorImage {
    height: 100px;
    width: 100px;
    margin-bottom: 20px;
    border: solid 1px #aaa;
  }
  .modalButton {
    padding: 5px 20px 5px 20px;
    width: 150px;
    margin: 10px;
  }
</style>
