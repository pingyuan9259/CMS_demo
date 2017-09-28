<template>
  <div class="course-faq" style="">
    <div class="postInfo-container" style="padding: 10px;display: block;">
      <div class="item-container">
        <span>问题</span>
        <el-input class="item" v-model="faq.question" placeholder="请填写问题" style="width: 60%;"></el-input>
      </div>
      <div class="item-container">
        <span>答案</span>
        <el-input class="item" v-model="faq.answer" placeholder="请填写答案" style="width: 60%;" type="textarea" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
      </div>

      <div style="display: block;text-align: left;">
        <el-button type="danger" @click.prevent="removeFaq" style="margin-left: 12px; height: 40px;">清空这一段</el-button>
        <el-button type="warning" @click.prevent="deleteFaq" style="margin-left: 12px; height: 40px;">删除这一段</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'faq',
  props: {
    faq: {
      type: Object
    }
  },
  data() {
    return {
    // { id: 0, question: '', answer: '' }
    }
  },
  created() {
  },
  methods: {
    deleteFaq() {
      this.$emit('deleteFaq', this.faq.id)
    },
    removeFaq () {
      this.$emit('clearFaq', this.faq.id)
      }
    }
  }

</script>
<style lang="scss" scoped>
  span {
    font-size: 14px;
  }
  .item {
    margin-left: 25px;
  }
  .item-container {
    margin: 10px auto;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  .postInfo-container {
    border:1px solid #bfcbd9;
    border-radius: 4px;
    margin: 10px 0;
    // display: flex;
    // width: 95%;

    .postInfo-container-item {
      // float: left;
    }
  }

</style>

