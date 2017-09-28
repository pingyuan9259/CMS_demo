<template>
  <div class="upload-container">

    <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>

    <el-dialog v-model="dialogVisible" @close="closeDialog">
      <el-upload class="feedbackFaq-avatar-uploader" action="" :show-file-list="false" :http-request="uploadFeedbackFaqPic" :before-upload="beforeFeedbackFaqPicUpload">
        <img v-if="picURL" :src="picURL" class="createFeedbackFaqPic">
        <i v-else class="el-icon-plus avatar-uploader-icon" style=""></i>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>

  </div>
</template>

<script>
    // import { getToken } from 'api/qiniu';
    import courseAPI from '../../../views/course/api.js'
    export default {
      name: 'editorSlideUpload',
      props: {
        color: {
          type: String,
          default: '#20a0ff'
        }
      },
      data() {
        return {
          picURL: '',
          dialogVisible: false,
          dataObj: { token: '', key: '' },
          list: [],
          fileList: []
        };
      },
      methods: {
        handleSubmit() {
          // const arr = this.list.map(v => v.url);
          this.$emit('successCBK', this.picURL);
          this.list = [];
          this.fileList = [];
          this.dialogVisible = false;
        },
        handleRemove(file) {
          const key = file.response.key;
          for (let i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i].key === key) {
              this.list.splice(i, 1);
              return
            }
          }
        },
        handleImageScucess(file) {
          this.list.push({ url: file.files.file });
        },
        closeDialog () {
          this.picURL = ''
          this.dialogVisible = false
        },
        async uploadFeedbackFaqPic (file) {
          var self = this
          let data = new window.FormData()
          data.append('avatar', file.file)
          try {
            let result = await courseAPI.postUploadPicture(data)
            if (result && result.avatar) {
              self.picURL= result.avatar
            } else {
              this.notifyErr()
            }
          } catch (err) {
            window.alert(err)
          }
        },
        beforeFeedbackFaqPicUpload (file) {
          const isJPG = file.type === 'image/jpeg'
          const isPNG = file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 20;
          if (!isJPG && !isPNG) {
            this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 20MB!')
          }
          return ( isJPG || isPNG) && isLt2M;
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
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
        .editor-slide-upload {
            margin-bottom: 20px;
        }
    }
  .feedbackFaq-avatar-uploader .el-upload {
    margin-bottom: 40px;
    border: 0.5px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .feedbackFaq-avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    margin-bottom: 40px;

  }
  .avatar-uploader-icon {
    // border:1px solid #bfcbd9;
    margin-bottom: 40px;

    border-radius: 4px;
    font-size: 28px;
    color: #8c939d;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .createFeedbackFaqPic {
    margin-bottom: 40px;
    height: 180px;
    display: block;
  }
  .el-card__header {
    padding: 0;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    height: 180px;
  }
  .el-upload--picture-card {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
