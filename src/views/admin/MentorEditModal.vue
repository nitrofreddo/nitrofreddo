<template>
  <b-modal ref="modal" id="mentorModal">
    <p class="my-4">Meow?</p>
    <div slot="modal-footer" class="w-100">
      <div class="leftSection">
        <b-button class="" variant="danger" @click="">
          Delete
        </b-button>
      </div>
      <div class="rightSection">
        <b-button class="" variant="primary" @click="">
          Save
        </b-button>
        <b-button class="" variant="secondary" @click="show=false">
          Cancel
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
    export default {
        name: "MentorEditModal"
    }
</script>

<style scoped>
  .leftSection {
    float: left;
  }
  .rightSection {
    float: right;
  }
</style>
