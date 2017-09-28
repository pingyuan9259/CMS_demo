<template>
  <div class="editFeedbackFqa-container">

    <el-form class="form-container" :model="postForm" ref="postForm">
      <div class="edit-feedback-faq-main-container">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" style="width:35%;" placeholder="请输入标题">
          </el-input>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-radio-group v-model="postForm.type">
            <el-radio :label="FAQ_TYPE.COMMON">常见问题</el-radio>
            <el-radio :label="FAQ_TYPE.WALLET">钱包问题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model.number="postForm.weight" style="width: 35%;" type="number" :min="1" step="1" placeholder="请输入权重">
            <template slot="append">按 1~10 重要性递增</template>
          </el-input>
          <el-button v-if="isEdit" style="margin-left: 20px;" type="primary" @click.prevent="updateWeight">更新权重</el-button>
        </el-form-item>
        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content"></Tinymce>
        </div>
      </div>
    </el-form>

    <div class="block" style="display: block;text-align: center;">
      <!-- <el-button v-if="!isEdit" style="margin: 0 30px 40px;" @click="previewFaq">预 览</el-button> -->
      <el-button style="margin: 0 30px 40px;" @click="previewFaq">预 览</el-button>
      <el-button style="margin: 0 30px 40px;" type="primary" :loading="submitBtnLoading" @click="submitFaq">提 交</el-button>
    </div>

    <el-dialog title="问题详情" size="small" :visible.sync="faqDetailDialogVisible">
      <div class="dialog-title">
        <h4>{{ postForm.title }}</h4>
        <div v-html="postForm.content"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateDialog">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import Tinymce from 'components/Tinymce'
    import { mapGetters } from 'vuex'
    import api from './api.js'
    import _ from 'lodash'

    const FAQ_TYPE = { COMMON: 1, WALLET: 2 }

    export default {
      name: 'editFeedbackFaq',
      components: { Tinymce },
      data() {
        return {
          id: '',
          FAQ_TYPE,
          postForm: {
            id: '',
            type: '',
            title: '',
            content: '',
            weight: ''
          },
          submitBtnLoading: false,
          faqDetailDialogVisible: false
        }
      },
      computed: {
        ...mapGetters([
          'feedbackFaqs'
        ]),
        contentShortLength() {
          return this.postForm.content_short.length
        },
        isEdit() {
          return this.$route.meta.isEdit
        }
      },
      created() {
        if (this.isEdit) {
          this.fetchData();
        }
      },
      methods: {
        fetchData() {
          let id = this.$route.query.id
          // vuex 的方式
          // let a = _.find(this.feedbackFaqs, function (faq) {
          //   return faq.id == id
          // })

          // local storage
          let a = JSON.parse(localStorage.getItem(`feedbackFaq${id}`))
          if (a) {
            this.postForm = a
          }
        },
        checkForm () {
          if (!this.postForm.title || this.postForm.title.trim().length < 1) {
            this.notifyErr('请检查标题')
            return false
          }
          if (!this.postForm.type || this.postForm.type < 1) {
            this.notifyErr('请检查类型')
            return false
          }
          if (!this.postForm.weight || this.postForm.weight < 1) {
            this.notifyErr('请检查权重')
            return false
          }
          if (!this.postForm.content || this.postForm.content.trim().length < 1) {
            this.notifyErr('请检查正文')
            return false
          }
          return true
        },
        previewFaq () {
          if (!this.checkForm()) {
            return
          }
          this.faqDetailDialogVisible = true
        },
        submitFaq () {
          if (!this.checkForm()) {
            return
          }
          if (this.isEdit) {
            this.updateFaq()
          } else {
            this.createFaq()
          }
        },
        async createFaq () {
          let params = {
            title: this.postForm.title,
            content: this.postForm.content,
            weight: this.postForm.weight,
            type: this.postForm.type
          }
          this.submitBtnLoading = true
          try {
            let result = await api.createFeedbackFaq(params)
            if (result) {
              this.notifySuccess('创建成功')
              this.$router.replace('./feedbackFAQ')
            } else {
              this.notifyErr('创建失败了')
            }
          } catch (err) {
            window.alert(err)
          }
          this.submitBtnLoading = false
        },
        async updateFaq () {
          let params = {
            common_problem_id: this.postForm.id,
            title: this.postForm.title,
            content: this.postForm.content,
            weight: this.postForm.weight,
            type: this.postForm.type
          }
          this.submitBtnLoading = true
          try {
            let result = await api.updateFeedbackFaq(params)
            if (result) {
              this.notifySuccess('更新成功')
              this.$router.replace('./feedbackFAQ')
            } else {
              this.notifyErr('更新失败了')
            }
          } catch (err) {
            window.alert(err)
          }
          this.submitBtnLoading = false
        },
        async updateWeight () {
          let data = []
          data.push({
            id: this.postForm.id,
            weight: this.postForm.weight
          })
          try {
            let result = await api.updateFeedbackFaqWeight(data)
            if (result) {
              this.notifySuccess('更新成功')
              this.$router.replace('./feedbackFAQ')
            } else {
              this.notifyErr('更新失败了')
            }
          } catch (err) {
            window.alert(err)
          }
        },
        cancelUpdateDialog () {
          this.faqDetailDialogVisible = false
        },
        notifySuccess(msg='成功') {
          this.$notify.success({
            title: '成功',
            message: msg,
            duration: 1000
          });
        },
        notifyErr(msg='出错了') {
          this.$notify.error({
            title: '出错了',
            message: msg,
            duration: 1000
          })
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .editFeedbackFqa-container {
    position: relative;
    .edit-feedback-faq-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
