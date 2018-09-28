<template>
  <div>
    <b-btn v-b-toggle="'toggle-'+filterName" variant="primary">
      {{filterName}}<b-badge pill variant="light" id="badgeCount">{{selected.length}}</b-badge>
    </b-btn>
    <b-collapse :id="'toggle-'+filterName" class="collapsible">
      <b-form-group>
        <b-form-checkbox-group plain v-model="selected" @input="update()">
          <div class="cardItem" v-for="option in options" :key="option">
            <b-form-checkbox :value="option">{{option}}</b-form-checkbox>
          </div>
        </b-form-checkbox-group>
      </b-form-group>
    </b-collapse>
  </div>
</template>

<script>
  export default {
    name: "FilterItemMultiselect",
    data() {
      return {
        selected: []
      }
    },
    props: {
      options: {
        type: Array,
        required: true,
        default: () => []
      },
      filterName: {
        type: String,
        required: true,
        default: ""
      }
    },
    methods: {
      update() {
        this.$emit('input', this.selected);
      }
    }
  }
</script>

<style scoped>
  .collapsible {
    margin-top: 10px;
    padding: 20px 20px 0 20px;
    position: absolute;
    z-index: 999;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: white;
    border-radius: 10px;
  }
  .cardItem {
    text-align: left;
    padding: 10px;
  }
  #badgeCount {
    margin-left: 10px;
  }
</style>
