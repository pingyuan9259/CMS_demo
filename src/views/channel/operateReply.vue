<template>
  <div class="operateReplyContainer">
    <!-- 顶部搜索 -->
    <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="回复内容" v-model="listQuery.content">
    </el-input>

     <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="热度排序">
      <el-option v-for="item in hotOptions" :key="item.key" :label="item.label" :value="item.key">
      </el-option>
    </el-select>

    <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.time_sort" placeholder="时间排序">
      <el-option v-for="item in timeSortOptions" :key="item.key" :label="item.label" :value="item.key">
      </el-option>
    </el-select>

    <el-date-picker
      v-model="timeRange"
      type="daterange"
      :picker-options="pickerOptions"
      placeholder="选择时间范围"
      align="right">
    </el-date-picker>

    <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

    <div style="width: 60%; margin: 20px 0;">
      <el-tag
        :key="tag.id"
        type="primary"
        v-for="tag in userModels"
        :closable="true"
        :close-transition="false"
        @close="handleClose(tag)"
      >
      {{tag.fullname}}
      </el-tag>
        <user></user>
    </div>

    <el-table style="width: 90%; margin-top: 20px;" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column width="100px" align="center" label="回复 ID">
        <template scope="scope">
          <span>{{scope.row.replyId}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="回复内容">
        <template scope="scope">
         <!-- class="link-type" @click="goToReplyDetail(scope.row)" -->
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120px" label="发起者姓名">
        <template scope="scope">
          <span>{{scope.row.fullname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起者头像" width="150px">
        <template scope="scope">
          <div class="img-wrapper">
            <img style="max-width: 100%; max-height: 100%; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="操作">
        <template scope="scope">
          <!-- <el-button
            size="small"
            @click="goToReplyDetail(scope.$index, scope.row)">看贴</el-button> -->
          <el-button
            size="small"
            type="danger"
            @click="delReplyAlert(scope.$index, scope.row)">删除</el-button>

        </template>
      </el-table-column>

    </el-table>

    <!-- 底部分页 -->
    <div class="pagination-container" v-loading="listLoading">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>

  import Cookies from 'js-cookie'
  import Request from 'utils/request'
  import { APP_TOKEN_KEY, APP_ENV } from 'config/app'
  import api from './api.js'
  import _ from 'lodash'
  import { parseTime, dateFormat } from 'utils'
  import qs from 'qs'

  import user from 'components/SearchUser/index'
  import { mapGetters } from 'vuex'
  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  const pickerOptions = {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近 30 天',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近 90 天',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  }

  export default {
    data () {
      return {
        tableKey: 5,
        listLoading: false,
        list: [],
        total: 0,
        currentPage: 1,
        pickerOptions: pickerOptions,
        hotOptions: [{ label: '最热', key: 'hot' }],
        timeSortOptions: [{ label: '时间倒序', key: 'DESC' }, { label: '时间正序', key: 'ASC' }],
        listQuery: {
          limit: 20,
          content: '',
          sort: '',
          time_sort: '',
          user_name: '',
          begin_date: '',
          end_date: ''
        },
        timeRange: [],
        userModels: [],
        uniq_from_user_ids: []
      }
    },
    components: { user },
    created () {
      this.getTopReplys()
    },
    computed: {
      ...mapGetters([
        'choose'
      ])
    },
    watch: {
      choose (val) {
        if (val.id && val.fullname) {
          let index = _.findIndex(this.userModels, function(usr) { return usr.id == val.id })
          if (index < 0) {
            this.userModels.push(val)
          }
        }
      },
      userModels (val) {
        this.handleFilter()
      }
    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/reply-top?page=' + this.currentPage + '&limit=' + this.listQuery.limit
        if (this.listQuery.time_sort) {
          url = url + '&time_sort=' + this.listQuery.time_sort
        }
        if (this.listQuery.sort) {
          url = url + '&sort=' + this.listQuery.sort
        }
        if (this.listQuery.content.trim().length) {
          url = url + '&content=' + this.listQuery.content.trim()
        }
        if (this.timeRange.length > 1) {
          let start = this.timeRange[0]
          if (start) {
            url = url + '&begin_date=' + parseTime(new Date(start), '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
        if (this.timeRange.length > 1) {
          let end = this.timeRange[1]
          if (end) {
            url = url + '&end_date=' + parseTime(new Date(end), '{y}-{m}-{d} {h}:{i}:{s}').replace('00:00:00', '23:59:59')
          }
        }
        if (this.userModels.length) {
          let user_ids = _.map(this.userModels, function(usr) { return usr.id })
          url = url + '&' + qs.stringify({ user_ids: user_ids}, { arrayFormat: 'brackets' })
        }
        return url
      },

      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getTopReplys()
      },
      handleCurrentOffsetChange(val) {
        this.currentPage = val
        this.getTopReplys()
      },
      async getTopReplys () {
        this.listLoading = true
        try {
          let result = await api.getTopReplys({url: this.queryURL()})
          this.listLoading = false
          if (result && result.rows) {
            this.list = result.rows.map((reply) => { reply.fullname = ''; reply.avatar = ''; return reply; })
            this.total = result.total

            let from_user_ids = _.map(this.list, function(reply) { return reply.fromUserId })
            let uniq_from_user_ids = _.uniq(from_user_ids, 'id')
            this.getUsersInforsFromReplys(uniq_from_user_ids)

          }
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      async getUsersInforsFromReplys (ids) {
        try {
          if (ids && ids.length) {
            let url = '/admin//user/user-info-map?field=_id'
            url = url + '&' + qs.stringify({ values: ids}, { arrayFormat: 'brackets' })
            url = url + '&projection=avatar fullname'
            let result = await api.getUsersInfos({url: url})
            _.map(this.list, function(reply) {
              if (result[reply.fromUserId] && result[reply.fromUserId].fullname) {
                reply.fullname = result[reply.fromUserId].fullname
              }
              if (result[reply.fromUserId] && result[reply.fromUserId].avatar) {
                reply.avatar = result[reply.fromUserId].avatar
              }
              return reply
            })
          }
        } catch (err) {
          window.alert(err)
        }
      },
      handleFilter () {
        this.getTopReplys()
      },
      goToReplyDetail (index, row) {
        if (row && row.postId) {
          window.open(`http://m${ENV}.xinshengdaxue.com/post_detail.html?post_id=${row.postId}`)
        }
      },
      delReplyAlert (index, row) {
        if (row && row.replyId) {
          this.$confirm('将删除这篇回复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteReply(row.replyId)
          }).catch(() => {

          });
        }
      },
      async deleteReply (replyId) {
        this.listLoading = true
        try {
          let result = await api.postDeleteReply({reply_id: replyId})
          this.listLoading = false
          if (result === 1) {
            this.notifySuccess('已删除')
            let index = _.findIndex(this.list, function(reply) { return reply.replyId == replyId })
            if (index > -1) {
              this.list.splice(index, 1)
              this.total -= 1
            }
          }
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      notifySuccess(msg='成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        });
      },
      notifyErr(msg='出错了') {
        this.$notify.error({
          title: '出错了',
          message: msg,
          duration: 1000
        })
      },
      handleClose (tag) {
        let index = _.findIndex(this.userModels, function(usr) { return usr.id == tag.id })
        if (index > -1) {
          this.userModels.splice(index, 1)
        }
      }
    }

  }
</script>

<style>

  .operateReplyContainer {
    margin: 20px 20px 40px 20px;
  }
  .el-tag {
    margin-top: 15px;
    margin-right: 10px;
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