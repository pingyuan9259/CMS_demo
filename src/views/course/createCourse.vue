<template>
  <div style="margin: 40px 0; min-width: 800px;">
    <el-form class="small-space" :model="temp" :rules="rules" ref="temp" label-width="150px" style='width: 92%; margin-left:4%;'>

      <Box>
        <span slot="box-header" style="">课程基础信息</span>
        <div slot="box-body">
          <el-form-item label="必填 课程名称" prop="name">
            <el-input v-model="temp.name" placeholder="请输入课程名称"></el-input>
          </el-form-item>

          <el-form-item label="必填 课程封面" prop="course_avatar">
            <el-upload class="course-avatar-uploader" action="" :show-file-list="false" :http-request="uploadCourseAvatar" :before-upload="beforeCourseAvatarUpload">
              <img v-if="temp.course_avatar" :src="temp.course_avatar" class="create-course-avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style=""></i>
            </el-upload>
            <span>课程封面请注意：宽最低 {{courseAvatarSize.WIDTH}} 像素，高最低 1080 像素</span>
          </el-form-item>

          <el-form-item label="课程类型">
            <el-radio-group v-model="temp.course_type">
              <el-radio :label="courseType.SYSTEM">系统课</el-radio>
              <el-radio :label="courseType.SHARE">分享课</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="必填 报名截止日期" class="" prop="signup_deadline">
            <el-date-picker :editable="datePickerEditable" v-model="temp.signup_deadline" type="date" placeholder="选择报名截止日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="必填 课程开始日期" class="" prop="begin_at">
            <el-date-picker :editable="datePickerEditable" v-model="temp.begin_at" type="date" placeholder="选择课程开始日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="必填 课程结束日期" class="" prop="end_at">
            <el-date-picker :editable="datePickerEditable" v-model="temp.end_at" type="date" placeholder="选择课程结束日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程价格设置</span>
        <div slot="box-body">
          <el-form-item label="必填 价格" prop="price">
            <el-input v-model.number="temp.price" style="width: 55%;" type="number" placeholder="请输入价格，只能是整数">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="必填 会员价格" prop="member_price">
            <el-input v-model.number="temp.member_price" style="width: 55%;" type="number" placeholder="请输入会员价格，只能是整数">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程人员信息</span>
        <div slot="box-body">
          <el-form-item label="必填 教师介绍" :show-message="false" prop="teacher_intros">
            <el-collapse accordion>
              <el-collapse-item title="填写教师介绍" name="1">
                <TeacherIntro v-on:clearTeacher="clearTeacher" :teacher="temp.teacher_intros"></TeacherIntro>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="必填 老师列表" :show-message="false" prop="teacher_list">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的老师列表" name="1">
                <UserSelector :userList="temp.teacher_list" v-on:selecteUser="selecteTeacher" v-on:deleteUser="deleteTeacher"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="必填 管理员列表" :show-message="false" prop="admin_list">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的管理员" name="1">
                <UserSelector :userList="temp.admin_list" v-on:selecteUser="selecteAdmin" v-on:deleteUser="deleteAdmin"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="助教列表">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的助教" name="1">
                <UserSelector :userList="temp.assistant_list" v-on:selecteUser="selecteAsistant" v-on:deleteUser="deleteAssitant"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程内容设置</span>
        <div slot="box-body">

          <!-- 系统课 -->
          <el-form-item v-if="temp.course_type === courseType.SYSTEM" label="必填 课程特色" prop="feature_list">
            <el-collapse accordion>
              <el-collapse-item title="课程的特色列表，可不用传图片" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addFeature" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;">新增一项特色</el-button>
                <span>当前共 {{ temp.feature_list.length }} 项</span>
                <CourseFeature v-for="(feature, index) in temp.feature_list" :feature="feature" v-on:clearFeature="clearFeature" v-on:updateFeatureImgUrl="updateFeatureImgUrl" v-on:deleteFeature="deleteFeature" :key="feature.id"></CourseFeature>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <!-- 分享课 -->
          <el-form-item v-if="temp.course_type === courseType.SHARE" label="必填 课程图片" prop="banner_list">
            <el-collapse accordion>
              <el-collapse-item title="请注意图片尺寸：宽高比为 16 比 9，宽最低 1920 像素，高最低 1080 像素" name="1">
                <el-upload action="" list-type="picture-card"
                  :file-list="temp.banner_list"
                  :on-remove="removeBanner"
                  :before-upload="beforeBannerUpload"
                  :http-request="uploadBanner">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="必填 课程大纲" prop="outline_list">
            <el-collapse accordion>
              <el-collapse-item title="课程的大纲" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addOutline" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;margin-bottom: 7px;">新增一小节</el-button>
                <span>当前共 {{ temp.outline_list.length }} 节</span>
                <CourseOutline v-for="(outline, index) in temp.outline_list" :outline.sync="outline" v-on:clearOutline="clearOutline" v-on:updateOutlineImgUrl="updateOutlineImgUrl" v-on:updateOutlineTimer="updateOutlineTimer" v-on:deleteOutline="deleteOutline" :key="outline.id"></CourseOutline>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="FAQ 列表">
            <el-collapse accordion>
              <el-collapse-item title="填写课程的常见问题和答案" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addFaq" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;margin-bottom: 7px;">新增一段问答</el-button>
                <span>当前共 {{ temp.faq_list.length }} 段</span>
                <CourseFaq v-for="(faq, index) in temp.faq_list" :faq="faq" v-on:clearFaq="clearFaq" v-on:deleteFaq="deleteFaq" :key="faq.id"></CourseFaq>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </div>
      </Box>

    </el-form>

    <el-dialog style="min-width: 1000px;" title="课程预览" size="large" :visible.sync="dialogPreviewVisible">
      <CoursePreview :coursePreview="temp"></CoursePreview>
    </el-dialog>

    <div class="block" style="display: block;text-align: center;">
        <!-- <el-button style="margin: 0 30px;" type="" v-popover:popover>预览</el-button> -->
        <el-button style="margin: 0 30px;" @click="previewTempCourse">预览</el-button>
        <el-button style="margin: 0 30px;" type="primary" :loading="submitBtnLoading" @click="submitCourse">提交</el-button>
    </div>

  </div>
