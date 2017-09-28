<template>
	<div class="live-data">
    <course status=""></course>
    <h4>过滤条件：</h4>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户ID" v-model="listQuery.user_id" icon="search">
    </el-input>

    <el-date-picker @change="handleFilter($event, true)" v-model="dateRange" class="filter-item" type="datetimerange" align="left" placeholder="选择时间范围">
    </el-date-picker>

    <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">下载数据</el-button>

		<el-table v-if="list.length > 0" class="live-table" :data="list" v-loading.body="liveLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="课程ID">
        <template scope="scope">
          <span>{{ scope.row.course_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="课程名称">
        <template scope="scope">
          <span>{{ scope.row.course_name | slice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户ID">
        <template scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进入直播时间">
        <template scope="scope">
          <span>{{ scope.row.join }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退出直播时间">
        <template scope="scope">
          <span>{{ scope.row.leave }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="停留时长">
        <template scope="scope">
          <span>{{ scope.row.span }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!liveLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
	</div>
</template>
<script>
  import api from './api'
  import course from 'components/SearchCourse/index'
  import { mapGetters } from 'vuex'
  import { APP_ENV } from 'config/app'

  export default {
    name: 'live-data',
    components: {
      course
    },
    data () {
      return {
        list: [],
        total: 0,
        liveLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          user_id: '',
          timebegin: '',
          timeend: ''
        },
        dateRange: '',
        liveId: '',
        courseId: '',
        courseName: ''
      }
    },
    computed: {
      ...mapGetters([
        'choose'
      ])
    },
    watch: {
      choose (val) {
        this.liveId = val.liveshowId
        this.courseId = val.id
        this.courseName = val.name
        this.listQuery.timebegin = val.createdAt / 1000
        this.listQuery.timeend = val.endAt / 1000
        this.getLiveData()
      }
    },
    filters: {
      slice (val) {
        if (!val) return
        if (val.length > 12) {
          return val.substring(0, 12) + '...'
        } else {
          return val
        }
      }
    },
    methods: {
      async getLiveData () {
        let data = {
          live_id: this.liveId,
          course_id: this.courseId,
          course_name: this.courseName,
          timebegin: this.listQuery.timebegin,
          timeend: this.listQuery.timeend,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          user_id: this.listQuery.user_id
        }
        let params = {
          url: 'admin/statistic/liveuseractionpage',
          data: data
        }
        try {
          let result = await api.getLiveData(params)
          this.liveLoading = false
          this.list = result.info
          this.total = result.total
        } catch (err) {
          this.liveLoading = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.liveLoading = true
        this.getLiveData()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.liveLoading = true
        this.getLiveData()
      },
      handleFilter(e, time) {
        if (!this.liveId) {
          this.$notify({
            title: '提示',
            message: '请先选择课程',
            type: 'warning',
            duration: 2000
          })
          return
        }
        if (time) {
          this.listQuery.timebegin = parseInt(new Date(this.dateRange[0]).getTime() / 1000, 10)
          this.listQuery.timeend = parseInt(new Date(this.dateRange[1]).getTime() / 1000, 10)
        }
        this.liveLoading = true
        this.getLiveData()
      },
      handleDownload () {
        if (!this.liveId) {
          this.$notify({
            title: '提示',
            message: '请先选择课程',
            type: 'warning',
            duration: 2000
          })
          return
        }
        let data = {
          live_id: this.liveId,
          course_id: this.courseId,
          course_name: this.courseName,
          timebegin: this.listQuery.timebegin,
          timeend: this.listQuery.timeend,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          user_id: this.listQuery.user_id
        }
        let env = APP_ENV === 'pro' ? '' : '-' + APP_ENV
        let url = `http://cms-api${env}.tinfinite.com/admin/statistic/liveuseraction`
        // 此处处理 params.data 拼接数据到 url 上
        let str = ''
        for (let i in data) {
          str += `${i}=${data[i]}&`
        }
        url += '?' + str.substring(0, str.length - 1)
        window.open(url)
      }
    }
  }
</script>
<style>
  .live-data {
    padding: 0 20px 20px 20px;
  }
  .live-table {
    margin-top: 20px;
  }
</style>