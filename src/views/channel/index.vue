<template>

  <div class="app-container calendar-list-container">
    <div class="">

      <!-- 顶部搜索 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="channel-index-filter-item" placeholder="频道名" v-model="listQuery.name">
      </el-input>

      <!-- <el-select clearable @change='handleFilter' style="width: 120px" class="channel-index-filter-item" v-model="listQuery.is_recommend" placeholder="推荐">
        <el-option v-for="item in recommendOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select> -->

      <el-select clearable @change='handleFilter' style="width: 140px;" class="channel-index-filter-item" v-model="listQuery.is_public" placeholder="是否公开">
        <el-option v-for="item in publicOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button style="margin-left: 12px;" class="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="" @click="handleCreateBBS" type="primary" icon="plus">添加频道</el-button>
      <!-- <el-button class="channel-index-filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button> -->

      <!-- 表格 -->
      <el-table style="width: 95%" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
        <el-table-column width="100px" align="center" label="频道 ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="频道名">
          <template scope="scope">
           <!-- class="link-type" @click="goToEditChannel(scope.row)" -->
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

        <!-- <el-table-column align="center" label="推荐" width="110px">
          <template scope="scope">
            <el-tag v-if="scope.row.isRecommend === 1" type="success">已推荐</el-tag>
            <el-tag v-else type="gray">未推荐</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="公开" width="110px">
          <template scope="scope">
            <el-tag v-if="scope.row.isPublic === 1" type="success">公开</el-tag>
            <el-tag v-else type="gray">私有</el-tag>
          </template>
        </el-table-column>

        <el-table-column width="260px" align="center" label="操作">
          <!-- <template scope="scope">
            <el-dropdown @command="handleCommand" trigger="click">
              <span style="margin: 0; padding: 5px 10px;" class="el-dropdown-link link-type">
              操作菜单<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(action, index) in channelActionTypeOptions" :key="action.key" :command="action.key + '#' + scope.row.id">{{ action.display_name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template> -->
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="goToEditChannel(scope.$index, scope.row)">编辑</el-button>

            <!-- <el-button v-if="scope.row.isRecommend === 1"
              size="small"
              @click="recommendChannel(scope.$index, scope.row)">取消推荐</el-button>
            <el-button v-else
              size="small"
              type="success"
              @click="recommendChannel(scope.$index, scope.row)">推荐</el-button> -->

            <!-- <el-button
              size="small"
              type="danger"
              @click="delChannel(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
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
  import { sortOptions, channelActionTypeOptions } from './types.js'
  import api from './api.js'
  import qs from 'qs'
  import _ from 'lodash'

  export default {
    data() {
      return {
        sortOptions: sortOptions,
        channelActionTypeOptions: channelActionTypeOptions,
        recommendOptions: [{ label: '已推荐', key: 1 }, { label: '未推荐', key: 0 }],
        publicOptions: [{ label: '公开', key: 1 }, { label: '私有', key: 0 }],
        tableKey: 1,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          name: '',
          page: 1,
          limit: 30,
          is_recommend: '',
          is_public: ''
        },
      }
    },
    created() {
      this.getBBSList()
    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/bbs-list?'
        url = url + qs.stringify(this.listQuery, { encoder: function (str) {
          return typeof str === 'string' ? str.trim() : str
        }})
        return url
      },
      handleFilter () {
        this.getBBSList()
      },
      async getBBSList() {
        try {
          this.listLoading = true
          let result = await api.getBBSList({url: this.queryURL()})
          this.listLoading = false
          this.list = result.rows
          this.total = result.total
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getBBSList()
      },
      handleCurrentOffsetChange(val) {
        this.listQuery.page = val
        this.getBBSList()
      },
      handleCommand(command) {
        let bbsId = command.split('#')[1]
        let action = command.split('#')[0]
        if (action === 'del' && bbsId) {
          this.$confirm('将删除该论坛, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteBBS(bbsId)
          }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // })
          });
        }
      },
      async recommendChannel (index, row) {
        let beforeRecommend = row.isRecommend
        if (row && row.id) {
          try {
            let result = await api.postRecommendBBS({bbsId: row.id})
            if (result === 1) {
              row.isRecommend = beforeRecommend ? 0 : 1
              this.list.splice(index, 1, row)
              this.$notify.success({
                title: '成功',
                message: beforeRecommend ? '已取消推荐' : '已推荐',
                duration: 1000
              });
            }
          } catch (err) {
            window.alert(err)
          }
        }
      },
      async deleteBBS (bbsId) {
        let index = _.findIndex(this.list, function(bbs) { return bbs.id == bbsId })
        if (index > -1) {
          try {
            let result = await api.postDeleteBBS({ id: bbsId })
            if (result) {
              this.list.splice(index, 1)
              this.total = this.total - 1
              this.$notify.success({
                title: '成功',
                message: '已删除论坛',
                duration: 1000
              })
            }
          } catch (err) {
            window.alert(err)
          }
        }
      },
      delChannel (index, row) {
        if (row && row.id) {
          this.$confirm('将删除该论坛, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteBBS(row.id)
          }).catch(() => {

          });
        }
      },
      goToEditChannel (index, row) {
        this.$router.push({ path: './editChannel', query: { id: row.id }})
      },
      handleCreateBBS () {
        this.$router.push('./createChannel')
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
/*  .el-input {
    width: 80%;
  }*/
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

