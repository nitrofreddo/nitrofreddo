<template>
  <b-card id="dashboardContainer" no-body>
    <b-tabs card>
      <b-tab title="Match with mentor">
        <LoadingScreen v-if="isLoadingMentors"/>
        <div v-else-if="hasMentor">
          <b-alert show>You have a mentor now! We hope you have a great experience with your mentor!</b-alert>
        </div>
        <div v-else>
          <div id="filterContainer">
            <FilterItemMultiselect filterName="Skills" v-model="selectedSkills" :options="API.skills()" class="filter" />
            <FilterItemMultiselect filterName="Stories to share" v-model="selectedStories" :options="API.stories()" class="filter" />
            <FilterItemMultiselect filterName="Interested causes" v-model="selectedCauses" :options="API.causes()" class="filter" />
          </div>
          <div id="cardContainer">
            <b-card class="mentorCard" v-for="object in objects" :key="object.id">
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
              <div class="cardFooter">
                <b-button v-b-modal.mentorCard @click.prevent="showModal(object)"  class="moreButton" variant="primary">Read more & match</b-button>
              </div>
            </b-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="My profile">
        <StudentProfile />
      </b-tab>
      <b-tab title="My mentor">
        <LoadingScreen v-if="isLoadingMentor"/>
        <div v-else>
          <b-alert show v-if="mentorObj == null">No mentor yet!</b-alert>
          <div v-else>
            <b-img class="mentorImage" rounded="circle" :src="API.profileImageURLPrefix()+mentorObj.profileImage+'.png'" />
            <div class="cardHeader">
              <h3>{{mentorObj.firstName}}</h3>
              <b-badge pill class="mentorBadge" variant="info">{{mentorObj.industry}}</b-badge>
            </div>
            <div class="cardHeader">
              <h5>Also knows:</h5>
              <b-badge pill class="mentorBadge" variant="info" v-for="industry in mentorObj.additional" :key="industry">
                {{industry}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>Skills</h5>
              <b-badge pill class="mentorBadge" variant="secondary" v-for="skill in mentorObj.skills" :key="skill">
                {{skill}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>I care about causes such as...</h5>
              <b-badge pill class="mentorBadge" variant="secondary" v-for="cause in mentorObj.causes" :key="cause">
                {{cause}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>I can share stories about...</h5>
              <b-badge pill class="mentorBadge" variant="secondary" v-for="story in mentorObj.stories" :key="story">
                {{story}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>I am a...</h5>
              <b-badge pill class="mentorBadge" variant="secondary" v-for="hobby in mentorObj.hobbies" :key="hobby">
                {{hobby}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>I prefer meeting...</h5>
              <b-badge pill class="mentorBadge" variant="secondary" v-for="item in mentorObj.meetingTypes" :key="item">
                {{item}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>Phone</h5>
              <b-badge pill class="mentorBadge" variant="info" >
                {{mentorObj.phone}}
              </b-badge>
            </div>
            <div class="cardSection">
              <h5>Email</h5>
              <b-badge pill class="mentorBadge" variant="info" >
                {{mentorObj.email}}
              </b-badge>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
    <MentorCard v-on:needsRefresh="refresh" ref="mentorCard" />
  </b-card>
</template>

<script>
  import API from "../../API.js";
  import FilterItemMultiselect from "../../components/FilterItemMultiselect";
  import StudentProfile from "./Profile";
  import LoadingScreen from "../../components/LoadingScreen";
  import MentorCard from "./MentorCard";
  export default {
    name: "StudentDashboard",
    components: {MentorCard, LoadingScreen, StudentProfile, FilterItemMultiselect},
    data() {
      return {
        API: API,
        objects: [],
        allObjects: [],
        isLoadingMentors: false,
        isLoadingMentor: false,
        hasMentor: false,
        modalShow: false,
        mentorObj: null,
        selectedSkills: [],
        selectedStories: [],
        selectedCauses: []
      }
    },
    methods: {
      showModal(object) {
        var mentorCard = this.$refs.mentorCard;
        mentorCard.object = object;
      },
      updateFilters() {
        var filteredObjects = this.allObjects;
        if (this.selectedSkills.length > 0) {
          filteredObjects = filteredObjects.filter(object => {
            for (var skill of this.selectedSkills) {
              if (object.skills.indexOf(skill) === -1) {
                return false;
              }
            }
            return true;
          });
        }

        if (this.selectedStories.length > 0) {
          filteredObjects = filteredObjects.filter(object => {
            for (var skill of this.selectedStories) {
              if (object.stories.indexOf(skill) === -1) {
                return false;
              }
            }
            return true;
          });
        }

        if (this.selectedCauses.length > 0) {
          filteredObjects = filteredObjects.filter(object => {
            for (var skill of this.selectedCauses) {
              if (object.causes.indexOf(skill) === -1) {
                return false;
              }
            }
            return true;
          });
        }

        this.objects = filteredObjects;
        console.log(filteredObjects.length);
      },
      refresh() {
        this.isLoadingMentors = true;
        this.isLoadingMentor = true;

        API.getMentor().then(mentor => {
          this.mentorObj = mentor;
          this.isLoadingMentor = false;

          if (mentor == null) {
            API.getAvailableMentors().then(
              result => {
                this.allObjects = result;
                this.objects = result;
                this.isLoadingMentors = false;
              }
            );
            this.hasMentor = false;
          } else {
            this.isLoadingMentors = false;
            this.hasMentor = true;
          }
        });
      }
    },
    watch: {
      selectedSkills: function(val, old) {
        if (val != old) { this.updateFilters(); }
      },
      selectedStories: function(val, old) {
        if (val != old) { this.updateFilters(); }
      },
      selectedCauses: function(val, old) {
        if (val != old) { this.updateFilters(); }
      }
    },
    mounted() {
      this.refresh();
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
  .mentorCard {
    margin: 20px 10px 20px 10px;
    width: 100%;
    max-width: 450px;
    display: inline-block;
    vertical-align: top;
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
  .filter {
    padding: 10px 10px 0 10px;
  }
  #cardContainer {
    display: flex;
    flex-flow: row wrap;
  }
  #filterContainer {
    display: flex;
    flex-flow: row wrap;
  }
  #dashboardContainer {
    margin: 20px;
  }
</style>
