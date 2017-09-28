<template>
	<div class="verify-info">
    <p class="information">
      <span>真实姓名：{{verifyInfo.real_name}}</span>
      <span class="type">认证类型：{{verifyInfo.credential_type | parseType}}</span>
      <span class="num">证件号码：{{verifyInfo.credential_no}}</span>
    </p>
    <p>媒体资料：</p>
    <div class="thumbnail">
      <div class="picture" v-for="src in verifyInfo.evidence_credential">
        <img :src="src" @click="checked(src, 'img')">
      </div>
      <div class="video" v-for="src in verifyInfo.evidence_vedio">
        <i class="video-icon"></i>
        <video :src="src" @click="checked(src, 'video')"></video>
      </div>
    </div>
    <div class="player">
      <div class="img-con" v-if="showImg">
        <img :src="mediaSrc" @click="rotateImg($event)">
      </div>
      <div class="video-con" v-if="showVideo">
        <video :src="mediaSrc" controls></video>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'auth',
    data () {
      return {
        mediaSrc: '',
        showImg: false,
        showVideo: false
      }
    },
    props: {
      verifyInfo: {
        type: Object
      }
    },
    filters: {
      parseType (type) {
        let result = ''
        switch (parseInt(type)) {
          case 2:
            result = '驾照'
            break
          case 3:
            result = '护照'
            break
          case 4:
            result = '台胞证'
            break
          default:
            result = '身份证'
        }
        return result
      }
    },
    watch: {
      verifyInfo (val) {
        this.mediaSrc = val.evidence_credential[0]
        this.showImg = true
        this.showVideo = false
      }
    },
    created () {
      this.mediaSrc = this.verifyInfo.evidence_credential[0]
      this.showImg = true
    },
    methods: {
      checked (src, type) {
        if (type === 'img') {
          this.showVideo = false
          this.showImg = true
        } else {
          this.showVideo = true
          this.showImg = false
        }
        this.mediaSrc = src
      },
      rotateImg (e) {
        let target = $(e.currentTarget)
        let deg = parseInt(target.attr('rotate') || 0) + 90
        target.css({
          transform: 'rotate(' + deg + 'deg)'
        }).attr('rotate', deg)
      }
    }
  }
</script>
<style>
  .verify-info {
    padding-left: 30px;
    padding-right: 30px;
  }
  .information .type, .information .num {
    margin-left: 30px;
  }
  .picture {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    overflow: hidden;
  }
  .picture img{
    width: 100%;
  }
  .video {
    border: 1px solid #ccc;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    overflow: hidden;
    position: relative;
  }
  .video .video-icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('//o4a7cbihz.qnssl.com/avatar/2d3e1c10-3674-4997-b134-d078feaad33a');
    background-size: cover;
  }
  .video video, .video-con video  {
    width: 100%;
    height: 100%;
  }
  .img-con img {
    height: 100%;
  }
  .player {
    margin-top: 50px;
    height: 450px;
  }
  .img-con, .video-con {
    text-align: center;
    height: 450px;
    overflow: hidden;
  }
</style>