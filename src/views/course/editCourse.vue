<template>
  <div v-if="course" style="margin: 40px 0; min-width: 900px;">
    <el-form v-loading="formLoading" class="small-space" :model="course" :rules="rules" ref="course" label-width="150px" style='width: 92%; margin-left:4%;'>

      <Box>
        <span slot="box-header" style="">课程基础信息</span>
        <div slot="box-body">
          <el-form-item label="课程名称">
            <el-input v-model="course.name" style="width: 55%;" placeholder="请输入课程名称">
            </el-input>
            <el-button type="primary" style="margin-right: 100px;" @click.prevent="updateName">更新课程名称</el-button>
          </el-form-item>

          <el-form-item label="课程封面">
            <el-upload class="course-avatar-uploader" action="" :show-file-list="false" :http-request="uploadCourseAvatar" :before-upload="beforeCourseAvatarUpload">
              <img v-if="course.avatar" :src="course.avatar" class="edit-course-avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style=""></i>
            </el-upload>
            <el-button style="float: left;" type="primary" @click.prevent="updateAvatar">更新课程封面</el-button>
          </el-form-item>

          <el-form-item label="课程公告">
            <el-input style="width: 55%;" v-model="course.notice" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入课程公告">
            </el-input>
            <el-button type="primary" @click.prevent="updateNotice">更新课程公告</el-button>
          </el-form-item>

          <el-form-item label="课程类型">
            <el-radio-group v-model="course.type">
              <el-radio :label="courseType.SYSTEM">系统课</el-radio>
              <el-radio :label="courseType.SHARE">分享课</el-radio>
            </el-radio-group>
            <el-button style="margin-right: 100px; margin-left: 40px;" type="primary" @click.prevent="updateCourseType">更新课程类型</el-button>
          </el-form-item>
          <el-form-item label="课程权重">
            <el-input v-model.number="course.weight" style="width: 35%;" type="price" placeholder="请输入课程权重">
              <template slot="append">数值大的排在前面，默认 1</template>
            </el-input>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updateWeight">更新课程权重</el-button>
          </el-form-item>
          <el-form-item label="报名截止时间" class="">
            <el-date-picker :editable="datePickerEditable" v-model="course.signupDeadline" type="date" placeholder="选择报名截止时间">
            </el-date-picker>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updateSignupDeadline">更新报名截止时间</el-button>
          </el-form-item>
          <el-form-item label="课程开始时间" class="">
            <el-date-picker :editable="datePickerEditable" v-model="course.beginAt" type="date" placeholder="选择课程开始时间">
            </el-date-picker>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updateBeginAt">更新课程开始时间</el-button>
          </el-form-item>
          <el-form-item label="课程结束时间" class="">
            <el-date-picker :editable="datePickerEditable" v-model="course.endAt" type="date" placeholder="选择课程结束时间">
            </el-date-picker>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updateEndAt">更新课程结束时间</el-button>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程价格设置</span>
        <div slot="box-body">
          <el-form-item label="价格">
            <el-input v-model.number="course.price" style="width: 55%;" type="number" placeholder="请输入价格，只能是整数">
              <template slot="append">元</template>
            </el-input>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updatePrice">更新课程价格</el-button>
          </el-form-item>
          <el-form-item label="会员价格">
            <el-input v-model.number="course.memberPrice" style="width: 55%;" type="number" placeholder="请输入会员价格，只能是整数">
              <template slot="append">元</template>
            </el-input>
            <el-button style="margin-right: 100px;" type="primary" @click.prevent="updateMemberPrice">更新会员价格</el-button>
          </el-form-item>
         </div>
      </Box>

      <Box>
        <span slot="box-header">课程人员信息</span>
        <div slot="box-body">
          <el-form-item label="教师介绍" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="填写教师介绍" name="1">
                <el-button type="primary" :loading="updatingTeacherIntro" @click.prevent="updateTeacherIntro" style="margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新教师介绍</el-button>
                <TeacherIntro v-on:clearTeacher="clearTeacher" :teacher="teacher_intros"></TeacherIntro>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="老师列表" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的老师列表" name="1">
                <el-button type="primary" :loading="updatingTeachers" @click.prevent="updateTeacher" style="margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新老师列表</el-button>
                <UserSelector :userList="teacher_list" v-on:selecteUser="selecteTeacher" v-on:deleteUser="deleteTeacher"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="管理员列表" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的管理员" name="1">
                <el-button type="primary" :loading="updatingAdmins" @click.prevent="updateAdmin" style="margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新管理员列表</el-button>
                <UserSelector :userList="admin_list" v-on:selecteUser="selecteAdmin" v-on:deleteUser="deleteAdmin"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="助教列表">
            <el-collapse accordion>
              <el-collapse-item title="设置课程的助教" name="1">
                <el-button type="primary" :loading="updatingAssistants" @click.prevent="updateAssistant" style="margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新助教列表</el-button>
                <UserSelector :userList="assistant_list" v-on:selecteUser="selecteAsistant" v-on:deleteUser="deleteAssitant"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程内容设置</span>
        <div slot="box-body">
          <!-- 系统课 -->
          <el-form-item v-if="course.type === courseType.SYSTEM" label="课程特色">
            <el-collapse accordion>
              <el-collapse-item title="课程的特色列表" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addFeature" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">新增一项特色</el-button>
                <span>当前共 {{ feature_list.length }} 项</span>
                <el-button type="primary" :loading="updatingFeatures" @click.prevent="updateFeature" style="height: 40px;margin-left: 10px;margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新课程特色</el-button>
                <CourseFeature v-for="(feature, index) in feature_list" :feature="feature" v-on:clearFeature="clearFeature" v-on:updateFeatureImgUrl="updateFeatureImgUrl" v-on:deleteFeature="deleteFeature" :key="feature.id"></CourseFeature>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <!-- 分享课 -->
          <el-form-item v-if="course.type === courseType.SHARE" label="课程图片">
            <el-collapse accordion>
              <el-collapse-item title="请注意图片尺寸：宽高比为 16 比 9，宽最低 1920 像素，高最低 1080 像素" name="1">
                <el-upload action="" list-type="picture-card"
                  :file-list="banner_list"
                  :before-upload="beforeBannerUpload"
                  :on-remove="removeBanner"
                  :http-request="uploadBanner">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-button style="float: left; margin: 15px 0;" type="primary" @click.prevent="updateBanners" :loading="updatingBanners">更新 banners</el-button>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="课程大纲">
            <el-collapse accordion>
              <el-collapse-item title="课程的大纲" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addOutline" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;margin-bottom: 7px;">新增一小节</el-button>
                <span>当前共 {{ outline_list.length }} 节</span>
                <el-button type="primary" :loading="updatingOutlines" @click.prevent="updateOutline" style="height: 40px;margin-left: 10px;margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新课程大纲</el-button>
                <CourseOutline v-for="(outline, index) in outline_list" :outline="outline" v-on:clearOutline="clearOutline" v-on:updateOutlineImgUrl="updateOutlineImgUrl" v-on:updateOutlineTimer="updateOutlineTimer" v-on:deleteOutline="deleteOutline" :key="outline.id"></CourseOutline>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="FAQ 列表">
            <el-collapse accordion>
              <el-collapse-item title="填写课程的常见问题和答案" name="1">
                <el-button type="primary" icon="plus" @click.prevent="addFaq" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;margin-bottom: 7px;">新增一段问答</el-button>
                <span>当前共 {{ faq_list.length }} 段</span>
                <el-button type="primary" :loading="updatingFaqs" @click.prevent="updateFaq" style="height: 40px;margin-left: 10px;margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新课程 faqs</el-button>
                <CourseFaq v-for="(faq, index) in faq_list" :faq="faq" v-on:clearFaq="clearFaq" v-on:deleteFaq="deleteFaq" :key="faq.id"></CourseFaq>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header">课程SEO设置</span>
        <div slot="box-body" style="paddingBottom: 20px;">
          <el-form-item label="标题">
            <el-input style="width: 55%;" v-model="tdk.title" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入标题">
            </el-input>
          </el-form-item>

          <el-form-item label="描述信息">
            <el-input style="width: 55%;" v-model="tdk.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入描述信息">
            </el-input>
          </el-form-item>

          <el-form-item label="关键字">
            <el-input style="width: 55%;" v-model="tdk.keywords" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入关键字">
            </el-input>
          </el-form-item>
          <p style="margin-left: 150px; margin-top: -15px; font-size: 13px; color: #999;">
            关键字使用英文逗号隔开不需要空格，末尾不需要标点符号
          </p>
          <el-button type="primary" @click.prevent="updateTDK" style="marginLeft: 150px;">更新SEO信息</el-button>
        </div>
      </Box>

    </el-form>
  </div>