</template>
<script>
  import rules from './rules'
  import { courseType, courseAvatarSize, actionTypeOptions, mediaType, featureContentTag, outlineContentTag, faqContentTag } from './types'
  import CourseFeature from '../../components/CourseFeature/'
  import TeacherIntro from '../../components/TeacherIntro/'
  import CourseOutline from '../../components/CourseOutline/'
  import CourseFaq from '../../components/CourseFaq/index'
  import UserSelector from '../../components/UserSelector/index'
  import Box from '../../components/Box/Box'
  import CoursePreview from '../../components/CoursePreview/'
  import { parseTime, dateFormat } from 'utils'
  import LMT from './lengths'
  import _ from 'lodash'
  import qs from 'qs'
  import api from './api.js'

  export default {
    data() {
      return {
        // listLoading: true,
        dialogPreviewVisible: false,
        banner_file_uid_list: [],
        submitData: {},
        submitBtnLoading: false,
        datePickerEditable: false,
        creater: {},
        temp: {
          name: '',
          // description: '',
          // notice: '',
          // create_user_id: '',
          course_avatar: '',
          course_type: 1,
          signup_deadline: undefined,
          begin_at: undefined,
          end_at: undefined,
          price: undefined,
          member_price: undefined,
          teacher_intros: {
            avatarUrl: '',
            name: '',
            intro: ''
          },
          admin_list: [],
          teacher_list: [],
          assistant_list: [],
          banner_list: [],
          feature_list: [
            { id: 0, title: '', description: '', imageUrl: '' },
          ],
          outline_list: [
            // { id: 0, title: '', description: '', show_begin: '', show_end: '' },
            { id: 0, title: '', description: '', imageUrl: '', outlineTime: '' },
          ],
          faq_list: []
        },
        courseAvatarSize: courseAvatarSize,
        courseType: courseType,
        actionTypeOptions: actionTypeOptions,
        rules: rules,
        sortOptions: [{
          label: '按ID升序',
          key: '+id'
        }, {
          label: '按ID降序',
          key: '-id'
        }],
        dialogImageUrl: '',
        dialogVisible: false,
      }
    },
    components: { CourseFeature, TeacherIntro, CourseOutline, CourseFaq, UserSelector, Box, CoursePreview },
    created () {
    },
    computed : {
      creater_list: function () {
        if (this.creater.id) {
          let tmp_creater_list = []
          tmp_creater_list.push(this.creater)
          return tmp_creater_list
        } else {
          return []
        }
      }
    },
    methods: {
      handleCreate () {
        this.resetTemp()
      },
      create () {
      },
      update () {
      },
      addOutline () {
        this.temp.outline_list.push({ id: this.temp.outline_list.length, title: '', description: '', imageUrl: '', outlineTime: '' })
      },
      addFeature () {
        this.temp.feature_list.push({ id: this.temp.feature_list.length, title: '', description: '', imageUrl: '' })
      },
      addFaq () {
        this.temp.faq_list.push({ id: this.temp.faq_list.length, question: '', answer: '' })
      },
      resetTemp() {
        this.temp = {
          name: '',
          course_avatar: '',
          course_type: 1,
          signup_deadline: undefined,
          begin_at: undefined,
          end_at: undefined,
          price: undefined,
          member_price: undefined,
          teacher_intros: {
            avatarUrl: '',
            name: '',
            intro: ''
          },
          admin_list: [],
          teacher_list: [],
          assistant_list: [],
          banner_list: [],
          feature_list: [
            { id: 0, title: '', description: '', imageUrl: '' },
          ],
          outline_list: [
            { id: 0, title: '', description: '', imageUrl: '', outlineTime: '' },
          ],
          faq_list: []
        }
      },
      resetSubmiData () {
        this.submitData = {}
      },
      deleteFeature (featureId) {
        let index = _.findIndex(this.temp.feature_list, function(feature) { return feature.id == featureId })
        if (index > -1) {
          this.temp.feature_list.splice(index, 1)
          for (var i = index; i < this.temp.feature_list.length; i++) {
            let feature = this.temp.feature_list[i]
            feature.id -= 1
          }
        }
      },
      deleteOutline (outlineId) {
        let index = _.findIndex(this.temp.outline_list, function(outline) { return outline.id == outlineId })
        if (index > -1) {
          this.temp.outline_list.splice(index, 1)
          for (var i = index; i < this.temp.outline_list.length; i++) {
            let outline = this.temp.outline_list[i]
            outline.id -= 1
          }
        }
      },
      deleteFaq (faqId) {
        let index = _.findIndex(this.temp.faq_list, function(faq) { return faq.id == faqId })
        if (index > -1) {
          this.temp.faq_list.splice(index, 1)
          for (var i = index; i < this.temp.faq_list.length; i++) {
            let faq = this.temp.faq_list[i]
            faq.id -= 1
          }
        }
      },
      clearTeacher () {
        let teacher_intros = {
          avatarUrl: '',
          name: '',
          intro: ''
        }
        this.temp.teacher_intros = teacher_intros
      },
      clearFeature (featureId) {
        let index = _.findIndex(this.temp.feature_list, function(feature) { return feature.id == featureId })
        if (index > -1) {
          let clearFeature = { id: featureId, title: '', description: '', imageUrl: '' }
          this.temp.feature_list.splice(index, 1, clearFeature)
        }
      },
      clearOutline (outlineId) {
        let index = _.findIndex(this.temp.outline_list, function(outline) { return outline.id == outlineId })
        if (index > -1) {
          let clearOutline = { id: outlineId, title: '', description: '', imageUrl: '' }
          this.temp.outline_list.splice(index, 1, clearOutline)
        }
      },
      clearFaq (faqId) {
        let index = _.findIndex(this.temp.faq_list, function(faq) { return faq.id == faqId })
        if (index > -1) {
          let clearFaq = { id: faqId, title: '', description: '', imageUrl: '' }
          this.temp.faq_list.splice(index, 1, clearFaq)
        }
      },
      updateFeatureImgUrl (featureId, featureImgUrl) {
        for (var i = 0; i < this.temp.feature_list.length; i++) {
          let tempFeature = this.temp.feature_list[i]
          if (tempFeature.id === featureId) {
            let clearFeature = { id: featureId, title: tempFeature.title, description: tempFeature.description, imageUrl: featureImgUrl }
            this.temp.feature_list.splice(featureId, 1, clearFeature)
            break
          }
        }
      },
      updateOutlineImgUrl (outlineId, outlineImageUrl) {
        for (var i = 0; i < this.temp.outline_list.length; i++) {
          let tempOutline = this.temp.outline_list[i]
          if (tempOutline.id === outlineId) {
            let clearOutline = { id: outlineId, title: tempOutline.title, description: tempOutline.description, imageUrl: outlineImageUrl, outlineTime: tempOutline.outlineTime }
            this.temp.outline_list.splice(outlineId, 1, clearOutline)
            break
          }
        }
      },
      updateOutlineTimer (outlineId, outlineTime) {
        for (var i = 0; i < this.temp.outline_list.length; i++) {
          let tempOutline = this.temp.outline_list[i]
          if (tempOutline.id === outlineId) {
            let clearOutline = { id: outlineId, title: tempOutline.title, description: tempOutline.description, imageUrl: tempOutline.imageUrl, outlineTime: outlineTime }
            this.temp.outline_list.splice(outlineId, 1, clearOutline)
            break
          }
        }
      },
      selecteCreater (user) {
        this.temp.create_user_id = user.id
        this.creater = user
      },
      selecteAdmin (user) {
        let index = _.findIndex(this.temp.admin_list, function(admin) { return user.id === admin.id })
        if (index < 0) {
          this.temp.admin_list.push(user)
        }
      },
      selecteTeacher (user) {
        let index = _.findIndex(this.temp.teacher_list, function(teacher) { return user.id === teacher.id })
        if (index < 0) {
          this.temp.teacher_list.push(user)
        }
      },
      selecteAsistant (user) {
        let index = _.findIndex(this.temp.assistant_list, function(ast) { return user.id === ast.id })
        if (index < 0) {
          this.temp.assistant_list.push(user)
        }
      },
      deleteCreater (userId) {
        this.temp.create_user_id = ''
        this.creater = {}
      },
      deleteAdmin (userId) {
        let index = _.findIndex(this.temp.admin_list, function(admin) { return userId === admin.id })
        if (index > -1) {
          this.temp.admin_list.splice(index, 1)
        }
      },
      deleteTeacher (userId) {
        let index = _.findIndex(this.temp.teacher_list, function(teacher) { return userId === teacher.id })
        if (index > -1) {
          this.temp.teacher_list.splice(index, 1)
        }
      },
      deleteAssitant (userId) {
        let index = _.findIndex(this.temp.assistant_list, function(ast) { return userId === ast.id })
        if (index > -1) {
          this.temp.assistant_list.splice(index, 1)
        }
      },
      // handleCommand (command) {
        // let courseId = command.split('#')[1]
        // let action = command.split('#')[0]
        // console.log(action + ': ' + courseId)
      // },
      // handleRemove (file, fileList) {
      // },
      // handlePictureCardPreview (file) {
      //   this.dialogImageUrl = file.url;
      //   this.dialogVisible = true;
      // },
      // handleCourseAvatarUploadSuccess (res, file) {
      //   this.temp.course_avatar = URL.createObjectURL(file.raw);
      // },
      beforeCourseAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 20MB!')
        }
        let result = ( isJPG || isPNG) && isLt2M;
        if (result) {
          var self = this
          return new Promise((resolve, reject) => {
            var _URL = window.URL || window.webkitURL
            let imageChecker = new Image()
            imageChecker.onload = function () {
              if (this.height < self.courseAvatarSize.HEIGHT || this.width < self.courseAvatarSize.WIDTH) {
                self.temp.course_avatar = ''
                self.$message.error('请检查课程封面图片的尺寸')
                reject()
              } else {
                resolve(file)
              }
            }
            imageChecker.src = _URL.createObjectURL(file)
          })
        } else {
          return false
        }
      },
      beforeBannerUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 20MB!')
        }
        let result = ( isJPG || isPNG) && isLt2M;
        if (result) {
          var self = this
          return new Promise((resolve, reject) => {
            var _URL = window.URL || window.webkitURL
            let imageChecker = new Image()
            imageChecker.onload = function () {
              if (this.height < self.courseAvatarSize.HEIGHT || this.width < self.courseAvatarSize.WIDTH) {
                self.temp.course_avatar = ''
                self.$message.error('请检查课程图片的尺寸')
                reject()
              } else {
                resolve(file)
              }
            }
            imageChecker.src = _URL.createObjectURL(file)
          })
        } else {
          return false
        }
      },
      removeBanner (file, fileList) {
        let index = -1
        for (var i = 0; i < this.temp.banner_list.length; i++) {
          let uid = this.temp.banner_list[i].uid
          if (file.uid === uid) {
            index = i
            break
          }
        }
        if (index >- 1) {
          this.temp.banner_list.splice(i, 1)
          this.banner_file_uid_list.splice(i, 1)
        }
      },
      async uploadBanner (file) {
        this.banner_file_uid_list.push(file.file.uid)
        var self = this
        let data = new window.FormData()
        data.append('cover', file.file)
        try {
          let result = await api.postUploadPicture(data)
          if (result && result.cover) {
            self.temp.banner_list.push({ url: result.cover })
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async uploadCourseAvatar (file) {
        var self = this
        let data = new window.FormData()
        data.append('avatar', file.file)
        try {
          let result = await api.postUploadPicture(data)
          if (result && result.avatar) {
            self.temp.course_avatar= result.avatar
          }
        } catch (err) {
          window.alert(err)
        }
      },
      resetForm (formName) {
        // this.dialogFormVisible = false
        // this.$refs[formName].resetFields()
      },
      checkNumInput (val) {
        // console.log('------ checkNumInput : ', val)
      },
      checkSubmitData () {
        if (this.temp.name.length < LMT.nameMinLen || this.temp.name.length > LMT.nameMaxLen) {
          this.$message.error('请检查课程名称')
          return false
        }
        this.submitData.name = this.temp.name


        if (!this.temp.course_avatar || this.temp.course_avatar.length < 1) {
          this.$message.error('请检查课程封面')
          return false
        }
        this.submitData.avatar = this.temp.course_avatar

        this.submitData.type = this.temp.course_type

        if (!this.temp.signup_deadline) {
          this.$message.error('请检查报名截止时间')
          return false
        }
        this.submitData.signup_deadline = this.formatTime(this.temp.signup_deadline)
        this.submitData.signup_deadline = this.submitData.signup_deadline.replace('00:00:00', '23:59:59')

        if (!this.temp.begin_at) {
          this.$message.error('请检查课程开始时间')
          return false
        }
        this.submitData.begin_at = this.formatTime(this.temp.begin_at)

        if (!this.temp.end_at) {
          this.$message.error('请检查课程结束时间')
          return false
        }
        this.submitData.end_at = this.formatTime(this.temp.end_at)
        this.submitData.end_at = this.submitData.end_at.replace('00:00:00', '23:59:59')

        if (!this.isValidNum(this.temp.price) || this.temp.price === '' || isNaN(this.temp.price) || this.temp.price < 0) {
          this.$message.error('请检查课程价格')
          return false
        }
        this.submitData.price = this.temp.price

        if (!this.isValidNum(this.temp.member_price) || this.temp.member_price === '' || isNaN(this.temp.member_price) || this.temp.member_price < 0) {
          this.$message.error('请检查会员价格')
          return false
        }
        this.submitData.member_price = this.temp.member_price

        if (this.temp.teacher_intros.avatarUrl.length < 1) {
          this.$message.error('请检查教师介绍中的头像')
          return false
        }
        if (this.temp.teacher_intros.name.length < LMT.teacherIntroNameMinLen ||
            this.temp.teacher_intros.name.length > LMT.teacherIntroNameMaxLen) {
          this.$message.error(`教师介绍中的名字长度在 ${LMT.teacherIntroNameMinLen} 到 ${LMT.teacherIntroNameMaxLen} 之间`)
          return false
        }
        if (this.temp.teacher_intros.intro.length < LMT.teacherIntroTextMinLen ||
            this.temp.teacher_intros.intro.length > LMT.teacherIntroTextMaxLen) {
          this.$message.error(`教师介绍中的内容长度在 ${LMT.teacherIntroTextMinLen} 到 ${LMT.teacherIntroTextMaxLen} 之间`)
          return false
        }

        this.submitData.teacher_intros = []
        let intro = {
          content : this.temp.teacher_intros.avatarUrl,
          type : mediaType.IMG,
          teacher_name : this.temp.teacher_intros.name,
          text : this.temp.teacher_intros.intro
        }
        this.submitData.teacher_intros.push(JSON.stringify(intro))

        if (this.temp.teacher_list.length < 1) {
          this.$message.error('请检查老师列表')
          return false
        }

        this.submitData.teacher_ids = _.map(this.temp.teacher_list, 'id')

        if (this.temp.admin_list.length < 1) {
          this.$message.error('请检查管理员列表')
          return false
        }
        this.submitData.admin_ids = []
        for (var i = 0; i < this.temp.admin_list.length; i++) {
          let admin = this.temp.admin_list[i]
          if (admin.id) {
            this.submitData.admin_ids.push(admin.id)
          }
        }

        // 请检查助教列表
        this.submitData.teaching_assistant_ids = []
        for (var i = 0; i < this.temp.assistant_list.length; i++) {
          let assistant = this.temp.assistant_list[i]
          if (assistant.id) {
            this.submitData.teaching_assistant_ids.push(assistant.id)
          }
        }

        if (this.temp.course_type === courseType.SYSTEM) {
          if (this.temp.feature_list.length < 1) {
            this.$message.error('请检查课程特色列表')
            return false
          }
          this.submitData.features = []
          for (var i = 0; i < this.temp.feature_list.length; i++) {
            let feature = this.temp.feature_list[i]
             // || feature.imageUrl.length < 1
            if (feature.title.length < LMT.featureTitleMinLen ||
                feature.title.length > LMT.featureTitleMaxLen ||
                feature.description.length < LMT.featureDescriptionMinLen ||
                feature.description.length > LMT.featureDescriptionMaxLen) {
              this.$message.error('请检查特色列表第 ' + (i + 1) + ' 项')
              return false
            }

            let submitFeatureTitle = {
              content: feature.title,
              content_tag: featureContentTag.TITLE,
              flag: i
            }
            // this.submitData.features.push(submitFeatureTitle)
            this.submitData.features.push(JSON.stringify(submitFeatureTitle))

            let submitFeatureDesc = {
              content: feature.description,
              content_tag: featureContentTag.DESCRIPTION,
              flag: i
            }
            this.submitData.features.push(JSON.stringify(submitFeatureDesc))

            let submitfeatureImgurl = {
              content: feature.imageUrl,
              content_tag: featureContentTag.MEDIA,
              flag: i
            }
            this.submitData.features.push(JSON.stringify(submitfeatureImgurl))
          }
        }

        if (this.temp.course_type === courseType.SHARE) {
          if (this.temp.banner_list.length < 1) {
            this.$message.error('请检查课程图片列表')
            return false
          }
          this.submitData.banners = []
          for (var i = 0; i < this.temp.banner_list.length; i++) {
            let banner = this.temp.banner_list[i]
            let submitBanner = { content: banner.url, type: mediaType.IMG}
            this.submitData.banners.push(JSON.stringify(submitBanner))
          }
        }

        if (this.temp.outline_list.length < 1) {
          this.$message.error('请检查课程大纲列表')
          return false
        }
        this.submitData.outlines = []
        for (var i = 0; i < this.temp.outline_list.length; i++) {
          let outline = this.temp.outline_list[i]
          if (outline.title.length < LMT.outlineTitleMinLen ||
              outline.title.length > LMT.outlineTitleMaxLen ||
              outline.description.length < LMT.outlineDescriptionMinLen ||
              outline.description.length > LMT.outlineDescriptionMaxLen ||
              outline.imageUrl.length < 1) {
            this.$message.error('请检查大纲列表第 ' + (i + 1) + ' 节')
            return false
          }
          let submitOutlineTitle = {
            content: outline.title,
            content_tag: outlineContentTag.TITLE,
            flag: i
          }
          // this.submitData.outlines.push(submitOutlineTitle)
          this.submitData.outlines.push(JSON.stringify(submitOutlineTitle))

          let submitOutlineDesc = {
            content: outline.description,
            content_tag: outlineContentTag.DESCRIPTION,
            flag: i
          }
          this.submitData.outlines.push(JSON.stringify(submitOutlineDesc))

          let submitOutlineImgurl = {
            content: outline.imageUrl,
            content_tag: outlineContentTag.MEDIA,
            flag: i
          }
          if (outline.outlineTime) {
            this.submitData.outlines.push(JSON.stringify(submitOutlineImgurl))
            let submitOutlineTime = {
              content: outline.outlineTime,
              content_tag: outlineContentTag.TEXT,
              flag: i
            }
            this.submitData.outlines.push(JSON.stringify(submitOutlineTime))
          }
        }

        // if (this.temp.faq_list.length < 1) {
        //   this.$message.error('请检查课程 Faq 列表')
        //   return false
        // }
        this.submitData.faqs = []
        for (var i = 0; i < this.temp.faq_list.length; i++) {
          let faq = this.temp.faq_list[i]
          if (faq.question.length < LMT.faqQuestionMinLen ||
              faq.question.length > LMT.faqQuestionMaxLen ||
              faq.answer.length < LMT.faqAnswerMinLen ||
              faq.answer.length > LMT.faqQuestionMaxLen) {
            this.$message.error(`请检查 faq 列表第 ${i + 1} 段`)
            return false
          }
          let submitFaqQuestion = {
            content: faq.question,
            content_tag: faqContentTag.QUESTION,
            type: mediaType.TEXT,
            flag: i
          }
          this.submitData.faqs.push(JSON.stringify(submitFaqQuestion))
          let submitFaqAnswer = {
            content: faq.answer,
            content_tag: faqContentTag.ANSWER,
            type: mediaType.TEXT,
            flag: i
          }
          this.submitData.faqs.push(JSON.stringify(submitFaqAnswer))
        }
        return true
      },
      previewTempCourse () {
        if (this.submitBtnLoading) {
          return
        }
        if (!this.submitOutlineTime()) {
          return
        }
        this.dialogPreviewVisible = true
      },
      async submitCourse () {
        if (!this.checkSubmitData()) {
          return
        }
        let params = {url: '/admin/course/create-course', data: this.submitData}

        this.submitBtnLoading = true
        let self = this
        try {
          let result = await api.postCreateCourse(this.submitData)
          // self.submitBtnLoading = false
          if (result) {
            self.createBBS(result)
            self.createJob(result)
            self.createLiveShow(result)
          }
        } catch (err) {
          self.submitBtnLoading = false
          window.alert(err)
        }
      },
      async createBBS (result) {
        let self = this
        let product_id = result
        if (product_id) {
          try {
            let result = await api.postCreateCourseBBS({ product_id: product_id })
            self.submitBtnLoading = false
            if (result === 1) {
              // self.createJob(product_id)
            } else {
              this.notifyFailedSubmit(result || '出错了')
            }
          } catch (err) {
            self.submitBtnLoading = false
            window.alert(err)
          }
        }
      },
      async createJob (product_id) {
          let self = this
          try {
            let result = await api.postCreateCourseJob({ product_id: product_id })
            self.submitBtnLoading = false
            if (result === 1) {
              // self.createLiveShow(product_id)
            } else {
              this.notifyFailedSubmit(result || '出错了')
            }
          } catch (err) {
            self.submitBtnLoading = false
            window.alert(err)
          }
      },
      async createLiveShow (product_id) {
        let admins = this.temp.admin_list.map((admin) => {
          return JSON.stringify({
             id: admin.id || '',
             name: admin.fullname || ''
          })
        })
        let teachers = this.temp.teacher_list.map((teacher) => {
          return JSON.stringify({
            id: teacher.id || '',
            name: teacher.fullname || ''
          })
        })
        let dataToUpdate = { product_id: product_id, admins: admins, speakers: teachers }
        if (this.temp.assistant_list.length > 0) {
          let assistants = this.temp.assistant_list.map((assistant) => {
            return JSON.stringify({
              id: assistant.id || '',
              name: assistant.fullname || ''
            })
          })
          dataToUpdate = { product_id: product_id, admins: admins, speakers: teachers, assistants: assistants }
        }
        try {
          let result = await api.postCreateLiveshow(dataToUpdate)
          this.submitBtnLoading = false
          if (result === 1) {
            this.resetTemp()
            this.resetSubmiData()
            this.notifySuccessSubmit('创建课程成功')
            this.$router.replace({ path: './courseList'})
          } else {
            this.notifyFailedSubmit(result)
          }
        } catch (err) {
          this.submitBtnLoading = false
          window.alert(err)
        }
      },
      notifyFailedSubmit(msg='出错了') {
        this.$notify.error({
          title: '出错了',
          message: msg,
          duration: 1000
        })
      },
      notifySuccessSubmit (msg='成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        });
      },
      formatTime (dateString) {
        let r = parseTime(new Date(dateString), '{y}-{m}-{d} {h}:{i}:{s}')
        return r
      },
      isValidNum (val) {
        let str = '' + val
        let arr = str.split('.')
        if (arr && arr.length > 1 && arr[1].length > 2) {
          return false
        }
        return true
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }

</script>
<style lang="scss">
  .el-collapse {
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    overflow: hidden;
  }
  .course-avatar-uploader .el-upload {
    border: 0.5px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .course-avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    // border:1px solid #bfcbd9;
    border-radius: 4px;
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .create-course-avatar {
    width: 335px;
    height: 180px;
    display: block;
  }
  .el-card__header {
    padding: 0;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 335px;
    height: 180px;
  }
  .el-upload--picture-card {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
