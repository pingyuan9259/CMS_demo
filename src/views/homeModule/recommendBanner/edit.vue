<template>
  <div style="margin: 40px 0; min-width: 800px;">
    <el-form class="small-space" :model="temp" ref="temp" label-width="120px" style='width: 92%; margin-left:4%;'>

      <!-- web banner -->
      <Box v-if="+StorageList.type === 2">
        <span slot="box-header">编辑 Web Banner</span>
        <div slot="box-body">

          <WebBanner :web-banner="temp.webBanner" v-on:clearWebBanner="clearWebBanner" v-on:updateWebBannerImgUrl="updateWebBannerImgUrl" v-on:submitWebBanner="submitWebBanner"></WebBanner>

        </div>
      </Box>

      <!-- app banner -->
      <Box v-if="+StorageList.type === 1">
        <span slot="box-header">编辑 App Banner</span>
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
    created () {
      this.banner_id = this.$route.query.id
      this.StorageList = JSON.parse(localStorage.getItem(`banner_${this.banner_id}`))
      if (+this.StorageList.type === 2) {
        this.temp.webBanner.id = this.StorageList.id
        this.temp.webBanner.title = this.StorageList.title
        this.temp.webBanner.image_url = this.StorageList.image_url
        this.temp.webBanner.description = this.StorageList.description
        this.temp.webBanner.url = this.StorageList.url
        this.temp.webBanner.weight = this.StorageList.weight

      } else if (+this.StorageList.type === 1) {
        this.temp.appBanner.id = this.StorageList.id
        this.temp.appBanner.title = this.StorageList.title
        this.temp.appBanner.image_url = this.StorageList.image_url
        this.temp.appBanner.description = this.StorageList.description
        this.temp.appBanner.url = this.StorageList.url
        this.temp.appBanner.weight = this.StorageList.weight
      }
    },
    computed: {
    },
    watch: {
    },
    data () {
      return {
        banner_id: '',
        StorageList: {},
        submitBtnLoading: false,
        list: [],
        temp: {
          webBanner: {
            id: '',
            type: 2,
            title: '',
            description: '',
            image_url: '',
            weight: 1,
            _status: 1,
            url:''
          },
          appBanner: {
            id: '',
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
        this.$router.replace({ path: './index'})
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
          id: this.StorageList.id,
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
            id: this.StorageList.id,
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
          id: this.StorageList.id,
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
            id: this.StorageList.id,
            type: 1,
            title: appBanner.title,
            description: appBanner.description,
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
          if (!data.title || !data.image_url || !data.url || !data.weight) {
            this.$notify({
              title: '提示',
              message: '所有信息必填',
              type: 'warning',
              duration: 3000
            })
            return
          }
          let result = await api.editBanner(this.temp.webBanner)
          this.logerrSuccess()
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
          let result = await api.editBanner(this.temp.appBanner)
          this.logerrSuccess()
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
