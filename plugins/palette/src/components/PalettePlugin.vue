<script>
import 'storyblok-design-system/dist/storyblok-design-system.css'
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'

const defaultColors = [
  '#00B3B0', '#40C6C4', '#7FD9D7', '#D9F4F3',
  '#1B243F', '#545B6F', '#8D919F', '#C6C8CF',
  '#B1B5BE', '#DFE3E8', '#E7EAEE', '#EFF1F3',
  '#2DB47D', '#62C79E', '#96D9BE', '#CAECDE',
  '#395ECE', '#6B87DB', '#9CAEE6', '#CDD7F3',
  '#FBCE41', '#FCDB71', '#FDE6A0', '#FEF3CF',
  '#FFAC00', '#FFC140', '#FFD57F', '#FFEABF',
  '#FF6159', '#FF8983', '#FFB0AC', '#FFD7D5',
]

export default {
  props: {
    options: {
      type: Object,
      default: undefined
    },
  },
  components: {VSwatches},
  render() {
    // TODO get from props
    const columns = 4
    // const size = 'small'
    const size = 'medium'
    // const size = 'large'
    // const variant = 'square'
    // const variant = 'circle'
    const variant = 'dense'

    const heightPx = {
      small: '36px',
      medium: '48px',
      large: '62px',
    }[size]

    return (
          <VSwatches
              v-model={this.value}
              inline
              wrapper-style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridGap: variant === "dense" ? '0px' : '5px',
                width:  variant === "dense" ? '100vw' : 'auto',
              }}
              swatch-style={{
                height: heightPx,
                width:  variant === "dense" ? '100%' : heightPx,
                margin: 'auto',
                borderRadius: {
                  square: '5px',
                  circle: '50%',
                  dense: '0px',
                }[variant]}
              }
              swatches={defaultColors}
          />
    )
  },

  // this.$emit("toggle-modal", true);
  data() {
    return {
      value: ""
    }
  },
  watch: {
    value: {
      handler(value) {
        this.$emit("model", {value});
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="scss">

.vue-swatches {
  display: flex !important;
  justify-content: center !important;
}

::v-deep .vue-swatches__container {
  background: transparent !important;
}

</style>