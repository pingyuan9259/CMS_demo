<template>
  <div class="message-con">
  	<div class="message">
      <h3 class="title">创建推送消息</h3>

      <div class="push-box">
        <span class="step-title">第一步：</span><span class="tip">请选择推送类型</span>
        <el-tabs class="card" v-model="pushType" type="border-card">

          <el-tab-pane label="全员推送" name="all">
            <div class="user-label" style="margin-bottom: 20px;">消息将推送给所有用户</div>
          </el-tab-pane>

          <el-tab-pane label="用户推送" name="users">
            <div class="push-user">
              <div class="user-label">消息将推送给以下用户:</div>
              <el-tag
                :key="tag.id"
                :type="tag.type"
                v-for="tag in typeModel"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
              >
              {{tag.name}}
              </el-tag>
            </div>

            <user></user>

            <el-upload
              class="upload-file"
              :file-list="fileList"
              action="//read-pre.xinshengdaxue.com/readfile"
              :on-success="readFile">
              <el-button size="small" type="primary">导入文件</el-button>
              <div slot="tip" class="el-upload__tip">批量导入user_id</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="课程推送" name="course">
            <div class="user-label" style="margin-bottom: 20px;">消息将推送给所有购买<span :class="{'course-color': courseName}">{{ courseName ? courseName : '指定'}}</span>课程的用户</div>

            <course differ="push" status=""></course>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="message-box">
        <span class="step-title">第二步：</span><span class="tip">请选择消息类型</span>
        <el-tabs class="card" type="border-card" v-model="messageType">
          <el-tab-pane label="文本消息" name="text">
            <textarea class="text-con" rows="7" v-model="messageText" placeholder="请输入消息文字"></textarea>
          </el-tab-pane>
          <el-tab-pane label="图文消息" name="image">
            <!-- =================================================== -->
            <!-- 图文消息部分 -->
            <template>
              <p v-if="hasHead">消息banner</p>
              <div class="media-banner" v-if="hasHead">
                <el-upload class="avatar-uploader" style="width: 120px;" action=""
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :http-request="uploadImage"
                >
                  <img v-if="mediaBanner.image_url" :src="mediaBanner.image_url" class="avatar m-head">
                  <i v-else class="el-icon-plus avatar-uploader-icon m-head" @click="getUploadId(null)"></i>
                </el-upload>

                <div style="width: 75%;">
                  <el-input v-model="mediaBanner.title" placeholder="请输入banner标题" style="margin-top: 10px;"></el-input>
                  <el-input v-model="mediaBanner.summary" placeholder="请输入banner描述" style="margin-top: 10px;"></el-input>
                  <el-input v-model="mediaBanner.post_url" placeholder="请输入banner链接 （如 https://xxx.com）" style="margin-top: 10px;margin-bottom: 10px;"></el-input>
                </div>
                <el-button type="danger" size="small" icon="delete" @click.prevent="removeHead" class="del-button"></el-button>
              </div>
              <p v-if="mediaList.length > 0">图文消息组</p>
              <div class="media-item" v-for="(item, key) in mediaList">
                <el-upload class="avatar-uploader" style="width: 120px;" action=""
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :http-request="uploadImage"
                >
                  <img v-if="item.image_url" :src="item.image_url" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" @click="getUploadId(key)"></i>
                </el-upload>

                <div style="width: 75%;">
                  <el-input v-model="item.title" placeholder="请输入消息标题" style="margin-top: 10px;"></el-input>
                  <el-input v-model="item.post_url" placeholder="请输入消息链接 （如 https://xxx.com）" style="margin-top: 10px;"></el-input>
                </div>
                <el-button class="del-button" type="danger" size="small" icon="delete" @click.prevent="removeItem(item)"></el-button>
              </div>
            </template>
            <el-button type="primary" @click="addItem" icon="plus">添加图文组</el-button>
            <el-button v-if="!hasHead" type="primary" @click="addHead" icon="plus">添加banner</el-button>
            <!-- =================================================== -->
          </el-tab-pane>
          <el-tab-pane label="链接消息" name="link">
            <div class="link-text">
              <label>消息描述：</label>
              <el-input class="input-item" placeholder="请输入消息描述" v-model="describeText"></el-input>
            </div>
            <div class="link-text">
              <label>链接文字：</label>
              <el-input class="input-item" placeholder="请输入链接文字" v-model="linkText"></el-input>
            </div>
            <div class="link-address">
              <label>链接地址：</label><span class="tip">输入https链接或搜索课程生成APP内部超链接</span>
              <el-input class="input-item" placeholder="请输入链接地址" v-model="linkAddress"></el-input>
            </div>
            <course></course>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 兼容老版推送的按钮 -->
      <div class="button-box">
        <el-button class="list-button" type="primary" @click="getMessage">消息列表</el-button>

        <el-button class="push-button" type="primary" @click="oldPush">确认推送</el-button>
      </div>

      <el-dialog title="历史消息" :visible.sync="showMessage">
        <el-table :data="messageList" border>
          <el-table-column align="center" label="机器人" width="120">
            <template scope="scope">
              <span>新生大学团队</span>
            </template>
          </el-table-column>
          <el-table-column align="center" property="content" label="内容"></el-table-column>
          <el-table-column align="center" label="时间" width="150">
            <template scope="scope">
              <span>{{ scope.row.created_at | time }}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showMessage = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="消息推送进度（推送中，请勿操作）" :visible.sync="showProgress">
        <el-progress :text-inside="true" :stroke-width="22" :percentage="parseInt((readyPush / totalPush) * 100, 10)" status="success"></el-progress>
      </el-dialog>
      <!-- 兼容老版推送的按钮 -->

      <!-- <el-button class="push-button" type="primary" @click="pushMessage">确认推送</el-button> -->
      <!-- <el-button class="push-button" type="primary" @click="oldPush">确认推送</el-button> -->
    </div>
  </div>
