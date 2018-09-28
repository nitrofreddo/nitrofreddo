<template>
  <b-card id="container">
    <b-button class="buttonItem" v-for="(item, index) in items" :key="item" @click.prevent="toggle(item)" :variant="shouldHighlight(item)" v-b-tooltip.hover :title="descriptions[index]">
      {{item}}
    </b-button>
    <b-form-input v-if="otherEnabled" v-model="otherOption" class="buttonItem otherField" placeholder="other..."></b-form-input>
  </b-card>
</template>

<script>
  export default {
    name: "ButtonMultiselect",
    props: {
      items: {
        type: Array,
        required: true,
        default: () => []
      },
      descriptions: {
        type: Array,
        required: false,
        default: () => []
      },
      otherEnabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {
        selected: [],
        otherOption: ""
      }
    },
    methods: {
      shouldHighlight(item) {
        return this.selected.includes(item) ? "highlighted" : "secondary";
      },
      toggle(item) {
        var index = this.selected.indexOf(item);

        if (index == -1) {
          this.selected.push(item);
        } else {
          this.selected.splice(index, 1);
        }
      },
      getSelected() {
        var otherValue = this.otherOption;
        var result = this.selected;

        if (otherValue.length > 0) { result.push(otherValue); }

        return result;
      }
    }
  }
</script>

<style scoped>
  .buttonItem {
    margin: 10px;
  }
  .otherField {
    width: 300px;
  }
</style>
