<template>
<!--   <div class="outline" style="">
    <div class="postInfo-container" style="padding: 10px;display: block;">
      <div class="item-container">
        <span>小节标题</span>
        <el-input class="item" v-model="outline.title" placeholder="小标题" style="width: 60%;"></el-input>
      </div>
      <div class="item-container">
        <span>小节内容</span>
        <el-input class="item" v-model="outline.description" placeholder="请输入详细内容" style="width: 60%;" type="textarea" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
      </div>
      <div class="item-container">
        <span>开始时间</span>
        <el-date-picker class="item" v-model="outline.show_begin" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
        </el-date-picker>
      </div>
      <div class="item-container">
        <span>结束时间</span>
        <el-date-picker class="item" v-model="outline.show_end" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
        </el-date-picker>
      </div>
      <div style="display: block;text-align: center;">
        <el-button type="danger" @click.prevent="clearOutline" style="height: 40px;">清空这一节</el-button>
      </div>
    </div>
  </div> -->
    <div class="outline" style="border:1px solid #bfcbd9; border-radius: 4px; margin: 10px 0; display: flex; width: 95%;">
      <el-upload class="avatar-uploader" style="width: 140px;margin-top:13px;" action=""
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadAvatar">

        <img v-if="outline.imageUrl" :src="outline.imageUrl" class="avatar" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;">
        <i v-else class="el-icon-plus avatar-uploader-icon" style="margin: 10px; border: 1px dashed #d9d9d9; border-radius: 6px;"></i>
      </el-upload>
      <div>
        <el-input v-model="outline.title" placeholder="这一节小标题" style="margin: 10px 10px 10px 0; width: 180px;"></el-input>
        <el-input v-model="outline.description" placeholder="请输入这一节详细内容" type="textarea" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
        <el-date-picker
          style="margin:10px 0;"
          v-model="outlineTime"
          type="datetimerange"
          placeholder="选择课程时间">
        </el-date-picker>
      </div>
      <!-- <div style="background-color: cyan;margin-left: auto;margin-right: 20px;"> -->
      <el-button type="danger" @click.prevent="clearOutline" style="height: 40px;margin-left: auto;margin-right: 10px;margin-top: 10px;">清空</el-button>
      <!-- </div> -->
      <el-button type="warning" @click.prevent="deleteOutline" style="height: 40px;margin-right: 20px;margin-top: 10px;">删除</el-button>

  </div>

</template>

<script>
import Request from 'utils/request'
export default {
  name: 'outline',
  props: {
    outline: {
      type: Object
    }
  },
  data() {
    return {
      outlineTime: ''
    }
  },
  mounted () {
    if (this.outline.outlineTime) {
      this.outlineTime = this.outline.outlineTime.split('-')
    }
  },
  watch: {
    outlineTime (val) {
      let outlineTime = null
      if (val[0] && val[1]) {
        outlineTime = val[0] + '-' + val[1]
      }
      this.$emit('updateOutlineTimer', this.outline.id, outlineTime )
    }
  },
  methods: {
    deleteOutline () {
      this.$emit('deleteOutline', this.outline.id)
    },
    clearOutline () {
      this.$emit('clearOutline', this.outline.id)
    },
    beforeAvatarUpload(file) {
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
    uploadAvatar(file) {
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
          let outilneImgUrl = result.cover
          this.$emit('updateOutlineImgUrl', this.outline.id, outilneImgUrl )
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
  // span {
  //   font-size: 14px;
  // }
  // .item {
  //   margin-left: 25px;
  // }
  // .item-container {
  //   margin: 10px auto;
  //   padding-left: 10px;
  //   display: flex;
  //   align-items: center;
  // }
  // .postInfo-container {
  //   border:1px solid #bfcbd9;
  //   border-radius: 4px;
  //   margin: 10px 0;
  //   // display: flex;
  //   // width: 95%;

  //   .postInfo-container-item {
  //     // float: left;
  //   }
  // }
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

