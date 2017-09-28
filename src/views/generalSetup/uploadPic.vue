<template>
  <div style="padding-left: 40px; padding-top: 40px;" v-loading="uploading">
    <el-input ref="input" placeholder="" v-model="picURL" readonly style="width: 700px;margin-bottom: 20px;">
    </el-input>
    <div>
      <el-button style="margin-bottom: 20px;" size="big" type="primary" :disabled="picURL.length < 1" @click="copyURL">复制链接</el-button>
    </div>

    <div style="display: flex;">
      <el-upload drag :show-file-list="false" action="" :before-upload="beforePicUpload" :http-request="uploadPic">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传 jpg / png 文件，大小不能超过 20 MB。</div>
      </el-upload>

      <div class="uploadPic-img-wrapper">
        <transition name="el-zoom-in-top">
          <img v-show="picURL" :src="picURL" style="max-width: 100%; max-height: 100%; border-radius: 6px;">
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
  import api from '../course/api.js'
  export default {
    name: '',
    data() {
      return {
        uploading: false,
        picURL: ''
      }
    },
    methods: {
      beforePicUpload (file) {
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
      async uploadPic (file) {
        this.uploading = true
        let data = new window.FormData()
        data.append('picture', file.file)
        try {
          let result = await api.postUploadPicture(data)
          this.uploading = false
          if (result && result.picture) {
            this.picURL = result.picture
          }
        } catch (err) {
          this.uploading = false
          window.alert(err)
        }
      },
      copyURL () {
        this.$refs.input.inputSelect()
        document.execCommand('Copy')
        this.$message({
          message: '链接已复制到剪贴板',
          type: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .uploadPic-img-wrapper {
    margin-left: 40px;
    padding: 2px;
    height: 180px;
    overflow:hidden;
    display: flex;
    align-items: center;
    justify-content: left;
  }

</style>
