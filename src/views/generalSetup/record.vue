<template>
	<div class="record-page">
    <h4 style="margin-top:0;">筛选条件：</h4>
    <span>交易单号：</span>
    <el-input style="width: 200px;" class="filter-item" placeholder="交易单号" v-model="listQuery.order_id"></el-input>
    <span>变动说明：</span>
    <el-input style="width: 200px;" class="filter-item" placeholder="变动说明" v-model="listQuery.description"></el-input>
    <span>变动金额：</span>
    <el-input style="width: 200px;" class="filter-item" placeholder="变动金额" v-model="listQuery.amount"></el-input><br>
    <span>商品名称：</span>
    <el-input style="width: 200px;margin-top:10px;" class="filter-item" placeholder="商品名称" v-model="listQuery.name"></el-input>
    <span>交易类型：</span>
    <el-select style="width: 200px;margin-top:10px;" v-model="listQuery.type" clearable placeholder="请选择">
      <el-option
        v-for="item in typeOptions"
        :label="item.label"
        :key="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <span>&nbsp;&nbsp;&nbsp;备&nbsp;注：&nbsp;&nbsp;&nbsp;</span>
    <el-input style="width: 200px;margin-top:10px;" class="filter-item" placeholder="备注" v-model="listQuery.remark"></el-input><br>
    <span>经&nbsp;&nbsp;办&nbsp;&nbsp;方：</span>
    <el-input style="width: 200px;margin-top:10px;" class="filter-item" placeholder="经办方" v-model="listQuery.createdBy"></el-input>
    <span>交易时间：</span>
    <el-date-picker style="width: 200px;margin-top:10px;" v-model="dateRange" class="filter-item" type="daterange" align="right" placeholder="选择日期范围" :clearable="false">
    </el-date-picker>
    <el-button type="primary" @click="getRecords" icon="search">查询</el-button>
    <el-button type="primary" @click="resetFilter" icon="setting">重置筛选条件</el-button>
    <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出CSV</el-button>

    <el-table style="margin-top: 20px;" :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column align="center" label="交易单号" min-width="160px">
        <template scope="scope">
          <span>{{scope.row.orderId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="接受方" min-width="60px">
        <template scope="scope">
          <span>{{userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="变动金额" min-width="70px">
        <template scope="scope">
          <span>{{scope.row.amount / 100}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品名称" min-width="100px">
        <template scope="scope">
          <span>{{scope.row.name && scope.row.name.length > 15 ? scope.row.name.slice(0, 15) + '...' : scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易类型">
        <template scope="scope">
          <span>{{scope.row.type | tradeType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.remark || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="变动说明">
        <template scope="scope">
          <span>{{scope.row.description || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经办方">
        <template scope="scope">
          <span>{{scope.row.createdBy || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130px" align="center" label="交易时间">
        <template scope="scope">
          <span>{{scope.row.createdAt | dateFormat}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { param2Obj } from 'utils/'
  import moment from 'moment'
  import api from './api'

  export default {
    name: 'record-page',
    data () {
      return {
        userId: '',
        userName: '', 
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          order_id: '',
          description: '',
          amount: '',
          name: '',
          type: '',
          remark: '',
          createdBy: ''
        },
        dateRange: [],
        downloadList: [],
        typeOptions: [{
          value: 1,
          label: '充值余额'
        }, {
          value: 2,
          label: '购买课程'
        }, {
          value: 3,
          label: '购买会员'
        }, {
          value: 4,
          label: '续费会员'
        }, {
          value: 5,
          label: '购买会员送余额'
        }, {
          value: 6,
            label: '续费会员送余额'
        }, {
          value: 7,
          label: '获赠余额'
        }, {
          value: 8,
          label: '扣除余额'
        }, {
          value: 9,
          label: '获赠余额'
        }]
      }
    },
    filters: {
      dateFormat (value, format) {
        if (!value) { return }
        return moment(value).format('YYYY-MM-DD HH:mm')
      },
      tradeType (value) {
        if (!value) { return }
        switch (value) {
          case 1:
            return '充值余额'
          case 2:
            return '购买课程'
          case 3:
            return '购买会员'
          case 4:
            return '续费会员'
          case 5:
            return '购买会员送余额'
          case 6:
            return '续费会员送余额'
          case 7:
            return '获赠余额'
          case 8:
            return '扣除余额'
          case 9:
            return '获赠余额'
          default:
            return '其他类型'
        }
      }
    },
    created () {
      let query = param2Obj(window.location.href)
      this.userId = query.userId
      this.userName = query.userName
      this.getRecords()
    },
    methods: {
      async getRecords () {
        let query = this.listQuery
        let params = {
          url: 'admin/wallet/records',
          data: {
            user_id: this.userId,
            page: query.page,
            limit: query.limit,
            order_id: query.order_id,
            description: query.description,
            amount: query.amount && query.amount * 100,
            name: query.name,
            type: query.type,
            remark: query.remark,
            created_by: query.createdBy
          }
        }
        if (this.dateRange.length > 0) {
          params.data.begin_date = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
          params.data.end_date = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        try {
          let result = await api.getRecords(params)
          if (query.limit === 0) { // 导出数据时取数据用
            this.downloadList = result.rows
          } else {
            this.total = result.total
            this.list = result.rows
          }
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        } 
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getRecords()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getRecords()
      },
      resetFilter () {
        this.listQuery = {
          page: 1,
          limit: 20,
          order_id: '',
          description: '',
          amount: '',
          name: '',
          type: '',
          remark: '',
          createdBy: ''
        }
        this.dateRange = []
      },
      handleDownload() {
        require.ensure([], async () => {
          const { export_json_to_csv } = require('vendor/Export2Excel')
          const tHeader = ['交易单号', '接受方', '变动金额', '商品名称', '交易类型', '备注', '变动说明', '经办方', '交易时间']
          const filterVal = ['orderId', 'userId', 'amount', 'name', 'type', 'remark', 'description', 'createdBy', 'createdAt']
          this.listQuery.limit = 0
          await this.getRecords()
          this.downloadList.map((x) => { // 过滤替换交易类型
            switch (x.type) {
              case 1:
                return x.type = '充值余额'
              case 2:
                return x.type = '购买课程'
              case 3:
                return x.type = '购买会员'
              case 4:
                return x.type = '续费会员'
              case 5:
                return x.type = '购买会员送余额'
              case 6:
                return x.type = '续费会员送余额'
              case 7:
                return x.type = '获赠余额'
              case 8:
                return x.type = '扣除余额'
              case 9:
                return x.type = '获赠余额'
              default:
                return x.type = '其他类型'
            }
          })
          this.downloadList.map((y) => y.amount = y.amount / 100) // 过滤替换金额
          this.downloadList.map((z) => z.createdAt = moment(z.createdAt).format('YYYY-MM-DD HH:mm:ss')) // 过滤替换时间
          const data = this.formatJson(filterVal, this.downloadList)
          export_json_to_csv(tHeader, data, 'table数据') 
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
      chargeType () {

      }
    }
  }
</script>
<style>
  .record-page {
    padding: 20px;
  }  
</style>
