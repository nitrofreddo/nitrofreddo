<template>
  <b-button id="loadingButton" :variant="variant" @click.prevent="clicked">
    <div v-if="isLoading" id="buttonSpinner" class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <span v-else id="buttonText">
      <fa-icon class="icon" v-if="icon.length > 0" :icon="['far', icon]" />
      <span v-if="icon.length > 0 && title.length > 0" class="spacer"></span>
      {{title}}
    </span>
  </b-button>
</template>

<script>
  export default {
    name: "LoadingButton",
    props: {
      isLoading: {
        type: Boolean,
        required: true,
        default: false
      },
      title: {
        type: String,
        required: false,
        default: "Continue"
      },
      icon: {
        type: String,
        required: false,
        default: ""
      },
      variant: {
        type: String,
        required: false,
        default: "primary"
      }
    },
    methods: {
      clicked() {
        this.$emit('click');
      }
    }
  }
</script>

<style scoped>
  .spacer {
    margin: 4px;
  }
</style>
