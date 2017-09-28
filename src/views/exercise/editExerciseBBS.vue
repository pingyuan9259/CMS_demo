<template>
  <div v-if="bbs" style="margin: 40px 0; width: 95%; min-width: 900px;">
    <el-form v-loading="formLoading" class="small-space" :model="bbs" ref="bbs" label-width="150px" style='width: 92%; margin-left:4%;'>

      <Box>
        <span slot="box-header" style="">作业论坛基础信息</span>
        <div slot="box-body">
          <el-form-item label="作业论坛名称">
            <el-input v-model="bbs.name" style="width: 55%;" placeholder="请输入作业论坛名称">
            </el-input>
            <el-button type="primary" style="margin-right: 100px;" @click.prevent="updateName">更新作业论坛名称</el-button>
          </el-form-item>

           <el-form-item label="作业论坛描述">
            <el-input style="width: 55%;" v-model="bbs.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入作业论坛描述">
            </el-input>
            <el-button type="primary" @click.prevent="updateDescription">更新作业论坛描述</el-button>
          </el-form-item>

          <el-form-item label="封面">
            <el-upload class="bbs-avatar-uploader" action="" :show-file-list="false" :http-request="uploadBBSAvatar" :before-upload="beforeBBSAvatarUpload">
              <img v-if="bbs.avatar" :src="bbs.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style=""></i>
            </el-upload>
            <el-button style="float: left;" type="primary" @click.prevent="updateAvatar">更新作业论坛封面</el-button>
          </el-form-item>
        </div>
      </Box>

      <Box>
        <span slot="box-header" style="">作业论坛人员信息</span>
        <div slot="box-body">

          <el-form-item label="管理员列表" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="设置作业论坛的管理员" name="1">
                <el-button type="primary" :loading="updatingManagers" @click.prevent="updateManager" style="margin-right: 10px;margin-top: 10px;margin-bottom: 10px;">更新管理员列表</el-button>
                <UserSelector :userList="bbsManagers" v-on:selecteUser="selecteManager" v-on:deleteUser="deleteManager"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

        </div>
      </Box>

    </el-form>

  </div>
</template>


<script>
import api from './api.js'
import userApi from '../userlist/api.js'
import CourseApi from '../course/api.js'

import Box from '../../components/Box/Box'
import UserSelector from '../../components/UserSelector/index'

import LMT from './lengths'
import { BBSAvatarSize } from './types.js'
import _ from 'lodash'
import qs from 'qs'

export default {
  data () {
    return {
      id: '',
      bbs: {},
      bbsManagers: [],
      assistants: [],
      loading: true,
      formLoading: false,
      updatingManagers: false,
      updatingAssistants: false
    }
  },
  components: { Box, UserSelector },
  created () {
    this.id = this.$route.query.id
    this.getBBSInfo()
  },
  methods: {
    async getBBSInfo () {
      try {
        let result = await api.getBBSInfo(this.id)
        this.bbs = result || {}
        if (this.bbs.assistants && this.bbs.assistants.length) {
          this.getBBSAssistantsDetail(this.bbs.assistants)
        }
        if (this.bbs.bbsManagers && this.bbs.bbsManagers.length) {
          this.getBBSManagersDetail(this.bbs.bbsManagers)
        }
      } catch (err) {
        window.alert(err)
      }
    },
    userDetailApis (ids) {
      let apiUserDetail = (id) => { return userApi.userDetail({ url: '/admin/user/user-info', id: id }) }
      return _.map(ids, apiUserDetail)
    },

    getBBSAssistantsDetail(ast_ids) {

      let apis = this.userDetailApis(ast_ids)
      let self = this
      Promise.all(apis).then(function (value) {
        self.assistants = Array.from(value) || []
      }).catch(function(error){
        console.log(error)
      })

    },

    getBBSManagersDetail(mgr_ids) {
      let apis = this.userDetailApis(mgr_ids)
      let self = this
      Promise.all(apis).then(function (value) {
        self.bbsManagers = Array.from(value) || []
      }).catch(function(error){
        console.log(error)
      })
    },
    updateName () {
      if (this.bbs.name.length < LMT.nameMinLen || this.bbs.name.length > LMT.nameMaxLen) {
        this.$message.error(`请检查作业论坛名称，长度在 ${LMT.nameMinLen} 到 ${LMT.nameMaxLen} 个字`)
        return
      }
      let params = { id: this.id, name: this.bbs.name }
      this.update(params)
    },
    updateDescription () {
      if (!this.bbs.description) {
        this.$message.error(`请检查作业论坛描述`)
        return
      }
      if (this.bbs.description.length < LMT.descriptionMinLen || this.bbs.description.length > LMT.descriptionMaxLen) {
        this.$message.error(`请检查作业论坛名称，长度在 ${LMT.descriptionMinLen} 到 ${LMT.descriptionMaxLen} 个字`)
        return
      }
      let params = { id: this.id, description: this.bbs.description }
      this.update(params)
    },
    async uploadBBSAvatar (file) {
      let data = new window.FormData()
      data.append('avatar', file.file)
      try {
        let result = await CourseApi.postUploadPicture(data)
        if (result && result.avatar) {
          this.bbs.avatar = result.avatar
        }
      } catch (err) {
        window.alert(err)
      }
    },
    updateAvatar () {
      if (!this.bbs.avatar || this.bbs.avatar.length < 1 ) {
        this.$message.error(`请检查作业论坛封面`)
        return
      }
      let params = { id: this.id, avatar: this.bbs.avatar }
      this.update(params)

    },
    beforeBBSAvatarUpload (file) {
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
            if (this.height < BBSAvatarSize.HEIGHT || this.width < BBSAvatarSize.WIDTH) {
              self.$message.error('请检查作业论坛封面图片的尺寸')
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

    selecteManager (user) {
      if (this.bbsManagers.length < 1) {
        this.bbsManagers.push(user)
      } else {
        let hasEqualUserId = false
        for (var i = 0; i < this.bbsManagers.length; i++) {
          let mgrId = this.bbsManagers[i]
          if (user.id && mgrId.id === user.id) {
            hasEqualUserId = true
            break
          }
        }
        if (!hasEqualUserId && user.id) {
          this.bbsManagers.push(user)
        }
      }

    },
    deleteManager (userId) {
      let index = _.findIndex(this.bbsManagers, function(mgr) { return mgr.id == userId })
      if (index > -1) {
        this.bbsManagers.splice(index, 1)
      }
    },
    async updateManager () {
      if (!this.bbsManagers || this.bbsManagers.length < 1 ) {
        this.$message.error(`请检查作业论坛管理员列表`)
        return
      }
      let mgr_ids = _.map(this.bbsManagers, 'id')
      let dataToUpdate = { bbsId: this.id, bbsManagers: mgr_ids }
      this.formLoading = true
      try {
        let result = await api.postUpdateBBSAdmins(dataToUpdate)
        this.formLoading = false
        if (result) {
          this.notifyPostSuccess('更新作业论坛管理员成功')
        }
      } catch (err) {
        this.formLoading = false
        window.alert(err)
      }
    },
    async update (dataToUpdate) {
      this.formLoading = true
      try {
        let result = await api.postUpdateBBS(dataToUpdate)
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
  }
}
</script>

<style>
  .el-collapse {
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    overflow: hidden;
  }
  .bbs-avatar-uploader .el-upload {
    border: 0.5px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .bbs-avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    border-radius: 4px;
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    /*width: 120px;*/
    height: 120px;
    display: block;
  }
</style>