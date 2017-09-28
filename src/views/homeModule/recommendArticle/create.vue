<template>
  <Box class="article-box">
    <span slot="box-header">添加 推荐文章</span>
    <div slot="box-body">
      <!-- 文章列表 -->
      <div class="app-container calendar-list-container">
        <div class="filter-container">

          <!-- 顶部搜索 -->
          <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="文章名" v-model="listQuery.title">
          </el-input>
          <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="作者" v-model="listQuery.user_name">
          </el-input>

          <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

          <!-- 表格 -->
          <el-table style="width: 100%" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
            <el-table-column min-width="150px" label="文章名">
              <template scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="文章ID" width="100px">
              <template scope="scope">
                <span >{{scope.row.id}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100px" align="center" label="操作">
              <template scope="scope">
                <el-button size="small" type="primary" @click="handleAdd(scope.$index, scope.row)">{{ scope.row.btnContent || '添加'}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 底部分页 -->
          <div class="pagination-container">
            <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>

        </div>
      </div>

      <!-- 被推荐的内容 -->
      <div class="list-content">

        <el-table style="width: 100%" :data="recommendList" v-loading.body="listLoading" border fit highlight-current-row>
          <el-table-column min-width="150px" label="推荐文章名">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="权重" width="100px">
            <template scope="scope">
              <div style="width: 60px; height: 60px; line-height: 60px; overflow:hidden; padding: 5px 0;">
                <input style="width: 60px;"
                 type="text" v-model.number="scope.row.weight"></input>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="文章ID" width="100px">
            <template scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column width="100px" align="center" label="操作">
            <template scope="scope">
              <el-button size="small" type="warning" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

         <el-button type="success" class="article-sort"  style="height: 40px;margin-right: 20px;margin-top: 10px;" @click.prevent="sortRecommendArticle">排序</el-button>

        <el-button type="primary" class="article-submit"  style="height: 40px;margin-right: 20px;margin-top: 10px;" @click.prevent="createRecommendArticle">提交</el-button>
      </div>

    </div>
  </Box>
</template>

<script>
  import $ from 'jquery'
  import Box from '../../../components/Box/Box'
  import api from './api.js'
  import _ from 'lodash'

  export default {
    data() {
      return {
        tableKey: 1,
        list: [],
        total: null,
        currentPage: 1,
        listLoading: true,
        listQuery: {
          user_name: '',
          title: '',
          page: 1,
          limit: 10,
          is_recommend: '1',
          is_stick: ''
        },
        reqOptions: {
          type: 2,
          weight: 1,
          _status: 1,
          target_ids: []
        },
        recommendList: []
      }
    },
    created() {
      this.getList()
    },
    components: {
      Box
    },
    watch: {
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

      handleAdd (index, row) {
        let isFind = this.recommendList.find((rec) => {
          if (rec.id === row.id) {
            this.$notify({
              title: '已经添加',
              message: '重复添加',
              type: 'warning',
              duration: 1500
            })
          }
          return rec.id === row.id
        })
        if (!isFind) {
          //  添加选中的数据要改变左边列表的状态
          let obj = this.list[index]
          obj.btnContent = '已添加'
          this.list.splice(index, 1, obj)

          row.weight = 1
          this.recommendList.push(row)
        }
      },


      handleDelete (index, row) {
        this.recommendList = this.recommendList.filter((rec) => {
          return rec.id !== row.id
        })

        // 删除选中的数据要恢复左边列表的状态
        this.list.find((an, i) => {
          if (an.id === row.id) {
            let obj = this.list[i]
            obj.btnContent = '添加'
            this.list.splice(i, 1, obj)
          }
        })
      },

      handleFilter () {
        this.getList()
      },

      sortRecommendArticle () {
        this.recommendList.sort((a, b) => {
          return b.weight - a.weight
        })
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

      async getList() {
        try {
          this.listLoading = false
          let result = await api.getPostList({url: this.queryURL()})
          this.list = result.rows

          this.checkEach(this.recommendList, this.list)

          this.total = result.total
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      async createRecommendArticle () {
        try {
          $('.article-submit').attr('disabled', true)
          for (let i = 0; i < this.recommendList.length; i++) {
            this.reqOptions.target_ids.push({
              'id': this.recommendList[i].id,
              'weight': +this.recommendList[i].weight || 1
            })
          }
          let result = await api.createRecommendArticle(this.reqOptions)
          this.logerrSuccess()
          $('.article-submit').removeAttr('disabled')
        } catch (err) {
          this.logerrFail(err)
        }
      },

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

      checkEach (res, data) {
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (res[i].id === data[j].id) {
              data[j].btnContent = '已添加'
            }
          }
        }
        this.list = [].concat(data)
      },

    }
  }

</script>

<style>

  .article-box {
    margin: 30px;
  }
  .article-box .list-content {
    overflow-y: auto;
    position: relative;
    border: 1px solid #bfcbd9;
    margin-top: 65px;
    float: right;
    width: 450px;
    height: 650px;
  }
  .article-box .article-sort {
    position: fixed;
    bottom: 70px;
    right: 166px;
  }
  .article-box .article-submit {
    position: fixed;
    bottom: 70px;
    right: 66px;
  }
  .cell .el-tag {
    margin-right: 0;
  }
  .article-box .calendar-list-container {
    width: 450px;
    display: inline-block;
  }
  .article-box .pagination-container {
    display: inline-block;
    width: 50%;
  }
</style>
