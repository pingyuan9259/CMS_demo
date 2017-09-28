<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <!-- 顶部搜索、排序 -->
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="文章名" v-model="listQuery.title">
      </el-input>

      <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

      <el-button v-if="isAddBtn"
      class="filter-item" style="float: left;" @click="handleCreate" type="primary" icon="edit">添加推荐文章</el-button>

      <el-button class="filter-item" style="float: left; margin-right: 20px;" @click="handleEdit" type="primary" icon="edit">修改推荐文章</el-button>


      <!-- 表格 -->
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
        <el-table-column width="85px" align="center" label="文章ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="文章名">
          <template scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="所属频道">
          <template scope="scope">
            <span>{{scope.row.bbsName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="权重">
          <template scope="scope">
            <span>{{ weightObj[scope.row.id] }}</span>
          </template>
        </el-table-column>
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

  export default {
    data() {
      return {
        recommend_data: [],
        isAddBtn: true,
        id: '',
        list: [],
        list_first:[],
        weightObj: {},
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
      await this.getRecommendArticleList()
      if (this.list_first.length > 0) {
        this.getList()
      }
    },
    filters: {

    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/post-list?'
        let src = ''
        for (let i = 0, len = this.list_first.length; i < len; i++) {
          if (i === 0) {
            src += 'ids[]=' + this.list_first[i]
          } else {
            src += '&ids[]=' + this.list_first[i]
          }

        }

        return url + src
      },

      async getList() {
        try {
          this.listLoading = false
          let result = await api.getPostList({url: this.queryURL()})
          this.list = result
          this.total = result.length
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },

      async getRecommendArticleList() {
        try {
          this.listLoading = false
          let params = {
            url: '/admin/recommendation',
            data: {
              offset: (this.currentPage - 1)*this.listQuery.limit,
              limit: this.listQuery.limit,
              options: JSON.stringify({"type": 2})
            }
          }
          let result = await api.getRecommendArticleList(params)

          result.rows.length > 0 ? (this.isAddBtn = false) : ''
          if (result.rows.length > 0) {
            this.recommend_data = result.rows[0]
            this.id = result.rows[0].id
            result.rows[0].target_ids.map((item) => {
              this.list_first.push(item.id)
              this.weightObj[item.id] = item.weight
            })
          }
        } catch (err) {
          this.listLoading = false
          this.logerrFail(err)
        }
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
        this.$router.push('./createArticle')
      },

      async handleDelete (row) {
        let params = {
          id: row.id
        }
        let result = await api.delRecommendArticle(params)
        console.log('>>>>>>>>>>', result)
      },

      handleEdit (row) {
        localStorage.setItem('recommend_data', JSON.stringify(this.recommend_data))
        localStorage.setItem('recommend_list', JSON.stringify(this.list))
        this.$router.push({ path: './editArticle', query: { id: this.id }})
      }
    }
  }

</script>
<style lang="scss" scoped>

</style>
