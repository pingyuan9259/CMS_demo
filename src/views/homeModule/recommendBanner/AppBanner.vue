<template>
  <div class="feature" style="border:1px solid #bfcbd9; border-radius: 4px; margin: 10px 0; display: flex; width: 95%;">
    <el-upload class="avatar-uploader" style="width: 270px;" action=""
      :show-file-list="false"
      :before-upload="beforeImgUpload"
      :http-request="imgUpload">

      <img v-if="appBanner.image_url" :src="appBanner.image_url" class="avatar" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;">
      <i v-else class="el-icon-plus avatar-uploader-icon" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;"></i>
    </el-upload>
    <div>
      <el-input v-model="appBanner.title" placeholder="图片标题" style="margin: 10px 10px 10px 0; width: 180px;"></el-input>

      <el-input v-model.number="appBanner.weight" placeholder="权重" style="margin: 10px 10px 10px 0; width: 50px;"></el-input>

      <el-input v-model="appBanner.url" placeholder="图片跳转链接" style="margin: 0 10px 10px 0; width: 250px; display: block;"></el-input>

     <!--  <el-input v-model="appBanner.description" placeholder="图片描述" type="textarea" :autosize="{ minRows: 2, maxRows: 3}"
      style="margin: 0 0 10px 0;"></el-input> -->
    </div>

      <el-button type="danger" @click.prevent="clear" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;">清空</el-button>

      <el-button type="primary" @click.prevent="submitAppBanner" style="height: 40px;margin-right: 20px;margin-top: 10px;">提交</el-button>
  </div>
</template>
<script>
import Request from 'utils/request'
export default {
  name: 'appBanner',
  props: {
    appBanner: {
      type: Object
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    submitAppBanner () {
      this.$emit('submitAppBanner')
    },
    clear () {
      this.$emit('clearAppBanner')
    },
    beforeImgUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return ( isJPG || isPNG) && isLt4M;
    },
    imgUpload(file) {
      let data = new window.FormData()
      data.append('cover', file.file)
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
          let appBannerImgUrl = result.cover
          // this.feature.imageUrl = featureImgUrl
          this.$emit('updateAppBannerImgUrl', appBannerImgUrl)
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
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 256px;
    height: 144px;
    line-height: 135px;
  }
  .avatar {
    width: 256px;
    height: 144px;
    display: block;
  }

</style>
