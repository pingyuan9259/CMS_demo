<template>
  <div>
    <el-button type="primary" icon="plus" @click="dialogFormVisible = true">从列表里搜索</el-button>
    <div>
      <!-- <span v-for="(user, index) in userList">{{ user.id }}</span> -->
    </div>

    <el-table style="margin-top: 10px;" :data="userList" stripe border fit highlight-current-row>

      <el-table-column align="center" label="删除" width="140px">
        <template scope="scope">
          <el-button type="danger" @click='deleteUser(scope.row)' size="small" icon="delete">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="150px">
        <template scope="scope">
          <span class="" @click="showUserDetail(scope.row)">{{scope.row.fullname}}</span>
          <span v-if="showRealInfo" class="link-type" @click="showUserDetail(scope.row)">{{scope.row.real_name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像" width="100px">
        <template scope="scope" style="">
          <div style="width: 60px; height: 60px; overflow:hidden; padding: 5px 0;">
            <img style="width:50px; height:50px; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机" min-width="150px">
        <template scope="scope">
          <span v-if="!showRealInfo && !scope.row.user_id">{{scope.row.phone ? scope.row.phone : '-'}}</span>
          <span v-else>{{scope.row.user_id && scope.row.user_id.phone || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" min-width="200px">
        <template scope="scope">
          <span v-if="!showRealInfo && !scope.row.user_id">{{scope.row.email ? scope.row.email : '-'}}</span>
          <span v-else>{{scope.row.user_id && scope.row.user_id.email || '-'}}</span>
        </template>
      </el-table-column>

<!--       <el-table-column align="center" label="实名状态" width="100px">
        <template scope="scope">
          <el-tag v-if="scope.row.verify_info" :type="scope.row.verify_info._status | statusFilter">{{scope.row.verify_info._status === 1 ? '已通过' : '未通过'}}</el-tag>
          <el-tag v-else-if="showRealInfo" :type="scope.row._status | statusFilter">{{scope.row._status === 1 ? '已实名' : '未实名'}}</el-tag>
          <el-tag v-else :type="9 | statusFilter">未实名</el-tag>
        </template>
      </el-table-column>
 -->
      <!-- <el-table-column align="center" label="是否会员" width="100px">
        <template scope="scope">
          <el-tag v-if="!showRealInfo" :type="scope.row.is_member | statusFilter">{{scope.row.is_member === 1 ? '是' : '否'}}</el-tag>
          <el-tag v-if="showRealInfo && scope.row.user_id" :type="scope.row.user_id.is_member | statusFilter">{{scope.row.user_id && scope.row.user_id.is_member === 1 ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column> -->

    </el-table>


    <el-dialog title="用户列表" :visible.sync="dialogFormVisible" size="small" @close="closeDialog">

      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或手机号" v-model="listQuery.search" icon="search">
        </el-input>
      </div>

      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" stripe border fit highlight-current-row>

        <el-table-column align="center" label="选择" width="120px">
          <template scope="scope">
            <el-button v-if='selectedRowId === scope.row.id' type="success" @click='clickRow(scope.row)' size="small" icon="check">已选择</el-button>
            <el-button v-if='selectedRowId !== scope.row.id' type="primary" @click='clickRow(scope.row)' size="small" icon="edit">未选择</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="姓名" width="120px">
          <template scope="scope">
            <span class="link-type" @click="showUserDetail(scope.row)">{{scope.row.fullname}}</span>
            <span v-if="showRealInfo" class="link-type" @click="showUserDetail(scope.row)">{{scope.row.real_name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="头像" width="100px">
          <template scope="scope" style="">
            <div style="width: 60px; height: 60px; overflow:hidden; padding: 5px 0;">
              <img style="width:50px; height:50px; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
            </div>
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

<!--         <el-table-column align="center" label="实名状态" width="100px">
          <template scope="scope">
            <el-tag v-if="scope.row.verify_info" :type="scope.row.verify_info._status | statusFilter">{{scope.row.verify_info._status === 1 ? '已通过' : '未通过'}}</el-tag>
            <el-tag v-else-if="showRealInfo" :type="scope.row._status | statusFilter">{{scope.row._status === 1 ? '已实名' : '未实名'}}</el-tag>
            <el-tag v-else :type="9 | statusFilter">未实名</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否会员" width="100px">
          <template scope="scope">
            <el-tag v-if="!showRealInfo" :type="scope.row.is_member | statusFilter">{{scope.row.is_member === 1 ? '是' : '否'}}</el-tag>
            <el-tag v-if="showRealInfo && scope.row.user_id" :type="scope.row.user_id.is_member | statusFilter">{{scope.row.user_id && scope.row.user_id.is_member === 1 ? '是' : '否'}}</el-tag>
          </template>
        </el-table-column>
 -->
<!--         <el-table-column width="160px" align="center" label="注册时间">
          <template scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d}~{h}:{m}') }}</span>
          </template>
        </el-table-column> -->
      </el-table>

<!--       <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->

    </el-dialog>
  </div>
</template>

<script>
  import { parseTime, dateFormat } from 'utils';
  import Request from 'utils/request'
  import { APP_TOKEN_KEY } from 'config/app'
  import Cookies from 'js-cookie'
  export default {
    props: {
      userList: {
        type: Array
      }
    },
    data () {
      return {
        selectedRowId: '',
        selectedUser: undefined,
        dialogFormVisible: false,
        url: '',
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          search_fields: '["phone", "fullname", "email", "username"]',
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
        dialogCourseVisible: false,
        showRealInfo: false,
        tableKey: 0,
        actionUid: ''
      }
    },
    created() {
        this.url = '/admin/user/data-table'
        // this.getList();
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          9: 'gray',
          0: 'danger',
          1: 'success'
        };
        return statusMap[status]
      }
    },
    methods: {
      getList() {
        let self = this
        self.listLoading = true
        new Promise((resolve, reject) => {
          let query = self.listQuery
          let searchDate = ''
          if (query.start) {
            searchDate = JSON.stringify({created_at: {start: query.start, end: query.end}})
          } else {
            self.dateRange = ''
          }
          Request.get({
            url: `${self.url}?offset=${(query.page-1)*query.limit}&limit=${query.limit}&search_fields=${query.search_fields}&search=${query.search}&options={"_status":${query.status},"type":{"$ne":-999}}&searchByDate=${searchDate}`,
          }, Cookies.get(APP_TOKEN_KEY)).then(res => {
            self.list = [].concat(res.data.result.rows)
            self.total = res.data.total;
            self.listLoading = false
            self.resetQuery()  // 过滤成功后初始化过滤参数 方便下次过滤
            resolve()
          }).catch(err => {
            reject(error)
          })
        })
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
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        row.status = status;
      },
      showUserDetail(row) {
        let id = row.id
        if (row.user_id) {
          id = row.user_id.id
        }
        let self = this
        self.userInfo = {}
        new Promise((resolve, reject) => {
          Request.get({
            url: '/admin//user/user-info?id=' + id,
          }, Cookies.get(APP_TOKEN_KEY)).then(res => {
            self.userInfo = res.data
            self.userDetailVisible = true
            resolve()
          }).catch(err => {
            reject(error)
          })
        })
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
      courseManagement (row) {
        this.actionUid = row.user_id ? row.user_id.id : row.id
        this.dialogCourseVisible = true
      },
      sureCourse () {
      },
      clickRow (row) {
        if (this.selectedRowId === row.id) {
          // 取消选中
          this.selectedRowId = ''
          this.selectedUser = undefined
        } else {
          this.selectedRowId = row.id
          this.selectedUser = row
        }
      },
      deleteUser (row) {
        this.$emit('deleteUser', row.id)
      },
      closeDialog () {
        if (this.selectedRowId.length) {
          this.$emit('selecteUser', this.selectedUser)
          this.selectedRowId = ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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
</style>