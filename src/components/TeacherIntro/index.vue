<template>
  <div style="border:1px solid #bfcbd9; border-radius: 4px; margin: 10px 0; display: flex; width: 95%;">
    <el-upload class="avatar-uploader" style="width: 140px;" action=""
      :show-file-list="false"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadAvatar"
    >
      <img v-if="teacher.avatarUrl" :src="teacher.avatarUrl" class="avatar" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;">
      <i v-else class="el-icon-plus avatar-uploader-icon" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;"></i>
    </el-upload>

    <div>
      <el-input v-model="teacher.name" placeholder="教师名" style="margin: 10px 10px 10px 0; width: 180px;"></el-input>
      <el-input v-model="teacher.intro" placeholder="请输入教师介绍" type="textarea" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
    </div>
      <el-button type="danger" @click.prevent="removeTeacher" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;">全部清空</el-button>
  </div>
</template>
<script>
import Request from 'utils/request'
export default {
  name: 'teacherIntro',
  props: {
    teacher: {
      type: Object
    }
  },
  data () {
    return {
      // teacher: {
      //   avatarUrl: '',
      //   name: '',
      //   intro: ''
      // }
    }
  },
  created () {
  },
  methods: {
    // handleAvatarSuccess(res, file) {
    //   this.avatarUrl = URL.createObjectURL(file.raw);
    //   console.log('----- handleAvatarSuccess res :', res, 'file: ', file)
    // },
    removeTeacher () {
      this.$emit('clearTeacher')
    },
    handleRemove (file, fileList) {
    },
    beforeAvatarUpload (file) {
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
    uploadAvatar (file) {
      let data = new window.FormData()
      data.append('avatar', file.file)
      new Promise((resolve, reject) => {
         Request.post({
          url: '/admin/upload/',
          data: data
        }).then(response => {
          if (response.data.code !== 1 && response.data.need_login === 1) {
            Cookies.remove(APP_TOKEN_KEY);
            location.reload();
          }
          let result = response.data.result
          let avatar = result.avatar
          this.teacher.avatarUrl = avatar
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    // border: 1px dashed #d9d9d9;
    // border-radius: 6px;
    // cursor: pointer;
    // position: relative;
    // overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    // text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }

</style>
