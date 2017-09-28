<template>
	<div class="class-rate">
    <h4>过滤条件：</h4>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程ID" v-model="listQuery.course_id" icon="search">
    </el-input>

    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名称" v-model="listQuery.course_name" icon="search">
    </el-input>

    <el-date-picker @change="handleFilter($event, true)" v-model="dateRange" class="filter-item" type="datetimerange" align="left" placeholder="选择时间范围">
    </el-date-picker>

    <el-table class="rate-table" :data="list" v-loading.body="rateLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="推送时间" min-width="120">
        <template scope="scope">
          <span>{{ scope.row.push_at | dateFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送ID" min-width="100">
        <template scope="scope">
          <span>{{ scope.row.notification_id }}</span>
        </template>
      </el-table-column>
  
      <el-table-column align="center" label="课程名称" min-width="120">
        <template scope="scope">
          <span>{{ scope.row.course_name | slice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="课节名称" min-width="120">
        <template scope="scope">
          <span>{{ scope.row.schedule_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="报名数" min-width="80">
        <template scope="scope">
          <span>{{ scope.row.user_count }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="通知类型" min-width="70">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.online === 0 ? '离线' : '在线' }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户端" min-width="90">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.platform }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送数量" min-width="80">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.push_count }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="到达数量" min-width="80">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.recv_count }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击数量" min-width="80">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.skip_count }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="到达率" min-width="80">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{item.push_count === 0 ? '-' : parseFloat((item.recv_count * 100 / item.push_count).toFixed(3)) + '%' }}<br></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击率" min-width="80">
        <template scope="scope">
          <span class="item" v-for="item in scope.row.statis">{{ item.recv_count === 0 ? '-' : parseFloat((item.skip_count * 100 / item.recv_count).toFixed(3)) + '%' }}<br></span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!rateLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import api from './api'
  import moment from 'moment'
  export default {
    data () {
      return {
        list: [],
        total: 0,
        rateLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          course_name: '',
          course_id: '',
          from_time: '',
          to_time: ''
        },
        dateRange: null
      }
    },
    created () {
      this.getClassRate()
    },
    filters: {
      dateFormat (value, format) {
        if (!value) { return }
        return moment(value).format('YYYY-MM-DD HH:mm')
      },
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
      async getClassRate () {
        let params = {
          url: 'admin/course/schedule-noti-statistics',
          data: {
            from_time: this.listQuery.from_time,
            to_time: this.listQuery.to_time,
            course_name: this.listQuery.course_name,
            course_id: this.listQuery.course_id,
            page: this.listQuery.page,
            limit: this.listQuery.limit
          }
        }
        try {
          let result = await api.getClassRate(params)
          this.rateLoading = false
          this.total = result.total
          this.list = JSON.parse(result.rows)
        } catch (err) {
          this.rateLoading = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleSizeChange (val) {
        this.listQuery.limit = val
        this.rateLoading = true
        this.getClassRate()
      },
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.rateLoading = true
        this.getClassRate()
      },
      handleFilter (e, time) {
        if (time) {
          this.listQuery.from_time = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm')
          this.listQuery.to_time = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm')
        }
        this.getClassRate()
        this.rateLoading = true
      }
    }
  }
</script>
<style>
  .class-rate {
    padding: 20px;
  }
  .rate-table {
    margin-top: 20px;
  }
  .item {
    display: block;
    width: 100%;
    border-bottom: 1px solid #dfe6ec;
  }
  .cell :last-child {
    border-bottom: none;
  }
</style>