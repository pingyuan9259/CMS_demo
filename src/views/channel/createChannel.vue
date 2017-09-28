<template>
  <div v-if="bbs" style="margin: 40px 0; width: 95%; min-width: 900px;">
    <el-form v-loading="formLoading" class="small-space" :model="bbs" ref="bbs" label-width="150px" style='width: 92%; margin-left:4%;'>

      <Box>
        <span slot="box-header" style="">频道基础信息</span>
        <div slot="box-body">
          <el-form-item label="必填 频道名称">
            <el-input v-model="bbs.name" style="width: 55%;" placeholder="请输入频道名称">
            </el-input>
          </el-form-item>

          <el-form-item label="选填 频道 公告栏">
            <el-input style="width: 55%;" v-model="bbs.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入公告内容">
            </el-input>
            <span style="display: inline-block;width: 55%;color: #c0c0c0;">公告内超链接格式：&lt;a href="https://xxx.com"&gt;XXX&lt;/a&gt;</span> 
          </el-form-item>

          <el-form-item label="必填 频道封面">
            <el-upload class="bbs-avatar-uploader" action="" :show-file-list="false" :http-request="uploadBBSAvatar" :before-upload="beforeBBSAvatarUpload">
              <img v-if="bbs.avatar" :src="bbs.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style=""></i>
            </el-upload>
          </el-form-item>

          <!-- <el-form-item label="频道类型">
            <el-radio-group v-model="bbs.isPublic">
              <el-radio :label="bbsPublicType.PRIVATE">私有</el-radio>
              <el-radio :label="bbsPublicType.PUBLIC">公开</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </div>
      </Box>

      <Box>
        <span slot="box-header" style="">频道人员信息</span>
        <div slot="box-body">

          <el-form-item label="管理员列表" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="设置频道的管理员" name="1">
                <UserSelector :userList="bbs.bbsManagers" v-on:selecteUser="selecteManager" v-on:deleteUser="deleteManager"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <!-- <el-form-item label="助教列表" :show-message="false">
            <el-collapse accordion>
              <el-collapse-item title="设置频道的助教" name="1">
                <UserSelector :userList="bbs.assistants" v-on:selecteUser="selecteAssistant" v-on:deleteUser="deleteAssistant"></UserSelector>
              </el-collapse-item>
            </el-collapse>
          </el-form-item> -->

        </div>
      </Box>

    </el-form>
    <div class="block" style="display: block;text-align: center;">
      <!-- <el-button style="margin: 0 30px;" @click="preview">预览</el-button> -->
      <el-button style="margin: 0 30px;" type="primary" :loading="submitBtnLoading" @click="submit">提交</el-button>
    </div>
  </div>
</template>


<script>
import api from './api.js'
import CourseApi from '../course/api.js'
import _ from 'lodash'
import qs from 'qs'

import Box from '../../components/Box/Box'
import UserSelector from '../../components/UserSelector/index'

import LMT from './lengths'
import { BBSAvatarSize, bbsPublicType } from './types.js'

export default {
  data () {
    return {
      id: '',
      bbs: {
        name: '',
        description: '',
        avatar: '',
        isPublic: 1,
        bbsManagers: [],
        assistants: []
      },
      bbsPublicType,
      loading: true,
      formLoading: false,
      submitBtnLoading: false
    }
  },
  components: { Box, UserSelector },
  created () {
  },
  methods: {
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

    beforeBBSAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isJPG && !isPNG) {
        this.$notify.error({
          title: '提示',
          message: '上传图片只能是 JPG 或 PNG 格式!',
          duration: 2000
        })
      }
      if (!isLt2M) {
        this.$notify.error({
          title: '提示',
          message: '上传图片大小不能超过 20MB!',
          duration: 2000
        })
      }
      let result = ( isJPG || isPNG) && isLt2M;
      if (result) {
        var self = this
        return new Promise((resolve, reject) => {
          var _URL = window.URL || window.webkitURL
          let imageChecker = new Image()
          imageChecker.onload = function () {
            if (this.height < BBSAvatarSize.HEIGHT || this.width < BBSAvatarSize.WIDTH) {
              self.$notify.error({
                title: '提示',
                message: '请检查频道封面图片的尺寸',
                duration: 2000
              })
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
    selecteManager (mgr) {
      let index = _.findIndex(this.bbs.bbsManagers, function(user) { return user.id == mgr.id })
      if (index < 0) {
        this.bbs.bbsManagers.push(mgr)
      }
    },
    deleteManager (userId) {
      let index = _.findIndex(this.bbs.bbsManagers, function(user) { return user.id == userId })
      if (index > -1) {
        this.bbs.bbsManagers.splice(index, 1)
      }
    },
    selecteAssistant (assist) {
      let index = _.findIndex(this.bbs.assistants, function(user) { return user.id == assist.id })
      if (index < 0) {
        this.bbs.assistants.push(assist)
      }
    },
    deleteAssistant (userId) {
      let index = _.findIndex(this.bbs.assistants, function(user) { return user.id == userId })
      if (index > -1) {
        this.bbs.assistants.splice(index, 1)
      }
    },
    checkSubmitData () {

      if (this.bbs.name.length < LMT.nameMinLen || this.bbs.name.length > LMT.nameMaxLen) {
        this.$notify.error({
          title: '提示',
          message: `频道名称长度在 ${LMT.nameMinLen} 到 ${LMT.nameMaxLen} 字之间`,
          duration: 2000
        })
        return false
      }
      if (this.bbs.description && this.bbs.description.length > LMT.descriptionMaxLen) {
        this.$notify.error({
          title: '提示',
          message: `频道公告最大长度长度为 ${LMT.descriptionMaxLen} 字`,
          duration: 2000
        })
        return false
      }
      if (!this.bbs.avatar || this.bbs.avatar.length < 1) {
        this.$notify.error({
          title: '提示',
          message: '请检查频道封面',
          duration: 2000
        })
        return false
      }
      return true
    },
    preview () {},
    async submit () {
      if (!this.checkSubmitData()) {
        return
      }
      let data = {
        name: this.bbs.name || '',
        description: this.bbs.description || '',
        avatar: this.bbs.avatar || '',
        isPublic: this.bbs.isPublic,
        bbsManagers: qs.stringify(_.map(this.bbsManagers, 'id') || []),
        assistants: qs.stringify(_.map(this.assistants, 'id') || [])
      }
      this.submitBtnLoading = true
      try {
        let result = await api.postCreateBBS(data)
        this.submitBtnLoading = false
        if (result) {
          this.resetForm()
          this.notifySuccessSubmit()
          this.$router.replace({ path: './index'})
        }
      } catch (err) {
        this.submitBtnLoading = false
        window.alert(err)
      }
    },
    resetForm () {
      this.bbs = {
        name: '',
        description: '',
        avatar: '',
        isPublic: 1,
        bbsManagers: [],
        assistants: []
      }
    },
    notifyFailedSubmit(msg) {
      this.$notify.error({
        title: '出错了',
        message: msg,
        duration: 2000
      })
    },
    notifySuccessSubmit () {
      this.$notify.success({
        title: '成功',
        message: '创建频道成功',
        duration: 2000
      });
    }
  }
}
</script>

<style>

/*  .el-input {
    width: 80%;
  }*/

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