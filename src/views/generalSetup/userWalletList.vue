<template>
  <div class="updateWalletContainer">

    <!-- <el-button style="margin-left: 0;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

    <div style="margin: 20px 0;">
      <!-- <el-tag
        style="margin-top: 15px; margin-right: 10px;"
        :key="tag.id"
        type="primary"
        v-for="tag in userModels"
        :closable="true"
        :close-transition="false"
        @close="handleClose(tag)"
      >
      {{tag.fullname}}
      </el-tag> -->
        <user></user>
    </div>
    <h4>钱包余额、新生币余额单位均为元</h4>
    <el-table style="margin-top: 20px;" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column align="center" label="钱包 ID" width="100px">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户姓名" min-width="150px">
        <template scope="scope">
          <span>{{scope.row.fullname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户头像" width="100px">
        <template scope="scope">
          <div class="img-wrapper">
            <img style="max-width: 100%; max-height: 100%; border-radius: 6px;" :src="scope.row.userAvatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="right" label="新生币余额" width="150px">
        <template scope="scope">
          <span>{{ scope.row.newbornBalance | toFixed2 }}</span>
        </template>
      </el-table-column>

        <el-table-column align="center" label="操作" min-width="250px" >
          <template scope="scope">
            <el-button size="small" type="danger" @click="showUpdateDialog(scope.$index, scope.row)">修改余额</el-button>
            <router-link :to="{ path: 'record', query: { userId:  scope.row.userId, userName: scope.row.fullname }}">
              <el-button size="small" type="info">查看记录</el-button>
            </router-link>
          </template>
        </el-table-column>

    </el-table>

    <!-- 底部分页 -->
    <!-- <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog title="修改新生币余额" size="small" :visible.sync="updateWalletDialogVisible" @close="cancelUpdateDialog">
      <span>当前新生币余额：{{computedBalance}}，单位：元</span><br>
      <span>变动方式：</span>
      <el-radio-group style="margin:20px 0;" v-model="tempWalletModel.chargeType">
        <el-radio-button label="1">添加新生币</el-radio-button>
        <el-radio-button label="-1">扣除新生币</el-radio-button>
      </el-radio-group><br>
      <span v-if="+tempWalletModel.chargeType === 1" style="color:green;">增加金额：</span><span v-if="+tempWalletModel.chargeType === -1" style="color:red;">扣除金额：</span><br>
      <el-input style="margin: 10px 0;" v-model="tempWalletModel.amount" type="number" step="any" placeholder="请输入要改动的数额"></el-input><br>
      <span>备&nbsp;注：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:#b0b0b0;">限制20字，用户将在提醒中看到备注说明</span><br>
      <el-input style="margin: 10px 0;" v-model="tempWalletModel.remark" type="text" placeholder="限制20字，用户将在提醒中看到备注说明"></el-input><br>
      <span>变动说明：</span><span style="color:#b0b0b0;">限制50字，仅运营可看</span><br>
      <el-input style="margin: 10px 0;" v-model="tempWalletModel.description" type="text" placeholder="限制50字，仅运营可看"></el-input><br>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateDialog">取 消</el-button>
        <el-button type="info" @click="sendBtnClicked">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import user from 'components/SearchUser/index'
  import { mapGetters } from 'vuex'
  import api from './api'
  import _ from 'lodash'
  import qs from 'qs'

  import { APP_ENV } from 'config/app'
  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV
  export default {
    data () {
      return {
        tempWalletModel: {
          amount: '',
          chargeType: 1,
          remark: '',
          description: '',
          created_by: ''
        },
        computedBalance: 0,
        updateWalletDialogVisible: false,
        cancelWalletMsgDialog: false,
        walletIdToUpdate: '',
        userModel: undefined,
        tableKey: 6,
        listLoading: false,
        list: [],
        total: 0,
        currentPage: 1,
        userModels: [],
        listQuery: {
          limit: 20,
        }
      }
    },
    components: { user },
    computed: {
      ...mapGetters([
        'choose',
        'name'
      ])
    },
    filters: {
      toFixed2 (val) {
        return (val / 100 ).toFixed(2)
      }
    },
    watch: {
      choose (val) {
        if (val.id && val.fullname) {
          this.userModels.splice(0, this.userModels.length, val)
          this.handleFilter()
        }
      }
    },
    methods: {
      resetUserModels () {
        this.userModels = []
      },
      handleClose (tag) {
        this.resetUserModels()
      },
      queryURL () {
        let url = '/admin/wallet/list-wallet?page=' + this.currentPage + '&limit=' + this.listQuery.limit
        if (this.userModels.length) {
          let user = this.userModels[0]
          if (user.id) {
            url = url + '&user_id=' + user.id
          }
        }
        return url
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getWalletList()
      },
      handleCurrentOffsetChange(val) {
        this.currentPage = val
        this.getWalletList()
      },
      handleFilter () {
        this.getWalletList()
      },
      async getWalletList () {
        this.listLoading = true
        try {
          let result = await api.getWalletList({url: this.queryURL()})
          this.listLoading = false
          if (result && result.rows && result.rows.length) {
            this.total = result.total
            this.list = result.rows.map((item) => { item.fullname = ''; item.userAvatar = ''; return item; })
            let from_user_ids = _.map(this.list, function(item) { return item.userId })
            let uniq_from_user_ids = _.uniq(from_user_ids, 'id')
            this.getUsersInfos(uniq_from_user_ids)
          } else {
            this.notifyNotFoundWallet()
            this.resetUserModels()
            this.list = []
          }
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      async getUsersInfos (ids) {
        try {
          let result = await api.getUsersInfos(ids)

          _.map(this.list, function(item) {
            if (result[item.userId] && result[item.userId].fullname) {
              item.fullname = result[item.userId].fullname
            }
            if (result[item.userId] && result[item.userId].avatar) {
              item.userAvatar = result[item.userId].avatar
            }
            return item
          })
        } catch (err) {
          window.alert(err)
        }
      },
      cancelUpdateDialog () {
        this.updateWalletDialogVisible = false
        this.walletIdToUpdate = ''
        this.tempWalletModel = { 
          amount: '',
          chargeType: 1,
          remark: '',
          description: '',
          created_by: ''
        }
      },
      showUpdateDialog (index, row) {
        if (row.id) {
          this.updateWalletDialogVisible = true
          this.walletIdToUpdate = row.id
          this.computedBalance = (row.newbornBalance / 100).toFixed(2) || 0
        }
      },
      isValidNum (val) {
        let str = '' + val
        let arr = str.split('.')
        if (arr && arr.length > 1 && arr[1].length > 2) {
          return false
        }
        return true
      },
      sendBtnClicked () {
        if (!this.isValidNum(this.tempWalletModel.amount) || this.tempWalletModel.amount === '' || this.tempWalletModel.amount < 0) {
          this.notifyErr('请输入正确的新生币金额')
          return
        } else if (!this.tempWalletModel.remark) {
          this.notifyErr('请填写备注')
          return
        } else if (!this.tempWalletModel.description) {
          this.notifyErr('请填写说明')
          return
        }
        this.updateWalletNewbornBalance()
      },
      async updateWalletNewbornBalance () {
        try {
          if (this.walletIdToUpdate === '' || !this.walletIdToUpdate) {
            return
          }
          if (+this.changeType === 1 && this.tempWalletModel.amount > 999999) {
            this.notifyErr('赠送的太多了～')
            return
          }
          if (+this.changeType === -1 && this.tempWalletModel.amount > this.computedBalance) {
            this.notifyErr('用户没有这么多币～')
            return
          }
          let params = {
            url: `/admin/wallet/${this.walletIdToUpdate}`,
            data: qs.stringify({
              user_id: this.userModels[0].id,
              charge_type: this.tempWalletModel.chargeType,
              amount: this.tempWalletModel.amount * 100,
              remark: this.tempWalletModel.remark,
              description: this.tempWalletModel.description,
              created_by: this.name
            }, { arrayFormat: 'brackets' })
          }
          let result = await api.postUpdateWallet(params)
          if (result === 1) {
            this.notifySuccess('修改新生币余额成功')
            this.updateRow()
          } else {
            this.notifyErr('失败了～')
          }
        } catch (err) {
          this.notifyErr(err)
        }
        this.cancelUpdateDialog()
      },
      updateRow () {
        this.getWalletList()
      },
      notifyNotFoundWallet() {
        this.$notify.info({
          title: '提示',
          message: '暂未找到用户的钱包信息',
          duration: 2000
        })
      },
      notifySuccess(msg='成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        })
      },
      notifyErr(msg='出错了') {
        this.$notify.error({
          title: '出错了',
          message: msg,
          duration: 1000
        })
      }
    }
  }

</script>

<style>
  .updateWalletContainer {
    margin: 20px auto;
    width: 80%;
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