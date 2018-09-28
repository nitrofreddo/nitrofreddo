<template>
  <div id="signupContainer">
    <div class="signupSection">
      <h1>Let's get to know you</h1>
    </div>
    <b-form id="signupForm">
      <div class="signupSection">
        <h4>I believe a good mentor interacts with their mentee by being:</h4>
        <ButtonMultiselect ref="interactionSelector" :items="interactions" :descriptions="interactionsDescriptions" class="industrySelector" />
      </div>
      <div class="signupSection">
        <h4>I can share stories about:</h4>
        <ButtonMultiselect ref="stories" :items="API.stories()" class="industrySelector" />
      </div>
      <div class="signupSection">
        <h4>I care about causes such as...</h4>
        <ButtonMultiselect ref="causes" :items="API.causes()" class="industrySelector" :otherEnabled="true" />
      </div>
      <div class="signupSection">
        <h4>I am a:</h4>
        <ButtonMultiselect ref="hobbies" :items="hobbyTypes" class="industrySelector" :otherEnabled="true" />
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
  export default {
    name: "SignUp_Step2",
    components: {ButtonMultiselect},
    data() {
      return {
        interactions: ["Inviting", "Open-minded", "Attentive", "Understanding"],
        interactionsDescriptions: ["Encouraging your mentee to feel welcome and comfortable", "A willingness to listen to or accept different ideas, perspectives and opinions", "Being an observant, careful listener ", "Sympathetically and kindly showing awareness of your mentee’s feelings"],
        hobbyTypes: ["Dog lover", "Bookworm" , "Film buff", "Foodie", "Gamer", "Cat lover", "Traveler", "Hipster", "Jedi", "Sports fanatic", "Outdoor enthusiast", "Baker", "Crafter", "Musician", "Photographer", "Fitness enthusiast", "Yogi", "Thespian", "Blogger", "Karaoke lover"],
        API: API
      }
    },
    methods: {
      getData() {
        return {
          interactions: this.$refs.interactionSelector.getSelected(),
          stories: this.$refs.stories.getSelected(),
          causes: this.$refs.causes.getSelected(),
          hobbies: this.$refs.hobbies.getSelected()
        }
      },
      nextButtonPressed() {
        this.$emit('nextTab');
      }
    }
  }
</script>

<style scoped>
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
  .industrySelector {
  }
</style>
