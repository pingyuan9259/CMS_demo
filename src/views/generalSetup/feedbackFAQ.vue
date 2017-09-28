<template>
  <div class="feedbackFaqContainer">
    <el-button class="filter-item" @click="handleCreate" type="primary" icon="plus">添加问题</el-button>

    <el-table style="margin-top: 20px;" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

      <el-table-column align="center" label="标题" min-width="150px">
        <template scope="scope">
          <span class="link-type" @click="showFaqDetail(scope.$index, scope.row)">{{scope.row.title}}</span>

        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="120px">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.type === 1">常见问题</el-tag>
          <el-tag type="gray" v-if="scope.row.type === 2">钱包问题</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权重" width="150px">
        <template scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150px" >
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="editFaq(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="showDelAlert(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 底部分页 -->
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="问题详情" size="small" :visible.sync="faqDetailDialogVisible" @close="cancelUpdateDialog">
      <div class="dialog-title">
        <h4>{{ faqDialogModel.title }}</h4>
        <div v-html="faqDialogModel.content"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateDialog">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from './api'
  import _ from 'lodash'
  export default {
    data () {
      return {
        faqDialogModel: { id: '', type: '', title: '', content: '', weight: '' },
        faqDetailDialogVisible: false,
        tableKey: 7,
        listLoading: false,
        list: [],
        total: 0,
        currentPage: 1,
        listQuery: {
          limit: 20,
        }
      }
    },
    created () {
      this.getFeedbackFaqList()
    },
    methods: {
      queryURL () {
        let url = '/admin/problem?offset=' + (this.currentPage - 1) * this.listQuery.limit + '&limit=' + this.listQuery.limit + '&options=' + JSON.stringify({_status: 1})
        return url
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getFeedbackFaqList()
      },
      handleCurrentOffsetChange(val) {
        this.currentPage = val
        this.getFeedbackFaqList()
      },
      handleFilter () {
        this.getFeedbackFaqList()
      },
      async getFeedbackFaqList () {
        this.listLoading = true
        try {
          let result = await api.getFeedbackFaqs({url: this.queryURL()})
          if (result && result.rows && result.rows.length) {
            this.total = result.total
            this.list = result.rows
            this.$store.dispatch('getFeedbackFaqs', this.list)
          } else {
            this.notifyErr('接口出错了')
            this.list = []
          }
        } catch (err) {
          window.alert(err)
        }
        this.listLoading = false
      },
      showFaqDetail (index, row) {
        if (row.id) {
          this.faqDialogModel = row
          this.faqDetailDialogVisible = true
        }
      },
      cancelUpdateDialog () {
        this.faqDetailDialogVisible = false
        this.faqDialogModel = { id: '', type: '', title: '', content: '', weight: '' }
      },
      showUpdateDialog (index, row) {
        if (row.id) {
          this.faqDetailDialogVisible = true
        }
      },
      handleCreate () {
        this.$router.push({ path: 'createFeedbackFaq' })
      },
      editFaq (index, row) {
        localStorage.setItem(`feedbackFaq${row.id}`, JSON.stringify(row))
        this.$router.push({ path: './editFeedbackFaq', query: { id: row.id }})
      },
      showDelAlert (index, row) {
        if (row && row.id) {
          this.$confirm('将删除这道问题, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteFaq(row.id)
          }).catch(() => {
          });
        }
      },
      async deleteFaq (id) {
        this.listLoading = true
        try {
          let result = await api.deleteFeedbackFaq({common_problem_id: id})
          if (result === 1 || result === true) {
            this.notifySuccess('问题已删除')
            let index = _.findIndex(this.list, function(faq) { return faq.id == id })
            if (index > -1) {
              this.list.splice(index, 1)
              this.total -= 1
            }
          }
        } catch (err) {
          window.alert(err)
        }
        this.listLoading = false
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
  .feedbackFaqContainer {
    margin: 20px auto;
    width: 90%;
  }
  .cell .el-tag {
    margin-right: 0;
    margin-top: 0;
  }
</style>