</template>
<script>
  import user from 'components/SearchUser/index'
  import course from 'components/SearchCourse/index'
  import { mapGetters } from 'vuex'
  import api from './api'
  import { APP_ENV } from 'config/app'
  import moment from 'moment'
  import validator from 'validator'
  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV
  export default {
    name: 'push-message',
    components: { user, course },
    data () {
      return {
        pushType: 'all',
        typeModel: [],
        users: [],
        courseId: null,
        courseName: '',
        listTitle: '',
        messageType: 'text',
        messageText: '',
        describeText: '',
        linkText: '',
        linkAddress: '',
        showMessage: false,
        totalPush: 1,
        readyPush: 0,
        showProgress: false,
        messageList: [],
        hasHead: false,   // 图文消息是否有banner头
        mediaBanner: {
          image_url: '',
          title: '',
          summary: '',
          post_url: ''
        },
        mediaList: [],
        uploadId: null,
        fileList: []
      }
    },
    filters: {
      time (value) {
        moment.locale('zh-cn')
        if (!value) { return }
        let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
        let proxDay = moment().subtract(1, 'days').format('YYYY-MM-DD') // 前一天年月日
        let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日
        let nowHour = moment().format('YYYY-MM-DD HH') // 当前小时
        let commentHour = moment(value).format('YYYY-MM-DD HH') // 传进来的小时

        if (moment(nowDay).isSame(commentDay, 'day')) {
          if (moment(nowHour).isSame(commentHour, 'hour')) {
            let time = moment(value).fromNow()
            if (time.indexOf('几秒') !== -1) {
              time = '1分钟内'
            } else {
              time = time.replace(/\s/g, '')
            }
            return time
          } else {
            return '今天' + moment(value).format('HH:mm')
          }
        } else if (moment(proxDay).isSame(commentDay, 'day')) {
          return '昨天' + moment(value).format('HH:mm')
        } else {
          return moment(value).format('YYYY-MM-DD')
        }
      }
    },
    watch: {
      pushType (val) {
        if (val === 'all') {
          this.users = []
          this.typeModel = []
          this.courseId = null
          this.courseName = ''
        } else if (val === 'users') {
          this.typeModel = []
          this.courseId = null
          this.courseName = ''
        } else {
          this.users = []
          this.typeModel = []
        }
      },
      messageType (val) {
        if (val === 'link') {
          this.messageText = ''
        } else {
          this.linkText = ''
          this.linkAddress = ''
        }
      },
      choose (val) {
        if (val.fullname) {
          this.typeModel.push({name: val.fullname, id: val.id, type: 'primary'})
          this.users.push(val.id)
        } else if (val.differ === 'push') {
          this.courseId = val.id
          this.courseName = val.name
        } else {
          this.linkAddress = `tinfinite://dl/page?url=https://h${ENV}.xinshengdaxue.com/courseDetail?courseId=${val.id}`
        }
      }
    },
    computed: {
      ...mapGetters([
        'choose'
      ])
    },
    methods: {
      handleClose(tag) {
        this.typeModel.splice(this.typeModel.indexOf(tag), 1)
        this.users.splice(this.users.indexOf(tag.id), 1)
      },
      checkContent () {
        if ((this.messageType === 'text') && !this.messageText) {
          this.$notify({
            title: '提示',
            message: '消息内容不可为空',
            type: 'warning',
            duration: 2000
          })
          return false
        } else if (this.messageType === 'link' && (!this.linkAddress || !this.linkText)) {
          this.$notify({
            title: '提示',
            message: '链接文字或地址不可为空',
            type: 'warning',
            duration: 2000
          })
          return false
        } else if (this.pushType === 'users' && this.users.length === 0) {
          this.$notify({
            title: '提示',
            message: '至少选择一个用户',
            type: 'warning',
            duration: 2000
          })
          return false
        }else if (this.pushType === 'course' && !this.courseId) {
          this.$notify({
            title: '提示',
            message: '请选择课程',
            type: 'warning',
            duration: 2000
          })
          return false
        } else {
          return true
        }
      },
      async pushMessage () {    //     ============ 新的推送接口 ============
        if (!this.checkContent()) { // 消息非空验证
          return
        }
        let content = ''            // 消息内容
        if (this.messageType === 'link') {          // 链接消息
          content = `<a href="${this.linkAddress}">${this.linkText}</a>`
        } else if (this.messageType === 'text') {   // 文本消息
          content = JSON.stringify({
            content: this.messageText
          })
        } else if (this.messageType === 'image') {  // 图文消息
          let mediaContent = {}
          if (this.mediaList.length > 0) {   // 图文组消息处理
            let menu = []
            for (let i of this.mediaList) {
              menu.push(i)
            }
            mediaContent.menu = menu
          }
          if (this.hasHead) {              // banner头消息处理
            mediaContent.heading = this.mediaBanner
          }
          content = JSON.stringify(mediaContent)   // 拼接内容字符串
        }

        if (this.pushType === 'all') {
          let mediaType
          switch (this.messageType) {
            case 'text':
              mediaType = -1   // 文本消息
              break
            case 'image':
              mediaType = 13   // 图文消息
              break
            case 'link':
              mediaType = 12   // render消息
              break
          }
          let params = {
            content: content,
            media_type: mediaType,
            message_type: 1,
            app_id: '56c6c309243cb728205a3dff',
            extend: '',
            offline: ''     //  离线推送的内容，不需要离线可以为空或者省略此字段
          }
          try {
            let result = await api.pushAll(params)
            if (result) {
              this.$notify({
                title: '提示',
                message: '推送成功',
                type: 'success',
                duration: 2000
              })
            }
          } catch (err) {
            this.$notify({
              title: '提示',
              message: err,
              type: 'warning',
              duration: 2000
            })
          }
        }
        if (this.pushType === 'users') {
          let params = {
            notification: content,
            message_type: 5,       // 类型待协商
            user_ids: this.users,
            app_id: '56c6c309243cb728205a3dff',
            offline: ''    //  离线推送的内容，不需要离线可以为空或者省略此字段
          }
          try {
            let result = await api.pushUsers(params)
            if (result) {
              this.$notify({
                title: '提示',
                message: '推送成功',
                type: 'success',
                duration: 2000
              })
            }
          } catch (err) {
            this.$notify({
              title: '提示',
              message: err,
              type: 'warning',
              duration: 2000
            })
          }
        }
      },
      oldPush () {        //     ============ 老的推送接口 ============
        if (!this.checkContent()) { // 消息非空验证
          return
        }
        let content = ''            // 消息内容
        if (this.messageType === 'link') {   // 链接消息

          // 检查是否 https:// 开头的合法链接 如果是 补全 render 格式
          let start = this.linkAddress.indexOf('tinfinite://dl/page?url=')
          let https = this.linkAddress.indexOf('https://')
          if (start === -1 && https === 0) {
            this.linkAddress = 'tinfinite://dl/page?url=' + this.linkAddress
            content = `<a href="${this.linkAddress}">${this.linkText}</a>`
          } else if (start === 0 && https > -1) {
            content = `<a href="${this.linkAddress}">${this.linkText}</a>`
          } else {
            this.$notify({
              title: '提示',
              message: '请检查是否 https 协议的链接',
              type: 'warning',
              duration: 2000
            })
            return
          }
          if (this.describeText) { // 如果有消息描述 则拼接消息描述到消息开头
            content = this.describeText + content
          }
        } else if (this.messageType === 'text') {  // 文本消息
          content = this.messageText
        } else if (this.messageType === 'image') {   // 图文消息
          let mediaContent = {}
          if (this.mediaList.length > 0) {   // 图文组消息处理
            let menu = []
            for (let i of this.mediaList) {
              menu.push(i)
            }
            mediaContent.menu = menu
          }
          if (this.hasHead) {              // banner头消息处理
            mediaContent.heading = this.mediaBanner
          }
          content = JSON.stringify(mediaContent)   // 拼接内容字符串
        }
        let mediaType
        switch (this.messageType) {
          case 'text':
            mediaType = -1   // 文本消息
            break
          case 'image':
            mediaType = 13   // 图文消息
            break
          case 'link':
            mediaType = 12   // render消息
            break
        }
        if (mediaType === 13) {
          try {
            JSON.parse(content)
          } catch (e) {
            this.$notify({
              title: '提示',
              message: '格式不正确',
              type: 'warning',
              duration: 2000
            })
            return
          }
        }
        let data = {
          app_id: '56c6c309243cb728205a3dff',
          content: content,
          content_type: 1,
          bot_id: '578dd3ef8951642d0d3d2c67',  // 新生大学团队机器人
          media_type: mediaType
        }
        if (this.pushType === 'course') { // 如果是课程推送 走课程的api
          let params = {
            product_id: this.courseId,
            online_msg: content,
            content_type: 1,
            media_type: mediaType,
            bot_id: '56d4492af2eb8cd523a82af1' // 此id为机器人bot_user_id 但字段名为bot_id 特此备注
          }
          this.pushCourseMessage(params)
          return
        }
        let type = this.pushType === 'all' ? 3 : 1
        if (type === 1 && this.users.length < 300) {
          data.user_ids = this.users
        } else if (type === 1 && this.users.length > 300) {
          this.totalPush = Math.ceil(this.users.length / 300)
          this.showProgress = true
          for (let i = 0; i < this.users.length; i += 300) {
            data.user_ids = this.users.slice(i, i + 300)
            let params = {
              type,
              data: JSON.stringify({doc: data})
            }
            this.oldPushMessage(params, true)
          }
          return
        }
        let params = {
          type,
          data: JSON.stringify({doc: data})
        }
        this.oldPushMessage(params)  
      },
      async oldPushMessage (params, hasProgress) {
        try {
          let result = await api.oldPush(params)
          if (hasProgress) {
            this.readyPush += 1
            if (this.readyPush === this.totalPush) {
              this.showProgress = false
              this.$notify({
                title: '提示',
                message: '推送请求已全部发出',
                type: 'success',
                duration: 2000
              })
            }
          } else {
            this.$notify({
              title: '提示',
              message: '请求已发出，请点击左下角消息列表查看是否成功推送',
              type: 'success',
              duration: 2000
            })
          }
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      async getMessage () {
        try {
          let params = {
            url: '/admin/bot/push/list',
            data: {
              limit: 10,
              offset: 0,
              options: JSON.stringify({bot_id: '578dd3ef8951642d0d3d2c67'})
            }
          }
          let result = await api.getMessage(params)
          this.messageList = result.rows
          this.showMessage = true
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      addItem () {  // 添加图文组
        this.mediaList.push({image_url: '', title: '', post_url: ''})
      },
      removeItem (item) {   // 移除图文组指定项
        this.mediaList.splice(this.mediaList.indexOf(item), 1)
      },
      addHead () {  // 添加图文banner头
        this.hasHead = true
      },
      removeHead () {  // 移除banner 并清空内容
        this.mediaBanner = {
          image_url: '',
          title: '',
          summary: '',
          post_url: ''
        }
        this.hasHead = false
      },
      beforeImageUpload (file) {
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
      async uploadImage (file) {
        let data = new window.FormData()
        data.append('avatar', file.file)
        try {
          let result = await api.uploadImage(data)

          if (this.uploadId !== null) {  // 有uploadId 是图文组图片
            this.mediaList[this.uploadId].image_url = result.avatar
          } else {                       // 无uploadId 是banner图片
            this.mediaBanner.image_url = result.avatar
          }
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      getUploadId (key) {  // 抓取上传的index
        this.uploadId = key
      },
      readFile (res) {
        let arr = res.result.split('\n').map(a => a.replace(/[^0-9a-f]/g, '').replace(/\s/g, ''))
        let noMongo = arr.find(a => !validator.isMongoId(a))
        if (noMongo) {
          this.$notify({
            title: '文件读取错误',
            message: `${noMongo} 不是有效的 MongoId 格式，已自动过滤`,
            type: 'error',
            duration: 0
          })
        }
        let arr2 = new Set(arr.filter(a => a !== '' && validator.isMongoId(a)))
        this.users = Array.from(arr2)
      },
      async pushCourseMessage (params) {
        try {
          let result = await api.pushCourseMessage(params)
          if (result) {
            this.$notify({
              title: '提示',
              message: '推送成功',
              type: 'success',
              duration: 2000
            })
          }
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      }
    }
  }
</script>
<style>
  .message {
    width: 86%;
    margin-top: 4%;
    margin-left: 7%;
    border-radius: 5px;
    border: 1px solid #ccc;
    float: left;
  }
  .title {
    width: 100%;
    margin-top: 4%;
    text-align: center;
  }
  .step-title {
    font-size: 18px;
    color: #20a0ff;
  }
  .card {
    margin-top: 30px;
  }
  .push-box {
    width: 86%;
    margin-top: 4%;
    margin-left: 7%;
  }
  .user-label {
    margin-top: 20px;
  }
  .el-tag {
    margin-top: 15px;
    margin-right: 10px;
  }
  .message-box {
    width: 86%;
    margin-top: 4%;
    margin-left: 7%;
  }
  .link-text, .link-address {
    margin-top: 20px;
  }
  .input-item {
    margin-top: 15px;
  }
  .tip {
    font-size: 14px;
    color: #aaa;
  }
  .text-con {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    border: 1px solid #eee;
    border-radius: 0;
    background-color: transparent;
    box-shadow: 1px 2px 0 #e6e6e6;
  }
  /*.push-button {
    width: 10%;
    margin: 4% 7% 4% 83%;
  }*/
  .list-button {
    float: left;
    margin-left: 7%;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .push-button {
    float: right;
    margin-right: 7%;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .media-banner, .media-item {
    display: flex;
    width: 95%;
    margin: 10px 0;
    border:1px solid #bfcbd9;
    border-radius: 4px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 10px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    display: block;
    width: 80px;
    height: 80px;
    margin: 10px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .m-head {
    margin-top: 30px;
  }
  .del-button{
    width: 32px;
    height: 32px;
    margin-left: auto;
    margin-right: 10px;
    margin-top: 10px;
  }
  .course-color {
    color: #20a0ff;
  }
</style>