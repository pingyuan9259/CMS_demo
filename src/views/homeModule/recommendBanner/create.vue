<template>
  <div style="margin: 40px 0; min-width: 800px;">
    <el-form class="small-space" :model="temp" ref="temp" label-width="120px" style='width: 92%; margin-left:4%;'>

      <!-- web banner -->
      <Box>
        <span slot="box-header">添加 Web Banner</span>
        <div slot="box-body">

          <WebBanner :web-banner="temp.webBanner" v-on:clearWebBanner="clearWebBanner" v-on:updateWebBannerImgUrl="updateWebBannerImgUrl" v-on:submitWebBanner="submitWebBanner"></WebBanner>

        </div>
      </Box>

      <!-- app banner -->
      <Box>
        <span slot="box-header">添加 App Banner</span>
        <div slot="box-body">

          <AppBanner :app-banner="temp.appBanner" v-on:clearAppBanner="clearAppBanner" v-on:updateAppBannerImgUrl="updateAppBannerImgUrl" v-on:submitAppBanner="submitAppBanner"></AppBanner>

        </div>
      </Box>
    </el-form>

  </div>
</template>

<script>
  import api from './api'
  import Box from '../../../components/Box/Box'
  import WebBanner from './WebBanner'
  import AppBanner from './AppBanner'

  export default {
    computed: {
    },
    watch: {
    },
    data () {
      return {
        submitBtnLoading: false,
        list: [],
        temp: {
          webBanner: {
            type: 2,
            title: '',
            description: '',
            image_url: '',
            weight: 1,
            _status: 1,
            url:''
          },
          appBanner: {
            type: 1,
            title: '',
            description: '',
            image_url: '',
            weight: 1,
            _status: 1,
            url:''
          },
        }
      }
    },
    components: {
      AppBanner,
      WebBanner,
      Box
    },
    methods: {
      logerrSuccess () {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      },

      logerrFail (err) {
        this.$notify({
          title: '提示',
          message: err,
          type: 'warning',
          duration: 2000
        })
      },

      // web banner
      clearWebBanner () {
        this.temp.webBanner = {
          type: 2,
          title: '',
          description: '',
          image_url: '',
          weight: 1,
          _status: 1,
          url:''
        }
      },

      updateWebBannerImgUrl (webBannerImgUrl) {
          let webBanner = this.temp.webBanner
          let clearBanner = {
            type: 2,
            title: webBanner.title,
            description: webBanner.description,
            image_url: webBannerImgUrl,
            weight: webBanner.weight,
            _status: 1,
            url:  webBanner.url
          }
          this.temp.webBanner = clearBanner
      },

      // app banner
      clearAppBanner () {
        this.temp.appBanner = {
          type: 1,
          title: '',
          description: '',
          image_url: '',
          weight: 1,
          _status: 1,
          url:''
        }
      },

      updateAppBannerImgUrl (appBannerImgUrl) {
        let appBanner = this.temp.appBanner
          let clearBanner = {
            type: 1,
            title: appBanner.title,
            description: '',
            image_url: appBannerImgUrl,
            weight: appBanner.weight,
            _status: 1,
            url:  appBanner.url
          }
          this.temp.appBanner = clearBanner
      },

      async submitWebBanner () {
        try {
          let data = this.temp.webBanner
          if (!data.title || !data.description || !data.image_url || !data.url || !data.weight) {
            this.$notify({
              title: '提示',
              message: '所有信息必填',
              type: 'warning',
              duration: 3000
            })
            return
          }
          let result = await api.addBanner(this.temp.webBanner)
          this.logerrSuccess()
          this.$router.replace('./index')
        } catch (err) {
          this.logerrFail(err)
        }
      },
      async submitAppBanner () {
        try {
          let data = this.temp.appBanner
          if (!data.title || !data.image_url || !data.url || !data.weight) {
            this.$notify({
              title: '提示',
              message: '所有信息必填',
              type: 'warning',
              duration: 3000
            })
            return
          }
          let result = await api.addBanner(this.temp.appBanner)
          this.logerrSuccess()
          this.$router.replace('./index')
        } catch (err) {
          this.logerrFail(err)
        }
      },
    }
  }
</script>

<style>
 /* .channel-box .calendar-list-container {
    width: 50%;
  }*/
  /*.channel {
    float: left;
  }*/
  .homepage .el-form-item__content {
    margin-left: 0 !important;
  }
  .list-content {
    border: 1px solid #bfcbd9;
    margin-top: 65px;
    float: right;
    width: 400px;
    height: 650px;
  }

</style>