<template>
  <Box class="channel-box">
    <span slot="box-header">编辑 推荐频道</span>
    <div slot="box-body">
      <!-- 频道列表 -->
      <div class="app-container calendar-list-container">
        <div class="filter-container">

          <!-- 顶部搜索 -->
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="频道名" v-model="listQuery.name">
          </el-input>

          <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

          <!-- 表格 -->
          <el-table style="width: 100%" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
            <el-table-column min-width="150px" label="频道名">
              <template scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="头像" width="100px">
              <template scope="scope">
                <div style="width: 60px; height: 60px; overflow:hidden; padding: 5px 0;">
                  <img style="width:50px; height:50px; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
                </div>
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
          <el-table-column min-width="150px" label="推荐频道名">
            <template scope="scope">
              <span>{{scope.row.name}}</span>
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

          <el-table-column align="center" label="头像" width="100px">
            <template scope="scope">
              <div style="width: 60px; height: 60px; overflow:hidden; padding: 5px 0;">
                <img style="width:50px; height:50px; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
              </div>
            </template>
          </el-table-column>

          <el-table-column width="100px" align="center" label="操作">
            <template scope="scope">
              <el-button size="small" type="warning" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

         <el-button type="success" class="channel-sort"  style="height: 40px;margin-right: 20px;margin-top: 10px;" @click.prevent="sortRecommendChannel">排序</el-button>

        <el-button type="primary" class="channel-submit"  style="height: 40px;margin-right: 20px;margin-top: 10px;" @click.prevent="editRecommendChannel">提交</el-button>
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
        id: '',
        StorageData: [],
        StorageList: [],
        tableKey: 1,
        list: [],
        total: null,
        currentPage: 1,
        listLoading: true,
        listQuery: {
          name: '',
          page: 1,
          limit: 10,
          is_recommend: '',
          is_public: '1'
        },
        reqOptions: {
          id: '',
          type: 3,
          weight: 1,
          _status: 1,
          target_ids: []
        },
        recommendList: []
      }
    },
    created() {
      this.getList()
      this.reqOptions.id  = this.$route.query.id
      this.StorageList = JSON.parse(localStorage.getItem('recommend_list'))
      this.recommendList = this.StorageList

      this.StorageData = JSON.parse(localStorage.getItem('recommend_data'))

      if (!this.StorageData) {
        return
      }

      let data = this.StorageData.target_ids

      for (let i = 0; i < data.length; i++) {
        for (let j =0; j < this.recommendList.length; j++) {
          if (data[i].id == this.recommendList[j].id) {
            this.recommendList[j].weight = data[i].weight
          }
        }
      }

    },
    components: {
      Box
    },
    watch: {
    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/bbs-list?page=' + this.currentPage + '&limit=' + this.listQuery.limit
        if (this.listQuery.name.trim().length) {
          url = url + '&name=' + this.listQuery.name.trim()
        }
        url = url + '&is_recommend=' + this.listQuery.is_recommend
        url = url + '&is_public=' + this.listQuery.is_public
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

      sortRecommendChannel () {
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
          let result = await api.getBBSList({url: this.queryURL()})
          this.list = result.rows

          this.checkEach(this.recommendList, this.list)

          this.total = result.total
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      async editRecommendChannel () {
        try {
          $('.channel-submit').attr('disabled', true)
          for (let i = 0; i < this.recommendList.length; i++) {
            this.reqOptions.target_ids.push({
              'id': this.recommendList[i].id,
              'weight': +this.recommendList[i].weight || 1
            })
          }
          let result = await api.editRecommendChannel(this.reqOptions)
          this.logerrSuccess()
          this.resetReqOptions()
          this.$router.replace({ path: './index'})
          $('.channel-submit').removeAttr('disabled')
        } catch (err) {
          this.logerrFail(err)
        }
      },

      resetReqOptions () {
        this.reqOptions = {
          id: this.reqOptions.id,
          type: 3,
          weight: 1,
          _status: 1,
          target_ids: []
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

    },
    beforeDestroy () {
      localStorage.removeItem('recommend_list')
      localStorage.removeItem('recommend_data')
    }
  }

</script>

<style>

  .channel-box {
    margin: 30px;
  }
  .channel-box .list-content {
    overflow-y: auto;
    position: relative;
    border: 1px solid #bfcbd9;
    margin-top: 65px;
    float: right;
    width: 450px;
    height: 650px;
  }
  .channel-box .channel-sort {
    position: fixed;
    bottom: 70px;
    right: 166px;
  }
  .channel-box .channel-submit {
    position: fixed;
    bottom: 70px;
    right: 66px;
  }
  .cell .el-tag {
    margin-right: 0;
  }
  .channel-box .calendar-list-container {
    width: 450px;
    display: inline-block;
  }
 /* .channel-box .pagination-container {
    display: inline-block;
    width: 50%;
  }*/
</style>
