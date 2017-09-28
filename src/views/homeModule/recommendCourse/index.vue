<template>
  <div class="app-container calendar-list-container index-recommend">
    <div class="filter-container">

      <!-- 顶部搜索、排序 -->
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名" v-model="listQuery.title">
      </el-input>

      <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

      <el-button
      v-if="isAddBtn"
      class="filter-item" style="float: left;" @click="handleCreate" type="primary" icon="edit">添加推荐课程</el-button>
      <el-button class="filter-item" style="float: left; margin-right: 20px;" @click="handleEdit" type="primary" icon="edit">修改推荐课程</el-button>


      <!-- 表格 -->
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
        <el-table-column width="85px" align="center" label="课程 ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="课程名">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="头像" width="100px">
          <template scope="scope" style="">
            <div style="width: 60px; height: 60px; overflow:hidden; padding: 5px 0;">
              <img style="width:50px; height:50px; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
            </div>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" label="价格">
          <template scope="scope">
            <span style='color:red;'>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="240px" align="center" label="直播 ID">
          <template scope="scope">
            <span >{{scope.row.liveshowId}}</span>
          </template>
        </el-table-column>
        <el-table-column width="85px" align="center" label="论坛 ID">
          <template scope="scope">
            <span>{{scope.row.bbsId || '无'}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column width="150px" align="center" label="操作">
          <template scope="scope">
            <el-dropdown trigger="click">
              <span style="margin: 0; padding: 5px 10px;" class="el-dropdown-link link-type">
              操作菜单<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">

              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 底部分页 -->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>
  </div>
</template>
<script>
  import api from './api.js'
  import courseApi from '../../course/api.js'

  export default {
    data() {
      return {
        isAddBtn: true,
        recommend_data: [],
        id: '', // 列表的id
        list_first:[],
        list: [],
        total: null,
        currentPage: 1,
        listLoading: true,
        listQuery: {
          offset: 1,
          limit: 10,
          title: undefined,
          type: 0,
          status: undefined,
          sort: '+id'
        },
        tableKey: 0
      }
    },
    watch: {
    },
    async created() {
      await this.getRecommendCourseList()
      if (this.list_first.length > 0) {
        this.getList()
      }
    },
    filters: {

    },
    methods: {
      async getRecommendCourseList() {
        try {
          this.listLoading = false
          let params = {
            url: '/admin/recommendation',
            data: {
              offset: (this.currentPage - 1) * this.listQuery.limit,
              limit: this.listQuery.limit,
              options: JSON.stringify({"type": 1})
            }
          }
          let result = await api.getRecommendCourseList(params)

          result.rows.length > 0 ? (this.isAddBtn = false) : ''
          if (result.rows.length > 0) {
            this.recommend_data = result.rows[0]

            this.id = result.rows[0].id
            result.rows[0].target_ids.map((item) => {
              this.list_first.push(item.id)
            })
          }

        } catch (err) {
          this.listLoading = false
          this.logerrFail(err)
        }
      },

      async getList () {
        let course = ''
        for (let i = 0; i < this.list_first.length; i++) {
          course += '&product_ids[]=' + this.list_first[i]
        }
        let end = await courseApi.getCourseList({url: '/admin/course/course-list?offset=' + (this.currentPage - 1)*this.listQuery.limit + '&limit=' + this.listQuery.limit + course})

        this.list = end.rows
        this.total = end.total
      },

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

      handleFilter() {
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      // 页码数改变
      handleCurrentOffsetChange(val) {
        // this.listQuery.offset = val
        this.currentPage = val
        this.getList()
      },

      handleCreate () {
        this.$router.push('./createCourse')
      },

      handleEdit (row) {
        localStorage.setItem('recommend_data', JSON.stringify(this.recommend_data))
        localStorage.setItem('recommend_list', JSON.stringify(this.list))
        this.$router.push({ path: './editCourse', query: { id: this.id }})
      }
    }
  }

</script>
<style lang="scss" scoped>
  .index-recommend .pagination-container {
    text-align: center;
  }
</style>
