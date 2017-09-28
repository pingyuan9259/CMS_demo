<template>
  <div class="user-con">
    <h4 class="user-title">搜索用户:</h4>

    <el-input @keyup.enter.native="handleFilter" class="filter-item user-search" placeholder="姓名或手机号" v-model="listQuery.search" icon="search">
    </el-input>

    <el-table v-if="list.length > 0" :data="list" v-loading.body="listLoading" stripe border fit highlight-current-row>

      <el-table-column align="center" label="选择">
        <template scope="scope">
          <el-button v-if='selectedRowId === scope.row.id' type="success" @click='clickRow(scope.row)' size="small" icon="check">已选择</el-button>
          <el-button v-if='selectedRowId !== scope.row.id' type="primary" @click='clickRow(scope.row)' size="small" icon="edit">未选择</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template scope="scope">
          <span>{{scope.row.fullname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像">
        <template scope="scope" style="">
          <div style="width: 40px; height: 40px; overflow:hidden; margin: 5px auto;">
            <img style="width:40px; height:40px; border-radius: 4px;" :src="scope.row.avatar || '//o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机">
        <template scope="scope">
          <span>{{scope.row.phone ? scope.row.phone : '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱">
        <template scope="scope">
          <span>{{scope.row.email ? scope.row.email : '-'}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import api from './api'
	export default {
		name: 'search-user',
    data () {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          search_fields: '["phone", "fullname", "email", "username"]',
          search: '',
          status: 1
        },
        selectedRowId: ''
      }
    },
    methods: {
      async getList() {
        this.listLoading = true
        let query = this.listQuery
        let params = {
          url: '/admin/user/data-table',
          data: {
            offset: (query.page - 1) * query.limit,
            limit: query.limit,
            search_fields: query.search_fields,
            search: query.search,
            options: JSON.stringify({_status: query.status, type: {$ne: -999}})
          }
        }
        try {
          let result = await api.getList(params)
          this.listLoading = false
          this.list = result.rows
          this.total = result.total
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
        this.resetQuery()
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
      resetQuery () {
        this.listQuery.start = ''
        this.listQuery.end = ''
      },
      clickRow (row) {
        this.listQuery.search = ''
        this.list = []
        this.selectedRowId = row.id
        this.$store.dispatch('chooseResult', row)
      }
    }
	}
</script>
<style>
  .user-title {
    width: 10%;
    display: inline-block;
    margin-top: 5%;
  }
  .user-search {
    width: 89%;
    margin-bottom: 5%;
  }
</style>