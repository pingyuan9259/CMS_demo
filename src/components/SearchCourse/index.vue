<template>
	<div class="search-course">
    <h4 class="course-title">搜索课程:</h4>

    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="课程名称" v-model="listQuery.search" icon="search">
    </el-input>

    <el-table v-if="list.length > 0" :data="list" v-loading.body="listLoading" stripe border fit highlight-current-row>

      <el-table-column align="center" label="选择">
        <template scope="scope">
          <el-button v-if='selectedRowId === scope.row.id' type="success" @click='clickRow(scope.row)' size="small" icon="check">已选择</el-button>
          <el-button v-if='selectedRowId !== scope.row.id' type="primary" @click='clickRow(scope.row)' size="small" icon="edit">未选择</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像">
        <template scope="scope" style="">
          <div style="width: 40px; height: 40px; overflow:hidden; margin: 5px auto;">
            <img style="width:40px; height:40px; border-radius: 4px;" :src="scope.row.avatar || '//o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ID">
        <template scope="scope" style="">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import api from './api'
  export default {
    name: 'search-course',
    data () {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          search: ''
        },
        selectedRowId: ''
      }
    },
    props: {
      status: {
        default: 2
      },
      differ: {
        type: String, // 用于同一个页面多次调用组件的区分
        default: ''
      }
    },
    methods: {
      async getList () {
        this.listLoading = true
        let query = this.listQuery
        let params = {
          url: '/admin/course/course-list',
          data: {
            offset: (query.page - 1) * query.limit,
            limit: query.limit,
            status: this.status,
            name: query.search
          }
        }
        try {
          let data = await api.getList(params)
          this.list = data.rows
          this.total = data.total
          this.listLoading = false
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleFilter(e) {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      clickRow (row) {
        this.listQuery.search = ''
        this.list = []
        this.selectedRowId = row.id
        row.differ = this.differ
        this.$store.dispatch('chooseResult', row)
      }
    }
  }
</script>
<style>
  .search-course {
    width: 100%;
    margin-top: 2%;
  }
  .course-title {
    width: 10%;
    display: inline-block;
  }
</style>