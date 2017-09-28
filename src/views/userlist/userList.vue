<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button class="filter-item" @click="changeTable" type="primary">所有用户</el-button>
        <el-button class="filter-item" @click="changeTable($event, 'no')" type="primary">未审核</el-button>
        <el-button class="filter-item" @click="changeTable($event, 'nopass')" type="primary">实名未通过</el-button>
      </el-button-group>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或手机号" v-model="listQuery.search" icon="search">
      </el-input>

      <el-date-picker @change="handleFilter($event, true)" v-model="dateRange" class="filter-item" type="daterange" align="right" placeholder="选择日期范围" :picker-options="dateOptions">
      </el-date-picker>

      <!-- <el-button v-if="!showRealInfo" class="filter-item" type="primary" icon="document" @click="handleDownload">导出Excel</el-button> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="姓名" min-width="100px">
        <template scope="scope">
          <span class="link-type" @click="showUserDetail(scope.row)">{{scope.row.fullname}}</span>
          <span v-if="showRealInfo" class="link-type" @click="showUserDetail(scope.row)">{{scope.row.real_name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机" min-width="150px">
        <template scope="scope">
          <span v-if="!showRealInfo && !scope.row.user_id">{{scope.row.phone ? scope.row.phone : '-'}}</span>
          <span v-else>{{scope.row.user_id && scope.row.user_id.phone || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" min-width="150px">
        <template scope="scope">
          <span v-if="!showRealInfo && !scope.row.user_id">{{scope.row.email ? scope.row.email : '-'}}</span>
          <span v-else>{{scope.row.user_id && scope.row.user_id.email || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台标签" min-width="150px">
        <template scope="scope">
          <span v-if="scope.row.labels && scope.row.labels[0]" :style="{backgroundColor: scope.row.labels[0].color}" class="label-box">{{scope.row.labels[0].name}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实名状态" min-width="100px">
        <template scope="scope">
          <!-- <el-tag v-if="scope.row.verify_info" :type="scope.row.verify_info._status | statusFilter">{{scope.row.verify_info._status | statusTagName}}</el-tag> -->
          <el-tag v-if="scope.row.verify_status === 1" type="success">已实名</el-tag>
          <el-tag v-else-if="scope.row.verify_status === -1" type="danger">未实名</el-tag>
          <el-tag v-else-if="scope.row.verify_status === 2" type="gray">审核中</el-tag>
          <el-tag v-else-if="showRealInfo" :type="scope.row._status | statusFilter">{{scope.row._status === 1 ? '已实名' : '未实名'}}</el-tag>
          <el-tag v-else :type="9 | statusFilter">未实名</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否会员" min-width="100px">
        <template scope="scope">
          <el-tag v-if="!showRealInfo" :type="scope.row.is_member | statusFilter">{{scope.row.is_member === 1 ? '是' : '否'}}</el-tag>
          <el-tag v-if="showRealInfo && scope.row.user_id" :type="scope.row.user_id.is_member | statusFilter">{{scope.row.user_id && scope.row.user_id.is_member === 1 ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="注册时间">
        <template scope="scope">
          <span>{{scope.row.created_at | formatTimeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="实名提交时间">
        <template scope="scope">
          <span v-if="scope.row.verify_info">{{scope.row.verify_info.created_at | formatTimeFilter}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="认证方式">
        <template scope="scope">
          <span v-if="scope.row.verify_info">{{scope.row.verify_info.ali_biz_no ? '支付宝' : 'APP'}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="300px" fixed="right">
        <template scope="scope">
          <el-button v-if="scope.row.verify_info || scope.row.real_name" size="small" type="primary" @click="handleModifyStatus(scope.row)">审核资料</el-button>
          <el-button v-else size="small" type="gray">暂无资料</el-button>
          <el-button v-if="!scope.row.real_name" size="small" type="info" @click="updateUserTag(scope.row)">添加标签</el-button>
          <el-button v-if="!scope.row.real_name" size="small" type="danger" @click="delUserTag(scope.row)">删除标签</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="实名资料审核" :visible.sync="userVerifyVisible" size="small" top="10%">
      <auth :verify-info="verifyInfo"></auth>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userVerifyVisible = false">取 消</el-button>
        <el-button type="danger" @click="authResult(false)">拒 绝</el-button>
        <el-button type="primary" @click="authResult(true)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户详细信息" :visible.sync="userDetailVisible" size="small">
      <div class="user-info" v-if="userInfo">
        <div class="pic">
          <img :src="userInfo.avatar || '//o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
        </div>
        <div class="info">
          <p>姓名：{{userInfo.fullname}}</p>
          <p>手机：{{userInfo.phone ? userInfo.phone : '用户未填写'}}</p>
          <p>用户ID：{{userInfo.id}}</p>
          <p>新生号：{{userInfo.username}}</p>
          <p>是否会员：{{userInfo.is_member === 1 ? '是' : '否'}}</p>
        </div>
      </div>
      <span class="verify">
        <el-button v-if="!userInfo.verify_info && userInfo.verify_status !== 1" type="success" @click="updateVerify(userInfo.id, true)">通过实名</el-button>
        <el-button v-else type="danger" @click="updateVerify(userInfo.id, false)">取消实名</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userDetailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户标签" :visible.sync="userLabelVisible" size="small" top="10%">
      <el-select class="user-labels" v-model="userLabels" multiple filterable placeholder="请选择">
        <el-option
          v-for="(item, key) in labelOptions"
          :key="key"
          :label="item.name"
          :value="key">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userLabelVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserLabel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除用户标签" :visible.sync="delLabelVisible" size="small" top="10%">
      <el-radio-group v-model="delLabelId">
        <template v-for="item in userInfo.labels">
          <el-radio :label="item._id">{{item.name}}</el-radio>
        </template>
      </el-radio-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="delLabelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUserLabel">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
    import { parseTime, dateFormat } from 'utils'
    import Cookies from 'js-cookie'
    import Request from 'utils/request'
    import { APP_TOKEN_KEY } from 'config/app'
    import Auth from './auth.vue'
    import api from './api'

    export default {
      name: 'user-list',
      components: { Auth },
      data() {
        return {
          url: '',
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            search_fields: '["phone", "fullname", "email", "username", "real_name"]',
            search: '',
            start: '',
            end: '',
            status: 1
          },
          dateOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          dateRange: '',
          userInfo: {},
          userDetailVisible: false,
          userVerifyVisible: false,
          userLabelVisible: false,
          delLabelVisible: false,
          showRealInfo: false,
          tableKey: 0,
          verifyId: '',
          verifyInfo: {},
          userId: '',
          labelOptions: [],
          userLabels: [],
          maxLabelNumber: 1, // 用户最大标签数
          delLabelId: ''
        }
      },
      created () {
        this.url = '/admin/user/data-table'
        this.getList()
      },
      filters: {
        statusFilter (status) {
          const statusMap = {
            9: 'gray',
            '-1': 'danger',
            0: 'danger',
            1: 'success'
          };
          return statusMap[status]
        },
        statusTagName (status) {
          let result = ''
          switch (status) {
            case -1:
              result = '审核中'
              break;
            case 0:
              result = '未通过'
              break;
            case 1:
              result = '已通过'
              break;
            default:
              break;
          }
          return result
        },
        formatTimeFilter (string) {
          if (!string || !string.length) { return '-'}
          return parseTime(new Date(string), '{y}-{m}-{d}')
        }
      },
      methods: {
        async getList() {
          let query = this.listQuery
          let searchDate = ''
          if (query.start) {
            searchDate = JSON.stringify({created_at: {start: query.start, end: query.end}})
          } else {
            this.dateRange = ''
          }
          let params = {
            url: this.url,
            data: {
              offset: (query.page - 1) * query.limit,
              limit: query.limit,
              search_fields: query.search_fields,
              search: query.search,
              options: JSON.stringify({_status: query.status, type: {$ne: -999}}),
              searchByDate: searchDate
            }
          }
          try {
            this.listLoading = true
            this.list = []
            let result = await api.getList(params)
            this.listLoading = false
            this.list = result.rows
            this.total = result.total
            this.resetQuery()
          } catch (err) {
            this.listLoading = true
            this._notify(err, 0, 2000)
          }
        },
        handleFilter(e, time) {
          if (time) {
            this.listQuery.start = dateFormat(this.dateRange[0], 'yyyy-MM-dd')
            this.listQuery.end = dateFormat(this.dateRange[1], 'yyyy-MM-dd')
          }
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
        handleModifyStatus(row) {
          if (row.verify_info && row.verify_info.id) {
            this.verifyInfo = row.verify_info
            this.verifyId = row.verify_info.id
          } else if (row && row.id) {
            this.verifyInfo = row
            this.verifyId = row.id
          }
          this.userVerifyVisible = true
        },
        async authResult (result) {
          let status = result ? 1 : 0
          try {
            let result = await api.authResult(this.verifyId, status)
            if (result) {
              this.userVerifyVisible = false
              this._notify('操作成功', 1, 2000)
              this.getList()
            }
          } catch (err) {
            if (typeof err === 'string' && err.includes('repeated')) {
              this._notify('请勿重复提交', 0, 2000)
              return
            }
            this._notify(err, 0, 2000)
          }
        },
        async showUserDetail(row) {
          let id = row.user_id ? row.user_id._id : row.id
          try {
            let params = {
              url: '/admin/user/user-info',
              data: {
                id: id
              }
            }
            this.userInfo = await api.userDetail(params)
            if (this.userInfo) {
              this.userDetailVisible = true
            }
          } catch (err) {
            this._notify(err, 0, 2000)
          }
        },
        handleDownload() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['姓名', '新生号', '手机', '邮箱', '实名状态', '是否会员', '注册时间'];
            const filterVal = ['fullname', 'username', 'phone', 'email', 'is_verify', 'is_member', 'created_at'];
            const data = this.formatJson(filterVal, this.list);
            export_json_to_excel(tHeader, data, 'table数据');
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'created_at') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
        changeTable (e, isVerify) {
          this.listQuery.page = 1
          this.listQuery.limit = 20
          this.tableKey += 1
          this.showRealInfo = isVerify ? true : false
          this.url = isVerify ? '/admin/user/real-name/dataTable' : '/admin/user/data-table'
          this.listQuery.status = isVerify === 'no' ? -1 : (isVerify === 'nopass' ? 0 : 1)
          this.getList()
        },
        resetQuery () {
          this.listQuery.search = ''
          this.listQuery.start = ''
          this.listQuery.end = ''
        },
        async updateVerify (id, isVerify) {
          let status = isVerify ? 1 : -1
          try {
            let result = await api.updateVerify(id, status)
            if (result) {
              this._notify(status === 1 ? '通过实名' : '取消实名', 1, 2000)
              this.userDetailVisible = false
              this.getList()
            }
          } catch (err) {
            this._notify(err, 0, 2000)
          }
        },
        updateUserTag (row) {
          this.userId = row.id
          this.userLabels = []
          this.userLabelVisible = true
          this.getLabelList()
          this.getMaxLabel()
        },
        async getMaxLabel () {
          let params = {
            url: '/v4/config/maxuserlabels'
          }
          try {
            let result = await api.getMaxLabel(params)
            this.maxLabelNumber = result.max_user_labels
          } catch (err) {
            this._notify(err, 0, 2000)
          }
        },
        async updateUserLabel () {
          let arr = []
          this.userLabels.map((a) => {
            arr.push(this.labelOptions[a])
          })
          if (arr.length > this.maxLabelNumber) {
            this._notify(`用户最多可设置${this.maxLabelNumber}个标签`, 0, 2000)
            return
          }
          let params = {
            url: '/v4/user/' + this.userId + '/labels',
            data: {
              labels: arr
            }
          }
          try {
            let result = await api.updateUserLabel(params)
            this._notify('更新成功', 1, 2000)
            this.userLabelVisible = false
            this.getList()
          } catch (err) {
            this._notify(err, 0, 2000)
          }
        },
        delUserTag (row) {
          this.userInfo = row
          this.userId = row.id
          this.delLabelVisible = true
        },
        async delUserLabel (row) {
          if (!this.delLabelId) {
            this._notify('用户没有可以删除的标签', 0, 2000)
            return
          }
          let params = {
            url: '/v4/user/' + this.userId + '/labels/' + this.delLabelId
          }
          try {
            let result = await api.delUserLabel(params)
            this._notify('更新成功', 1, 2000)
            this.delLabelVisible = false
            this.getList()
          } catch (err) {
            this._notify(err, 0, 2000)
          }
        },
        async getLabelList () {
          let params = {
            url: '/v4/labels'
          }
          try {
            let data = await api.getLabelList(params)
            this.labelOptions = data.result
          } catch (err) {
            this.listLoading = true
            this._notify(err, 0, 2000)
          }
        },
        _notify (tip, type, time, title = '提示') {
          this.$notify({
            title: title, // 提示标题
            message: tip, // 提示内容
            type: type === 1 ? 'success' : 'warning', // 提醒类型
            duration: time // 自动关闭时间 毫秒
          })
        }
      }
    }
</script>
<style>
  .user-info {
    height: 200px;
    position: relative;
  }
  .pic {
    width: 220px;
    height: 220px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .pic img {
    width: 100%;
  }
  .info {
    position: absolute;
    top: 20px;
    left: 250px;
  }
  .el-tag {
    margin-top: 0px;
    margin-right: 0px;
  }
  .cell .el-tag {
    margin-right: 0px;
  }
  .verify {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }
  .label-box {
    display: block;
  }
  .user-labels {
    width: 100%;
  }
</style>
