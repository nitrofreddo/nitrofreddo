<template>
  <div>
    <LoadingScreen v-if="!isLoaded" />
    <div v-else>
      <div class="profileNav">
        <b-button variant="primary" :to="{name: 'Dashboard'}">Back to Dashboard</b-button>
      </div>
      <div id="profileContainer">
        <div class="cardHeader">
          <div class="mentorImageContainer">
            <b-img class="mentorImage" />
          </div>
          <div class="cardHeaderInfo">
            <h3>{{object.firstName}}</h3>
            <b-button class="moreButton" variant="primary" v-b-modal.modal1>Request Match</b-button>
          </div>
        </div>
        <div class="cardSection">
          <h5>Industry</h5>
          <b-badge pill class="mentorBadge" variant="info">{{API.industryString(object.industry)}}</b-badge>
        </div>
        <div class="cardSection">
          <h5>Also has experiences in</h5>
          <b-badge pill class="mentorBadge" variant="info" v-for="industry in object.additional" :key="industry">
            {{API.industryString(industry)}}
          </b-badge>
        </div>
        <div class="cardSection">
          <h5>Skills</h5>
          <b-badge pill class="mentorBadge" variant="secondary" v-for="skill in object.skills" :key="skill">
            {{API.skillsString(skill)}}
          </b-badge>
        </div>
        <div class="cardSection">
          <h5>I can share stories about...</h5>
          <b-badge pill class="mentorBadge" variant="secondary" v-for="story in object.stories" :key="story">
            {{API.storiesString(story)}}
          </b-badge>
        </div>
        <div class="cardSection">
          <h5>I care about causes such as...</h5>
          <b-badge pill class="mentorBadge" variant="secondary" v-for="cause in object.causes" :key="cause">
            {{API.causesString(cause)}}
          </b-badge>
        </div>
        <div class="cardFooter">
          <b-button class="moreButton" variant="primary" v-b-modal.modal1>Request Match</b-button>
        </div>
      </div>
      <b-modal ref="modal" id="modal1" hide-footer hide-header>
        <p class="my-4">Are you sure you want to match with {{object.firstName}}?</p>
        <b-btn class="modalButton" variant="primary" @click="showConfirm">Yes</b-btn>
        <b-btn class="modalButton" @click="hideModal">No</b-btn>
      </b-modal>
      <b-modal ref="confirmModal" id="modal2" hide-footer hide-header>
        <p class="my-4">You have been matched with Jason! What next? A confirmation email has been sent to your email!</p>
        <b-btn class="modalButton" variant="primary" @click="closeConfirmation">Close</b-btn>
      </b-modal>
    </div>
  </div>
</template>s

<script>
  import API from "../API.js";
  import LoadingScreen from "../components/LoadingScreen";

  export default {
    name: "Profile",
    components: {LoadingScreen},
    data() {
      return {
        API: API
      }
    },
    props: {
      object: {
        type: Object,
        required: true,
        default: () => {}
      },
      isLoaded: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    mounted() {
      var self = this;
      API.getMentors(function(error, objects) {
        self.object = objects[0];
        self.isLoaded = true;
      });
    },
    methods: {
      showConfirm() {
        var self = this;
        self.$refs.modal.hide();

        setTimeout(function() {
          self.$refs.confirmModal.show();
        }, 3000);
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
  .profileNav {
    text-align: left;
    padding: 25px;
  }
  .cardHeaderInfo {
    flex-grow: 1;
  }
  .cardSection {
    padding: 10px;
    text-align: left;
  }
  .cardHeader {
    padding-bottom: 40px;
    display: flex;
  }
  .cardFooter {
    padding-top: 30px;
  }
  .mentorBadge {
    margin: 2px;
    padding: 10px 15px 10px 15px;
  }
  .mentorImage {
    height: 100px;
    width: 100px;
  }
  .mentorImageContainer {
    flex-grow: 1;
    text-align: center;
  }
  .modalButton {
    padding: 5px 20px 5px 20px;
    width: 150px;
    margin: 10px;
  }
  #profileContainer {
    margin: 20px 10px 20px 10px;
    width: 100%;
    max-width: 450px;
    display: inline-block;
    vertical-align: top;
  }
</style>
