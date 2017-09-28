<template>
	<div class="course-user-page">
    <div class="user-table">
      <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row border>
        <el-table-column align="center" label="用户 ID">
          <template scope="scope">
            <span>{{scope.row}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户名">
          <template scope="scope">
            <span>{{users[scope.row] && users[scope.row].fullname}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="联系方式">
          <template scope="scope">
            <span>{{users[scope.row] && users[scope.row].phone || users[scope.row] && users[scope.row].email}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="新生号">
          <template scope="scope">
            <span>{{users[scope.row] && users[scope.row].username}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api.js'
  import { param2Obj } from 'utils/'
  import qs from 'qs'
  export default {
    name: 'course-user',
    data () {
      return {
        courseId: null,
        list: [],
        users: {},
        total: null,
        listLoading: false,
        listQuery: {
          limit: 20,
          page: 1
        },
      }
    },
    created () {
      let query = param2Obj(window.location.href)
      this.courseId = Number(query.courseId)
      this.getCourseUser()
    },
    methods: {
      async getCourseUser () {
        let params = {
          url: `/admin/course/${this.courseId}/userids`,
          data: {
            page: this.listQuery.page,
            limit: this.listQuery.limit
          }
        }
        try {
          let result = await api.getCourseUser(params)
          this.total = result.total
          this.list = result.userids
          let aguments = {
            url: '/admin//user/user-info-map?field=_id&' + qs.stringify({values: result.userids}, { arrayFormat: 'brackets' }) + '&projection=_id fullname phone username email'
          }
          let Res = await api.getUsersInfo(aguments)
          this.users = Res
        } catch (err) {
          this.$notify({
            title: '提示',
            type: 'danger',
            message: err,
            duration: 1000
          })
        }
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getCourseUser()
      },
      // 页码数改变
      handlePageChange(val) {
        this.listQuery.page = val
        this.getCourseUser()
      }
    }
  }
</script>
<style>
  .user-table {
    margin: 20px;
  }
</style>