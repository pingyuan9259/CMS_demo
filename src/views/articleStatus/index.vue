<template>

  <div class="app-container calendar-list-container">
    <div class="">

      <!-- 顶部搜索 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="channel-index-filter-item" placeholder="文章标题" v-model="listQuery.title">
      </el-input>

      <el-button style="margin-left: 12px;" class="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

      <el-button-group>
        <el-button class="filter-item" @click="handleFilter" type="primary">所有文章</el-button>
        <el-button class="filter-item" @click="handleFilter($event, 'yes')" type="primary">已推荐</el-button>
        <el-button class="filter-item" @click="handleFilter($event, 'no')" type="primary">未推荐</el-button>
      </el-button-group>

      <!-- 表格 -->
      <el-table style="width: 95%" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
        <el-table-column width="100px" align="center" label="文章 ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="文章标题">
          <template scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="推荐" width="110px">
          <template scope="scope">
            <el-tag v-if="scope.row.isRecommend === 1" type="success">已推荐</el-tag>
            <el-tag v-else type="gray">未推荐</el-tag>
          </template>
        </el-table-column>

        <el-table-column width="260px" align="center" label="操作">
          <template scope="scope">
            <el-button
              size="small"
              :type="scope.row.isRecommend === 1 ? 'danger' : 'primary'"
              @click="recommendArticle(scope.row.id)">{{ scope.row.isRecommend === 1 ? '取消推荐' : '改为推荐' }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>
  </div>

</template>

<script>
  import api from './api.js'

  export default {
    data() {
      return {
        tableKey: 1,
        total: null,
        list: [],
        currentPage: 1,
        listLoading: true,
        isRequiring: false,
        listQuery: {
          user_name: '',
          title: '',
          page: 1,
          limit: 10,
          is_recommend: '',
          is_stick: ''
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/article-post?page=' + this.currentPage + '&limit=' + this.listQuery.limit
        if (this.listQuery.user_name.trim().length) {
          url = url + '&user_name=' + this.listQuery.user_name.trim()
        }
        if (this.listQuery.title.trim().length) {
          url = url + '&title=' + this.listQuery.title.trim()
        }
        url = url + '&is_recommend=' + this.listQuery.is_recommend
        url = url + '&is_stick=' + this.listQuery.is_stick
        return url
      },
      handleFilter (e, is_recommend) {
        if (is_recommend) {
          this.listQuery.is_recommend = is_recommend === 'yes' ? 1 : 0  
        } else {
          this.listQuery.is_recommend = ''
        }
        this.getList()
      },
      async getList() {
        try {
          this.listLoading = true
          let result = await api.getPostList({url: this.queryURL()})
          this.listLoading = false
          this.list = result.rows
          this.total = result.total
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      async recommendArticle (id) {
        try {
          if (this.isRequiring) {
            return
          }
          this.isRequiring = true
          let data = {
            postId: +id
          }
          let result = await api.recommendArticle(data)
          this.getList()
          this.isRequiring = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentOffsetChange(val) {
        this.currentPage = val
        this.getList()
      },

      notifyFailedSubmit(response) {
        this.$notify.error({
          title: '出错了',
          message: response.data.message,
          duration: 1000
        })
      },

    }
  }

</script>

<style>
  .channel-index-filter-item {
    margin: 0 0 20px 0;
  }
  .cell .el-tag {
    margin-right: 0;
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

