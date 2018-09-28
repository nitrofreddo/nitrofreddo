<template>
  <b-modal ref="modal" id="imagePickerModal" hide-footer hide-header>
    <div class="container">
      <div class="buttonContainer" v-for="image in API.profileImages()" :key="image">
        <b-button :variant="selectedImage == image ? 'highlighted' : 'secondary'" class="imageButton" @click.prevent="didSelect(image)">
          <b-img rounded="circle" :src="API.profileImageURLPrefix()+image+'.png'" class="image"></b-img>
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
  import API from '../../API.js'

  export default {
    name: "SignUp_ImagePickerModal",
    data() {
      return {
        API: API,
      }
    },
    props: {
      selectedImage: {
        type: String,
        required: true,
        default: ""
      }
    },
    methods: {
      didSelect(image) {
        this.selected = image;
        this.$refs.modal.hide();
        this.$emit('selectedImage', image);
      }
    }
  }
</script>

<style scoped>
  .buttonContainer {
    text-align: center;
    padding: 10px;
  }
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
  }
  .container>* {
    flex: 1;
  }
  .imageButton {
    padding: 10px;
    border-radius: 50%;
  }
  .image {
    height: 100px;
    width: 100px;
  }
</style>
