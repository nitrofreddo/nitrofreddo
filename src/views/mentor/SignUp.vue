<template>
  <b-card id="signupContainer" no-body>
    <b-tabs card v-model="tabIndex" v-on:input="tabBecameVisible">
      <b-tab title="Let's get down to business" active>
        <SignUp_Step1 ref="part1" v-on:nextTab="nextTab" />
      </b-tab>
      <b-tab title="Let's get to know you">
        <SignUp_Step2 ref="part2" v-on:nextTab="nextTab" />
      </b-tab>
      <b-tab title="Review">
        <SignUp_Step3 ref="part3" />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import SignUp_Step1 from './SignUp_Step1'
  import SignUp_Step2 from './SignUp_Step2'
  import SignUp_Step3 from './SignUp_Step3'
  export default {
    name: "SignUpMentor",
    components: {SignUp_Step1, SignUp_Step2,SignUp_Step3},
    data() {
      return {
        tabIndex: 0,
        model: {}
      }
    },
    methods: {
      nextTab() {
        this.tabIndex += 1;
        window.scrollTo(0,0);
      },
      tabBecameVisible(index) {
        if (index == 2) {
          var part1 = this.$refs.part1.getData();
          var part2 = this.$refs.part2.getData();
          this.model = Object.assign({}, part1, part2);

          this.$refs.part3.setModel(this.model);
        }
      }
    },
    mounted: function() {
      var accessCode = sessionStorage.getItem('accessCode');
      if (accessCode == null || accessCode == '') {
        this.$router.replace({name: "AccessCode"});
      }
    }
  }
</script>

<style scoped>
  #signupContainer {
    margin: 20px;
  }
</style>
