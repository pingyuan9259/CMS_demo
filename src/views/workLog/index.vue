<template>
  <div class="work-log-box">
    <div class="filter-container">
      <el-button class="filter-item" @click="resetQuery" type="primary">所有类型</el-button>
      <el-select clearable class="filter-item" style="width: 130px" @change="handleType" v-model="classVal" placeholder="类型">
        <el-option v-for="item in classOptions" :key="item.key" :label="item.label + ' ' + item.value" :value="item.value">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="getList" style="width: 200px;" class="filter-item" placeholder="搜索" v-model="search" icon="search">
      </el-input>

      <el-date-picker @change="handleTime" v-model="dateRange" class="filter-item" type="daterange" align="right" placeholder="选择日期范围" :picker-options="dateOptions">
      </el-date-picker>

      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出Excel</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="APP" width="150px">
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作方式" width="150px">
        <template scope="scope">
          <span>{{scope.row.methods}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作事件" min-width="260px">
        <template scope="scope">
          <span>{{scope.row.comment}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人员" min-width="180px">
        <template scope="scope">
          <span>{{scope.row.username || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" min-width="180px">
        <template scope="scope">
          <span>{{scope.row.create_at | formatTimeFilter}}</span>
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
  import log from 'utils/log'
  import { parseTime, dateFormat } from 'utils'

  const sortDate = {
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
  }
  const classType = [{label: '增', value: 'create'}, {label: '删', value: 'delete'}, {label: '改', value: 'update'}, {label: '查', value: 'pull'}]
	export default {
    name: 'workLog',
    data () {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          search_fields: '["type", "methods", "username"]'
        },
        search: '',
        dateOptions: sortDate,
        classOptions: classType,
        dateRange: [],
        searchDate: '',
        classVal: '',
        class: ''
      }
    },
    created () {
      this.getList()
    },
    filters: {
      formatTimeFilter (string) {
        if (!string || !string.length) { return '-' }
        return parseTime(new Date(string), '{y}/{m}/{d} {h}:{i}')
      }
    },
    methods: {
      async getList () {
        let query = this.listQuery
        let params = {
          offset: (query.page - 1) * query.limit,
          limit: query.limit,
          sort: 'create_at',
          order: 'desc',
          search_fields: query.search_fields,
          search: this.search,
          options: this.class,
          searchByDate: this.searchDate
        }
        try {
          let result = await log.get(params)
          this.list = result.result.rows
          this.total = result.result.total
          this.listLoading = false
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
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleTime() {
        if (this.dateRange.length > 0) {
          let start = dateFormat(this.dateRange[0], 'yyyy-MM-dd')
          let end = dateFormat(this.dateRange[1], 'yyyy-MM-dd')
          this.searchDate = JSON.stringify({create_at: {start: start, end: end}})
        } else {
          this.searchDate = ''
        }
        this.getList()
      },
      handleType () {
        if (this.classVal) {
          this.class = JSON.stringify({ methods: this.classVal })
        } else {
          this.class = ''
        }
        this.getList()
      },
      resetQuery () {
        this.listQuery = {
          page: 1,
          limit: 20,
          search_fields: '["type", "methods", "username"]',
        }
        this.classVal = ''
        this.class = ''
        this.search = ''
        this.dateRange = []
        this.getList()
      },
      handleDownload () {
      }
    }
  }
</script>
<style>
  .filter-container {
    margin-top: 20px;
    padding-left: 20px;
  }
</style>