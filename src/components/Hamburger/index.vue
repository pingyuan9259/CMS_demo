<template>
    <div>
      <svg aria-hidden="true" class="wscn-icon hamburger" @click="toggleClick" :class="{'is-active':isActive}">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-shouqi"></use>
      </svg>
    </div>
</template>

<script>
    export default {
      name: 'hamburger',
      props: {
        isActive: {
          type: Boolean,
          default: false
        },
        toggleClick: {
          type: Function,
          default: null
        }
      }
    }
</script>

<style scoped>
    .hamburger {
        display: inline-block;
        cursor: pointer;
        width: 20px;
        height: 20px;
        transform: rotateY(180deg);
        transition: .38s;
        transform-origin: 50% 50%;
    }
    .hamburger.is-active {
        transform: rotateY(0deg);
    }
</style>
