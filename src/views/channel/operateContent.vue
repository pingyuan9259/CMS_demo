<template>
  <div class="operateContentContainer">
      <!-- 顶部搜索 -->
    <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="贴子标题" v-model="listQuery.title">
    </el-input>

    <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="频道 ID" v-model="listQuery.bbsId">
    </el-input>

    <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

    <div style="width: 70%; margin: 20px 0;">
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
      <el-table-column width="100px" align="center" label="贴子 ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="贴子标题" align="center">
        <template scope="scope">
          <span class="link-type" @click="goToPostDetail(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="所属频道" align="center">
        <template scope="scope">
          <span class="link-type">{{scope.row.bbsName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="140px" label="文章作者姓名">
        <template scope="scope">
          <span>{{scope.row.fullname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章作者头像" width="150px">
        <template scope="scope">
          <div class="img-wrapper">
            <img style="max-width: 100%; max-height: 100%; border-radius: 6px;" :src="scope.row.userAvatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览量" width="100px">
        <template scope="scope">
          <span>{{ scope.row.pvCount }}</span>
        </template>
      </el-table-column>

        <el-table-column width="150px" align="center" label="操作">
          <template scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="delPostAlert(scope.row)">删除</el-button>
          </template>
        </el-table-column>

    </el-table>

    <!-- 删帖提示 -->
    <el-dialog title="提示" :visible.sync="isDelPost" size="small" :before-close="handleCloseDel">
      <span>删帖理由：</span>
        <el-select style="width: 200px;margin-top:10px;"  clearable placeholder="请选择" v-model="selectedReason">
        <el-option
          v-for="item in typeOptions"
          :label="item.title"
          :key="item.id"
          :value="item.remark"
          >
        </el-option>
      </el-select>
      <p style="color:#b0b0b0">消息将通过 新生大学团队 推送给用户，预览：</p>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请选择上方删帖理由或手动输入"
        v-model="delReason">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDel">取 消</el-button>
        <el-button type="primary" @click="deletePost">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 底部分页 -->
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>

  import Cookies from 'js-cookie'
  import Request from 'utils/request'
  import { APP_TOKEN_KEY, APP_ENV } from 'config/app'
  import { sortOptions, channelActionTypeOptions } from './types.js'
  import api from './api.js'
  import _ from 'lodash'
  import qs from 'qs'
  import user from 'components/SearchUser/index'
  import { mapGetters } from 'vuex'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    data () {
      return {
        tableKey: 3,
        listLoading: false,
        list: [],
        total: 0,
        currentPage: 1,
        sortOptions: [{ label: '时间倒序', key: 'DESC' }, { label: '时间正序', key: 'ASC' }],
        recommendOptions: [{ label: '已推荐', key: 1 }, { label: '未推荐', key: 0 }],
        stickOptions: [{ label: '已置顶', key: 1 }, { label: '未置顶', key: 0 }],
        typeOptions: [],
        userModels: [],
        listQuery: {
          limit: 20,
          time_sort: '',
          title: '',
          bbsId: '',
          user_name: '',
          is_recommend: '',
          is_stick: '',
        },
        delRow: null, // 要删除的组信息
        isDelPost: false, // dialog开关
        delReason: '',  // 删帖理由
        selectedReason: ''
      }
    },
    components: { user },
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
      selectedReason(val) {
        if(!val) {
          this.delReason = ''
          return
        }
        this.delReason = `您在 ${this.delRow && this.delRow.bbsName} 频道的帖子被管理员删除, 原因：${val ? val : '^_^'}。`
      }
    },
    created () {
      this.getArticlePost()
    },
    methods: {
      queryURL () {
        let url = '/admin/bbs/article-post?page=' + this.currentPage + '&limit=' + this.listQuery.limit
        if (this.listQuery.time_sort) {
          url = url + '&time_sort=' + this.listQuery.time_sort
        }
        if (this.listQuery.title.trim().length) {
          url = url + '&title=' + this.listQuery.title.trim()
        }
        if (this.listQuery.bbsId.trim().length) {
          url = url + '&bbs_id=' + this.listQuery.bbsId.trim()
        }
        if (this.listQuery.user_name.trim().length) {
          url = url + '&user_name=' + this.listQuery.user_name.trim()
        }
        url = url + '&is_recommend=' + this.listQuery.is_recommend
        url = url + '&is_stick=' + this.listQuery.is_stick
        if (this.userModels.length) {
          let user_ids = _.map(this.userModels, function(usr) { return usr.id })
          url = url + '&' + qs.stringify({ user_id_list: user_ids}, { arrayFormat: 'brackets' })
        }
        return url
      },

      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getArticlePost()
      },
      handleCurrentOffsetChange(val) {
        this.currentPage = val
        this.getArticlePost()
      },
      async getArticlePost () {
        try {
          this.listLoading = true
          let result = await api.getArticlePost({url: this.queryURL()})
          if (result && result.rows) {
            // this.list = result.rows
            this.total = result.total

            this.list = result.rows.map((article) => { article.fullname = ''; article.userAvatar = ''; return article; })
            let from_user_ids = _.map(this.list, function(article) { return article.userId })
            let uniq_from_user_ids = _.uniq(from_user_ids, 'id')
            this.getUsersInfosFromArticlePosts(uniq_from_user_ids)
          }
        } catch (err) {
          window.alert(err)
        }
        this.listLoading = false
      },
      async getUsersInfosFromArticlePosts (ids) {
        try {
          if (ids && ids.length) {
            let url = '/admin//user/user-info-map?field=_id'
            url = url + '&' + qs.stringify({ values: ids}, { arrayFormat: 'brackets' })
            url = url + '&projection=avatar fullname'
            let result = await api.getUsersInfos({url: url})
            _.map(this.list, function(article) {
              if (result[article.userId] && result[article.userId].fullname) {
                article.fullname = result[article.userId].fullname
              }
              if (result[article.userId] && result[article.userId].avatar) {
                article.userAvatar = result[article.userId].avatar
              }
              return article
            })
          }
        } catch (err) {
          window.alert(err)
        }
      },

      handleFilter () {
        this.getArticlePost()
      },
      goToPostDetail (row) {
        window.open(`http://m${ENV}.xinshengdaxue.com/post_detail.html?post_id=${row.id}`)
      },
      handleClose (tag) {
        let index = _.findIndex(this.userModels, function(usr) { return usr.id == tag.id })
        if (index > -1) {
          this.userModels.splice(index, 1)
        }
      },
      delPostAlert (row) {
        this.delRow = row
        this.selectedReason = ''
        this.delReason = ''
        this.isDelPost = true
        this.getReasonData()
      },
      handleCloseDel () {
        this.delRow = null
        this.isDelPost = false
      },
      async deletePost () {
        if (!this.checkRemark()) {
          return
        }
        try {
          let result = await api.postDeletePost({post_id: this.delRow.id})
          if (result === 1) {
            this.$notify.success({
              title: '成功',
              message: '文章贴子已删除',
              duration: 1000
            })
            this.getArticlePost()
            let users = []
            users.push(this.delRow.userId)
            this.pushMessage(users)
            this.isDelPost = false
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async getReasonData() {
        let params = {
          url: 'http://read-pre.xinshengdaxue.com/remark/list'
        }
        try {
          let data = await api.getReasonList(params)
          this.typeOptions = data
        } catch (err) {
          this._notify(err, 0, 2000)
          }
      },
      checkRemark() {
        if (!this.delReason) {
          this._notify('内容不能为空', 0, 2000)
          return false
        }
        if (this.delReason && this.delReason.length > 250) {
          this._notify('内容长度不能超过250', 0, 2000)
          return false
        }
        return true
      },
      async pushMessage (users) {
        let data = {
          app_id: '56c6c309243cb728205a3dff',
          content: this.delReason,
          content_type: 1,
          bot_id: '578dd3ef8951642d0d3d2c67',  // 新生大学团队机器人
          media_type: -1,
          user_ids: users
        }
        // 推送类型 1 个人 2 群 3 全体
        let type = 1
        let params = {
          type,
          data: JSON.stringify({doc: data})
        }
        await api.pushMessage(params)
      },
      _notify (tip, type, time, title = '提示') {
        this.$notify({
          title: title, // 提示标题
          message: tip, // 提示内容
          type: type === 1 ? 'success' : 'warning', // 提醒类型
          duration: time // 自动关闭时间 毫秒
        })
      },
    }
  }
</script>

<style>

  .operateContentContainer {
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