</template>
<script>
  import rules from './rules'
  import LMT from './lengths'
  import { courseType, courseAvatarSize, actionTypeOptions, mediaType, featureContentTag, outlineContentTag, faqContentTag } from './types'
  import api from './api'
  import qs from 'qs'
  import userApi from '../userlist/api.js'
  import _ from 'lodash'

  import UserSelector from '../../components/UserSelector/index'
  import Box from '../../components/Box/Box'
  import CourseFeature from '../../components/CourseFeature/'
  import CourseOutline from '../../components/CourseOutline/'
  import CourseFaq from '../../components/CourseFaq/index'
  import TeacherIntro from '../../components/TeacherIntro/'
  import { parseTime, dateFormat } from 'utils'

  import moment from 'moment'

  export default {
    data () {
      return {
        id: undefined,
        course: undefined,
        courseType: courseType,
        courseAvatarSize: courseAvatarSize,
        actionTypeOptions: actionTypeOptions,
        rules: rules,
        datePickerEditable: false,
        formLoading: true,
        bannersLoading: true,
        updating: false,
        updatingTeacherIntro: false,
        updatingTeachers: false,
        updatingAdmins: false,
        updatingAssistants: false,
        updatingBanners: false,
        updatingFeatures: false,
        updatingOutlines: false,
        updatingFaqs: false,
        teacher_intros: {},
        teacher_list: [],
        admin_list: [],
        assistant_list: [],
        banner_list: [],
        feature_list: [],
        outline_list: [],
        faq_list: [],
        tdk: {
          title: '',
          desc: '',
          keywords: ''
        }
      }
    },
    components: { UserSelector, Box, CourseFeature, CourseOutline, CourseFaq, TeacherIntro },
    created () {
      this.id = this.$route.query.id
      // this.course = JSON.parse(localStorage.getItem(`course${this.id}`))
      if (this.id == 1) {
        this.$router.replace({path: '/course'})
        window.location.reload()
      }

      this.getCourseBaseInfo()
      this.getBanners()
      this.getFeatures()
      this.getOutlines()
      this.getFaqs()
      this.getTeacherIntros()
      this.getTeachers()
      this.getAdmins()
      this.getAssistans()
    },
    beforeDestroy () {
      localStorage.removeItem(`course${this.id}`)
    },
    methods: {
      async getCourseBaseInfo () {
        try {
          let result = await api.getCourseBaseInfo(this.id)
          if (result) {
            var signup = moment(result.signupDeadline).toISOString()
            var begin = moment(result.beginAt).toISOString()
            var end = moment(result.endAt).toISOString()

            this.course = result
            this.course.signupDeadline = signup
            this.course.beginAt = begin
            this.course.endAt = end

            this.formLoading = false

            let tdk = JSON.parse(result.tdk)
            if (tdk) this.tdk = Object.assign({}, tdk)
          }
        } catch (err) {
          this.formLoading = false
          window.alert(err)
        }
      },
      userDetailApis (ids) {
        let apiUserDetail = (id) => { return userApi.userDetail({ url: '/admin/user/user-info', data: {id: id}}) }
        return _.map(ids, apiUserDetail)
      },

      getAdminsDetail(admin_ids) {
        let apis = this.userDetailApis(admin_ids)
        let self = this
        Promise.all(apis).then(function (value) {
          self.admin_list = Array.from(value) || []
        }).catch(function(error){
          console.log(error)
        })
      },

      getAssistantsDetail(ast_ids) {
        let apis = this.userDetailApis(ast_ids)
        let self = this
        Promise.all(apis).then(function (value) {
          self.assistant_list = Array.from(value) || []
        }).catch(function(error){
          console.log(error)
        })

      },
      getTeachersDetail (teacher_ids) {
        let apis = this.userDetailApis(teacher_ids)
        let self = this
        Promise.all(apis).then(function (value) {
          self.teacher_list = Array.from(value) || []
        }).catch(function(error){
          console.log(error)
        })
      },
      async getTeachers () {
        try {
          // let url = '/admin/course/get-teacher-list?product_id=' + this.id
          let result = await api.getCourseTeacherList(this.id)
          if (result && result.length) {
            this.getTeachersDetail(result)
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async getAssistans () {
        // let url = '/admin/course/get-assistant-list?product_id=' + this.id
        let result = await api.getCourseAssistans(this.id)
        if (result && result.length) {
          this.getAssistantsDetail(result)
        }
      },
      async getAdmins() {
        // let url = '/admin/course/get-admin-list?product_id=' + this.id
        let result = await api.getCourseAdmins(this.id)
        if (result && result.length) {
          this.getAdminsDetail(result)
        }
      },
      async getTeacherIntros () {
        // let url = '/admin/course/teacher-intros?product_id=' + this.id
        let result = await api.getCourseTeacherIntros(this.id)
        let self = this
        if (result && result.length) {
          self.teacher_intros = {
            avatarUrl : result[0].content,
            name : result[0].teacherName,
            intro : result[0].text
          }
        }
      },
      async getBanners () {
        try {
          let result = await api.getCourseBanners(this.id)
          if (result) {
            this.banner_list = _.map(result, function(banner) {
              return { url: banner.content }
            })
          }
        } catch (err) {
          window.alert(err)
        }
      },
      generateFeatures (result) {
        var groups = {}
        for (var i = 0; i < result.length; i++) {
          var groupName = result[i].flag
          if (!groups[groupName]) {
            groups[groupName] = []
          }
          groups[groupName].push(result[i])
        }
        var myArray = []
        for (var groupName in groups) {
          myArray.push({flag: groupName, feature: groups[groupName]})
        }

        let features = []
        for (var i = 0; i < myArray.length; i++) {
          let obj = myArray[i].feature
          let flag = myArray[i].flag
          let feature = {id: flag}
          for (var j = 0; j < obj.length; j++) {
            let featureSlice = obj[j]
            switch (featureSlice.contentTag) {
              case featureContentTag.TITLE:
              feature.title = featureSlice.content
              break

              case featureContentTag.DESCRIPTION:
              feature.description = featureSlice.content
              break

              case featureContentTag.MEDIA:
              feature.imageUrl = featureSlice.content
              break

              default:
              break
            }
          }
          features.push(feature)
        }

        return features
      },
      async getFeatures () {
        try {
          let result = await api.getCourseFeatures(this.id)
          if (result) {
            this.feature_list = this.generateFeatures(result)
          }
        } catch (err) {
          window.alert(err)
        }
      },
      generateOutlines (result) {
        var groups = {}
        for (var i = 0; i < result.length; i++) {
          var groupName = result[i].flag
          if (!groups[groupName]) {
            groups[groupName] = []
          }
          groups[groupName].push(result[i])
        }
        var myArray = []
        for (var groupName in groups) {
          myArray.push({flag: groupName, outline: groups[groupName]})
        }

        let outlines = []
        for (var i = 0; i < myArray.length; i++) {
          let obj = myArray[i].outline
          let flag = myArray[i].flag
          let outline = {id: flag}
          for (var j = 0; j < obj.length; j++) {
            let outlineSlice = obj[j]
            switch (outlineSlice.contentTag) {
              case outlineContentTag.TITLE:
              outline.title = outlineSlice.content
              break

              case outlineContentTag.DESCRIPTION:
              outline.description = outlineSlice.content
              break

              case outlineContentTag.MEDIA:
              outline.imageUrl = outlineSlice.content
              break

              case outlineContentTag.TEXT:
              outline.outlineTime = outlineSlice.content
              break

              default:
              break
            }
          }
          outlines.push(outline)
        }
        return outlines
      },
      async getOutlines () {
        try {
          let result = await api.getCourseOutlines(this.id)
          if (result) {
            this.outline_list = this.generateOutlines(result)
          }
        } catch (err) {
          window.alert(err)
        }
      },
      generateFaqs (result) {
        var groups = {}
        for (var i = 0; i < result.length; i++) {
          var groupName = result[i].flag
          if (!groups[groupName]) {
            groups[groupName] = []
          }
          groups[groupName].push(result[i])
        }
        var myArray = []
        for (var groupName in groups) {
          myArray.push({flag: groupName, faq: groups[groupName]})
        }

        let faqs = []
        for (var i = 0; i < myArray.length; i++) {
          let obj = myArray[i].faq
          let flag = myArray[i].flag
          let faq = {id: flag}
          for (var j = 0; j < obj.length; j++) {
            let faqSlice = obj[j]
            switch (faqSlice.contentTag) {
              case faqContentTag.QUESTION:
              faq.question = faqSlice.content
              break

              case faqContentTag.ANSWER:
              faq.answer = faqSlice.content
              break

              default:
              break
            }
          }
          faqs.push(faq)
        }
        return faqs
      },
      async getFaqs () {
        try {
          let result = await api.getCourseFaqs(this.id)
          if (result) {
            this.faq_list = this.generateFaqs(result)
          }
        } catch (err) {
          window.alert(err)
        }
      },
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
        var self = this
        if (result) {
          return new Promise((resolve, reject) => {
            var _URL = window.URL || window.webkitURL
            let imageChecker = new Image()
            imageChecker.onload = function () {
              if (this.height < self.courseAvatarSize.HEIGHT || this.width < self.courseAvatarSize.WIDTH) {
                self.$message.error(`请检查课程封面图片的尺寸，宽不小于 ${self.courseAvatarSize.WIDTH} 像素，高不小于 ${self.courseAvatarSize.HEIGHT} 像素`)
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
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 20MB!');
        }
        return ( isJPG || isPNG) && isLt2M;
      },
      async uploadCourseAvatar (file) {
        var self = this
        let data = new window.FormData()
        data.append('avatar', file.file)
        try {
          let result = await api.postUploadPicture(data)
          if (result && result.avatar) {
            self.course.avatar = result.avatar
          }
        } catch (err) {
          window.alert(err)
        }
      },

      clearTeacher () {
        let teacher_intros = {
          avatarUrl: '',
          name: '',
          intro: ''
        }
        this.teacher_intros = teacher_intros
      },
      selecteTeacher (user) {
        let index = _.findIndex(this.teacher_list, function(teacher) { return teacher.id == user.id })
        if (index < 0) {
          this.teacher_list.push(user)
        }
      },
      deleteTeacher (userId) {
        let index = _.findIndex(this.teacher_list, function(teacher) { return teacher.id === userId})
        if (index > -1) {
          this.teacher_list.splice(index, 1)
        }
      },

      selecteAdmin (user) {
        if (this.admin_list.length < 1) {
          this.admin_list.push(user)
        } else {
          let hasEqualUserId = false
          for (var i = 0; i < this.admin_list.length; i++) {
            let admin = this.admin_list[i]
            if (user.id && admin.id === user.id) {
              hasEqualUserId = true
              break
            }
          }
          if (!hasEqualUserId && user.id) {
            this.admin_list.push(user)
          }
        }
      },

      deleteAdmin (userId) {
        let index = -1
        for (var i = 0; i < this.admin_list.length; i++) {
          let admin = this.admin_list[i]
          if (admin.id === userId) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.admin_list.splice(index, 1)
        }
      },

      selecteAsistant (user) {
        if (this.assistant_list.length < 1) {
          this.assistant_list.push(user)
        } else {
          let hasEqualUserId = false
          for (var i = 0; i < this.assistant_list.length; i++) {
            let assistant = this.assistant_list[i]
            if (user.id && assistant.id === user.id) {
              hasEqualUserId = true
              break
            }
          }
          if (!hasEqualUserId && user.id) {
            this.assistant_list.push(user)
          }
        }
      },

      deleteAssitant (userId) {
        let index = -1
        for (var i = 0; i < this.assistant_list.length; i++) {
          let assistant = this.assistant_list[i]
          if (assistant.id === userId) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.assistant_list.splice(index, 1)
        }
      },
      updateOutlineImgUrl (outlineId, outlineImageUrl) {
        for (var i = 0; i < this.outline_list.length; i++) {
          let tempOutline = this.outline_list[i]
          if (tempOutline.id === outlineId) {
            let clearOutline = { id: outlineId, title: tempOutline.title, description: tempOutline.description, imageUrl: outlineImageUrl, outlineTime: tempOutline.outlineTime }
            this.outline_list.splice(outlineId, 1, clearOutline)
            break
          }
        }
      },
      updateOutlineTimer (outlineId, outlineTime) {
        for (var i = 0; i < this.outline_list.length; i++) {
          let tempOutline = this.outline_list[i]
          if (tempOutline.id === outlineId) {
            let clearOutline = { id: outlineId, title: tempOutline.title, description: tempOutline.description, imageUrl: tempOutline.imageUrl, outlineTime: outlineTime }
            this.outline_list.splice(outlineId, 1, clearOutline)
            break
          }
        }
      },
      addOutline () {
        this.outline_list.push({ id: this.outline_list.length, title: '', description: '', imageUrl: '' })
      },
      clearOutline (outlineId) {
        for (var i = 0; i < this.outline_list.length; i++) {
          let tempOutline = this.outline_list[i]
          if (tempOutline.id === outlineId) {
            let clearOutline = { id: outlineId, title: '', description: '', imageUrl: '' }
            this.outline_list.splice(i, 1, clearOutline)
            break
          }
        }
      },
      deleteOutline (outlineId) {
        let index = -1
        for (var i = 0; i < this.outline_list.length; i++) {
          let outline = this.outline_list[i]
          if (outline.id === outlineId) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.outline_list.splice(index, 1)
          for (var i = index; i < this.outline_list.length; i++) {
            let outline = this.outline_list[i]
            outline.id -= 1
          }
        }
      },
      addFeature () {
        this.feature_list.push({ id: this.feature_list.length, title: '', description: '', imageUrl: '' })
      },
      clearFeature (featureId) {
        for (var i = 0; i < this.feature_list.length; i++) {
          let tempFeature = this.feature_list[i]
          if (tempFeature.id === featureId) {
            let clearFeature = { id: featureId, title: '', description: '', imageUrl: '' }
            this.feature_list.splice(i, 1, clearFeature)
            break
          }
        }
      },
      updateFeatureImgUrl (featureId, featureImgUrl) {
        for (var i = 0; i < this.feature_list.length; i++) {
          let tempFeature = this.feature_list[i]
          if (tempFeature.id === featureId) {
            let clearFeature = { id: featureId, title: tempFeature.title, description: tempFeature.description, imageUrl: featureImgUrl }
            this.feature_list.splice(featureId, 1, clearFeature)
            break
          }
        }

      },
      deleteFeature (featureId) {
        let index = -1
        for (var i = 0; i < this.feature_list.length; i++) {
          let feature = this.feature_list[i]
          if (feature.id === featureId) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.feature_list.splice(index, 1)
          for (var i = index; i < this.feature_list.length; i++) {
            let feature = this.feature_list[i]
            feature.id -= 1
          }
        }
      },

      addFaq () {
        this.faq_list.push({ id: this.faq_list.length, question: '', answer: '' })
      },

      clearFaq (faqId) {
        for (var i = 0; i < this.faq_list.length; i++) {
          let tempFaq = this.faq_list[i]
          if (tempFaq.id === faqId) {
            let clearFaq = { id: faqId, question: '', answer: '' }
            this.faq_list.splice(i, 1, clearFaq)
          }
        }
      },
      deleteFaq (faqId) {
        let index = -1
        for (var i = 0; i < this.faq_list.length; i++) {
          let tempFaq = this.faq_list[i]
          if (tempFaq.id === faqId) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.faq_list.splice(index, 1)
          for (var i = index; i < this.faq_list.length; i++) {
            let faq = this.faq_list[i]
            faq.id -= 1
          }
        }
      },
      removeBanner (file, fileList) {
        let index = -1
        for (var i = 0; i < this.banner_list.length; i++) {
          let banner = this.banner_list[i]
          if (file.status === 'success' && file.url === banner.url) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.banner_list.splice(index, 1)
        }
      },
      async uploadBanner (file) {
        // this.banner_file_uid_list.push(file.file.uid)
        let data = new window.FormData()
        data.append('cover', file.file)
        try {
          let result = await api.postUploadPicture(data)
          if (result && result.cover) {
            this.banner_list.push({url: result.cover})
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async updateTeacherIntro () {
        if (this.teacher_intros.avatarUrl.length < 1) {
          this.$message.error('请检查教师介绍中的头像')
          return
        }
        if (this.teacher_intros.name.length < LMT.teacherIntroNameMinLen ||
            this.teacher_intros.name.length > LMT.teacherIntroNameMaxLen) {
          this.$message.error(`教师介绍中的名字长度在 ${LMT.teacherIntroNameMinLen} 到 ${LMT.teacherIntroNameMaxLen} 之间`)
          return
        }
        if (this.teacher_intros.intro.length < LMT.teacherIntroTextMinLen ||
            this.teacher_intros.intro.length > LMT.teacherIntroTextMaxLen) {
          this.$message.error(`教师介绍中的内容长度在 ${LMT.teacherIntroTextMinLen} 到 ${LMT.teacherIntroTextMaxLen} 之间`)
          return
        }
        let teacher_intros = []
        let intro = {
          content : this.teacher_intros.avatarUrl,
          type : mediaType.IMG,
          teacher_name : this.teacher_intros.name,
          text : this.teacher_intros.intro
        }
        teacher_intros.push(JSON.stringify(intro))
        let dataToUpdate = { product_id: this.course.id, teacher_intros: teacher_intros}
        this.updatingTeacherIntro = true
        try {
          let result = await api.postUpdateTeacherIntro(dataToUpdate)
          this.updatingTeacherIntro = false
          if (result === 1) {
            this.notifyPostSuccess('更新教师介绍成功')
          }
        } catch (err) {
          this.updatingTeacherIntro = false
          window.alert(err)
        }
      },
      async updateTeacher () {
        if (this.teacher_list.length < 1) {
          this.$message.error('请检查老师列表')
          return
        }
        let teacher_ids = _.map(this.teacher_list, 'id')
        let teacher_names = _.map(this.teacher_list, 'fullname')
        let dataToUpdate = { product_id: this.course.id, teacher_ids: teacher_ids, teacher_names: teacher_names }
        try {
          this.updatingTeachers = true
          let result = await api.postUpdateTeachers(dataToUpdate)
          this.updatingTeachers = false
          if (result === 1) {
            this.notifyPostSuccess('更新老师成功')
          }
        } catch (err) {
          this.updatingTeachers = false
          window.alert(err)
        }

      },
      async updateAdmin () {
        if (this.admin_list.length < 1) {
          this.$message.error('请检查管理员列表')
          return
        }
        let admin_ids = _.map(this.admin_list, 'id')
        let admin_names = _.map(this.admin_list, 'fullname')
        let dataToUpdate = { product_id: this.course.id, admin_ids: admin_ids, admin_names: admin_names }
        this.updatingAdmins = true
        try {
          let result = await api.postUpdateAdmins(dataToUpdate)
          this.updatingAdmins = false
          if (result === 1) {
            this.notifyPostSuccess('更新管理员成功')
          }
        } catch (err) {
          this.updatingAdmins = false
          window.alert(err)
        }

      },
      async updateAssistant () {
        if (this.assistant_list.length < 1) {
          this.$message.error('请检查助教列表')
          return
        }
        let ast_ids = _.map(this.assistant_list, 'id')
        let ast_names = _.map(this.assistant_list, 'fullname')
        let dataToUpdate = { product_id: this.course.id, assistants: ast_ids, assistant_names: ast_names }
        this.updatingAssistants = true
        try {
          let result = await api.postUpdateAssistants(dataToUpdate)
          this.updatingAssistants = false
          if (result === 1) {
            this.notifyPostSuccess('更新助教成功')
          }
        } catch (err) {
          this.updatingAssistants = false
          window.alert(err)
        }
      },
      updateTDK () {
        if (!this.tdk.title && !this.tdk.desc && !this.tdk.keywords) {
          this.$message.error(`请输入搜索优化内容`)
          return
        }
        let params = {
          product_id: this.course.id,
          is_member: this.course.isMember,
          tdk: JSON.stringify(this.tdk)
        }
        this.update(params)
      },
      updateName () {
        if (this.course.name.length < LMT.nameMinLen || this.course.name.length > LMT.nameMaxLen) {
          this.$message.error(`请检查课程名称，长度在 ${LMT.nameMinLen} 到 ${LMT.nameMaxLen} 个字`)
          return
        }
        let params = { product_id: this.course.id, is_member: this.course.isMember, name: this.course.name }
        this.update(params)
      },
      updateDescription () {
        if (this.course.description.length < LMT.descriptionMinLen ||
            this.course.description.length > LMT.descriptionMaxLen) {
          this.$message.error(`请检查课程描述，长度在 ${LMT.descriptionMinLen} 到 ${LMT.descriptionMaxLen} 个字`)
          return
        }
        let params = { product_id: this.course.id, is_member: this.course.isMember, description: this.course.description }
        this.update(params)
      },
      updateNotice () {
        if (!this.course.notice) { this.course.notice = ''}
        if (this.course.notice.length > LMT.noticeMaxLen) {
          this.$message.error(`请检查课程公告，长度不得超过 ${LMT.noticeMaxLen} 个字`)
          return
        }
        let params = { product_id: this.course.id, is_member: this.course.isMember, notice: this.course.notice }
        this.update(params)
      },
      updateAvatar () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, avatar: this.course.avatar }
        this.update(params)
      },
      updateCourseType () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, type: this.course.type }
        this.update(params)
      },
      updateWeight () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, weight: this.course.weight }
        this.update(params)
      },
      updatePaymentType () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, payment_type: this.course.paymentType }
        this.update(params)
      },
      updatePrice () {
        if (!this.isValidNum(this.course.price) || this.course.price === '' || isNaN(this.course.price) || this.course.price < 0) {
          this.$message.error('请检查课程价格')
          return
        }
        let params = { product_id: this.course.id, is_member: this.course.isMember, price: this.course.price }
        this.update(params)
      },
      updateMemberPrice () {
        if (!this.isValidNum(this.course.memberPrice) || this.course.memberPrice === '' || isNaN(this.course.memberPrice) || this.course.memberPrice < 0) {
          this.$message.error('请检查会员价格')
          return
        }
        let params = { product_id: this.course.id, is_member: this.course.isMember, member_price: this.course.memberPrice }
        this.update(params)
      },
      updateIsMemberOnly () {
        let params = { product_id: this.course.id, is_member: this.course.isMember }
        this.update(params)
      },
      updateProductId () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, ios_product_id: this.course.iosProductId }
        this.update(params)
      },
      updateMemberProductId () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, ios_member_product_id: this.course.iosMemberProductId }
        this.update(params)
      },
      updateSignupDeadline () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, signup_deadline: this.getReplacedTime(this.formatTime(this.course.signupDeadline)) }
        this.update(params)
      },
      updateBeginAt () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, begin_at: this.formatTime(this.course.beginAt) }
        this.update(params)
      },
      updateEndAt () {
        let params = { product_id: this.course.id, is_member: this.course.isMember, end_at: this.getReplacedTime(this.formatTime(this.course.endAt)) }
        this.update(params)
      },
      getReplacedTime (time) {
        if (time.indexOf('00:00:00') !== -1) {
          return time.replace('00:00:00', '23:59:59')
        } else {
          return time
        }
      },
      async updateFeature () {
        if (this.feature_list.length < 1) {
          this.$message.error('请检查课程特色列表')
          return
        }
        let features = []
        for (var i = 0; i < this.feature_list.length; i++) {
          let feature = this.feature_list[i]
           // || feature.imageUrl.length < 1
          if (feature.title.length < LMT.featureTitleMinLen ||
              feature.title.length > LMT.featureTitleMaxLen ||
              feature.description.length < LMT.featureDescriptionMinLen ||
              feature.description.length > LMT.featureDescriptionMaxLen) {
            this.$message.error('请检查特色列表第 ' + (i + 1) + ' 项')
            return
          }

          let submitFeatureTitle = {
            content: feature.title,
            content_tag: featureContentTag.TITLE,
            flag: i
          }
          // features.push(submitFeatureTitle)
          features.push(JSON.stringify(submitFeatureTitle))

          let submitFeatureDesc = {
            content: feature.description,
            content_tag: featureContentTag.DESCRIPTION,
            flag: i
          }
          features.push(JSON.stringify(submitFeatureDesc))

          let submitfeatureImgurl = {
            content: feature.imageUrl,
            content_tag: featureContentTag.MEDIA,
            flag: i
          }
          features.push(JSON.stringify(submitfeatureImgurl))
        }
        try {
          this.updatingFeatures = true
          let result = await api.postUpdateFeatures({ product_id: this.course.id, features: features})
          this.updatingFeatures = false
          if (result) {
            this.notifyPostSuccess('更新课程特色成功')
          }
        } catch (err) {
          this.updatingFeatures = false
          window.alert(err)
        }
      },
      async updateOutline () {
        if (this.outline_list.length < 1) {
          this.$message.error('请检查课程大纲列表')
          return false
        }
        let outlines = []
        for (var i = 0; i < this.outline_list.length; i++) {
          let outline = this.outline_list[i]
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
          // outlines.push(submitOutlineTitle)
          outlines.push(JSON.stringify(submitOutlineTitle))

          let submitOutlineDesc = {
            content: outline.description,
            content_tag: outlineContentTag.DESCRIPTION,
            flag: i
          }
          outlines.push(JSON.stringify(submitOutlineDesc))

          let submitOutlineImgurl = {
            content: outline.imageUrl,
            content_tag: outlineContentTag.MEDIA,
            flag: i
          }
          outlines.push(JSON.stringify(submitOutlineImgurl))

          if (outline.outlineTime) {
            let submitOutlineTime = {
              content: outline.outlineTime,
              content_tag: outlineContentTag.TEXT,
              flag: i
            }
            outlines.push(JSON.stringify(submitOutlineTime))
          }
        }
        try {
          this.updatingOutlines = true
          let result = await api.postUpdateOutlines({ product_id: this.course.id, outlines: outlines})
          this.updatingOutlines = false
          if (result) {
            this.notifyPostSuccess('更新课程大纲成功')
          }
        } catch (err) {
          this.updatingOutlines = false
          window.alert(err)
        }

      },

      async updateFaq () {
        let faqs = []
        for (var i = 0; i < this.faq_list.length; i++) {
          let faq = this.faq_list[i]
          if (faq.question.length < LMT.faqQuestionMinLen ||
              faq.question.length > LMT.faqQuestionMaxLen ||
              faq.answer.length < LMT.faqAnswerMinLen ||
              faq.answer.length > LMT.faqQuestionMaxLen) {
            this.$message.error(`请检查 faq 列表第 ${i + 1} 段`)
            return
          }
          let submitFaqQuestion = {
            content: faq.question,
            content_tag: faqContentTag.QUESTION,
            type: mediaType.TEXT,
            flag: i
          }
          faqs.push(JSON.stringify(submitFaqQuestion))
          let submitFaqAnswer = {
            content: faq.answer,
            content_tag: faqContentTag.ANSWER,
            type: mediaType.TEXT,
            flag: i
          }
          faqs.push(JSON.stringify(submitFaqAnswer))
        }
        try {
          this.updatingFaqs = true
          let result = await api.postUpdateFaqs({ product_id: this.course.id, faqs: faqs})
          this.updatingFaqs = false
          if (result) {
            this.notifyPostSuccess('更新课程 faqs 成功')
          }
        } catch (err) {
          this.updatingFaqs = false
          window.alert(err)
        }
      },
      async updateBanners () {
        this.updatingBanners = true
        let banners = []
        for (var i = 0; i < this.banner_list.length; i++) {
          let banner = this.banner_list[i]
          if (banner.url) {
            let submitBanner = { content: banner.url, type: mediaType.IMG}
            banners.push(JSON.stringify(submitBanner))
          }
        }
        try {
          let result = await api.postUpdateBanners({ product_id: this.course.id, banners: banners})
          this.updatingBanners = false
          if (result) {
            this.notifyPostSuccess('更新课程图片成功')
          }
        } catch (err) {
          this.updatingBanners = false
          window.alert(err)
        }
      },
      async update (dataToUpdate) {
        // this.updating = true
        this.formLoading = true
        let params = { url: '/admin/course/update-course', data: dataToUpdate }
        try {
          let result = await api.postUpdateCourse(dataToUpdate)
          this.formLoading = false
          if (result) {
            this.notifyPostSuccess()
          }
        } catch (err) {
          this.formLoading = false
          window.alert(err)
        }
      },
      notifyResponseError (response, title='出错了') {
        this.$notify.error({
          title: title,
          message: response.data.message,
          duration: 1000
        })
      },
      notifyPostSuccess (msg='更新成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        })
      },
      isValidNum (val) {
        let str = '' + val
        let arr = str.split('.')
        if (arr && arr.length > 1 && arr[1].length > 2) {
          return false
        }
        return true
      },
      formatTime (dateString) {
        let r = parseTime(new Date(dateString), '{y}-{m}-{d} {h}:{i}:{s}')
        return r
      }
    }
  }

</script>
<style lang="scss">
  // .el-input {
  //   width: 80%;
  // }

  .el-button-right {
    float: right;
  }

  .box-header {
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: -ms-flex;
    display: flex;
    -webkit-box-pack: justify;
    -moz-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    -moz-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
  }
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
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .el-upload el-upload--text {
    width: 335px;
    height: 180px;
  }
  .avatar-uploader-icon {
    // border:1px solid #bfcbd9;
    border-radius: 4px;
    font-size: 28px;
    color: #8c939d;
    width: 335px;
    height: 180px;
    line-height: 180px;
    text-align: center;
  }
  .edit-course-avatar {
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
