<template>

  <div class="app-container calendar-list-container">
    <div class="exe-container">

      <!-- 顶部搜索 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="channel-index-filter-item" placeholder="作业论坛名" v-model="listQuery.name">
      </el-input>

      <el-button style="margin-left: 12px;" class="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

      <el-button class="" @click="operateExercisePost" type="primary" icon="edit">老师作业管理</el-button>
      <el-button class="" @click="operateExerciseReply" type="primary" icon="edit">学生作业管理</el-button>

      <!-- 表格 -->
      <el-table style="" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
        <el-table-column width="100px" align="center" label="论坛 ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="作业论坛名">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="头像" width="120px">
          <template scope="scope">
            <div class="img-wrapper">
              <img style="max-width: 100%; max-height: 100%; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column width="260px" align="center" label="操作">
          <template scope="scope">
            <el-button size="small" type="primary" @click="editExerciseBBS(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 底部分页 -->
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>
  </div>

</template>

<script>
  import api from './api.js'
  import _ from 'lodash'

  export default {
    data() {
      return {
        tableKey: 1,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 30,
          name: '',
          is_recommend: '',
          is_public: ''
        },
      }
    },
    created() {
      this.getExerciseBBSList()
    },
    methods: {
      handleFilter () {
        this.getExerciseBBSList()
      },
      async getExerciseBBSList() {
        try {
          this.listLoading = true
          let result = await api.getExerciseBBSList(this.listQuery)
          this.list = result.rows
          this.total = result.total
        } catch (err) {
          window.alert(err)
        }
        this.listLoading = false
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getExerciseBBSList()
      },
      handleCurrentOffsetChange(val) {
        this.listQuery.page = val
        this.getExerciseBBSList()
      },
      operateExercisePost () {
        this.$router.push('./operateExercisePost')
      },
      operateExerciseReply () {
        this.$router.push('./operateExerciseReply')
      },
      editExerciseBBS (index, row) {
        this.$router.push({ path: './editExerciseBBS', query: { id: row.id }})
      },
      handleCreateBBS () {
        this.$router.push('./createChannel')
      }
    }
  }

</script>

<style>
  .exe-container {
    margin: 20px auto;
    width: 90%;

  }
  .channel-index-filter-item {
    margin: 0 0 20px 0;
  }
  .cell .el-tag {
    margin-right: 0;
    margin-top: 0;
  }
  .img-wrapper {
    padding: 4px;
    height: 60px;
    overflow:hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>

