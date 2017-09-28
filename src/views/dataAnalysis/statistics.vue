<template>
	<div class="statistics">
    <h4>过滤条件：</h4>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名称" v-model="courseName" icon="search">
    </el-input>

    <el-table class="statistics-table" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="课程ID">
        <template scope="scope">
          <span>{{ scope.row.courseId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="课程名称" min-width="150">
        <template scope="scope">
          <span>{{ scope.row.courseName | slice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="报名人数" min-width="100">
        <template scope="scope">
          <span>{{ scope.row.userNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="会员数" min-width="100">
        <template scope="scope">
          <span>{{ scope.row.memberUserNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="非会员数" min-width="100">
        <template scope="scope">
          <span>{{ scope.row.normalUserNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日增加人数" min-width="100">
        <template scope="scope">
          <span>{{ scope.row.increaseNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="截止报名时间" min-width="120">
        <template scope="scope">
          <span>{{ scope.row.signupDeadline | dateFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前状态">
        <template scope="scope">
          <span>{{ scope.row.status === 1 ? '下架' : '上架' }}</span>
        </template>
      </el-table-column>
    </el-table> 
  </div>
</template>
<script>
  import api from './api'
  import moment from 'moment'

  export default {
    data () {
      return {
        list: [],
        listLoading: true,
        courseName: ''
      }
    },
    created () {
      this.getEnrollment()
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
      async getEnrollment () {
        let params = {
          url: 'admin/course/course-user-statistics',
          data: {
            course_name: this.courseName
          }
        }
        try {
          let result = await api.getEnrollment(params)
          this.listLoading = false
          this.list = result
        } catch (err) {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleFilter () {
        this.listLoading = true
        this.getEnrollment()
      }
    }
  }
</script>
<style>
  .statistics {
    padding: 20px;
  }
  .statistics-table {
    margin-top: 20px;
  }
</style>