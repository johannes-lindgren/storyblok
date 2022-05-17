<template>
  <ActualPlugin
      :options="this.options"
      @model="valueChanged"
  />
</template>

<script>
import PalettePlugin from "./PalettePlugin";

export default {
  components: {
    ActualPlugin: PalettePlugin,
  },
  mixins: [window.Storyblok.plugin],
  methods: {
    initWith() {
      return {
        plugin: this.getPluginName(), // Added to component by src/plugin/loadPlugin.ts
        items: [],
      };
    },
    valueChanged(value) {
      this.$emit("changed-model", {
        plugin: `this.getPluginName()`,
        ...value,
      });
    }
  },
  watch: {
    model: {
      handler(value) {
        // TODO validate input, somewhere else
        // TODO validate output
        this.$emit("changed-model", value);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
</style>
