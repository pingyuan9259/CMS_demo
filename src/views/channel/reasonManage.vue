
<template>
  <div class="del-reason-manage">
    <el-button class="filter-item add" @click="handleCreate" type="primary" icon="plus">添加理由</el-button>

    <el-table style="margin-top: 20px;"  :data="list" v-loading.body="listLoading" border fit highlight-current-row>

      <el-table-column align="center" label="理由ID" min-width="150px">
        <template scope="scope">
          <span class="link-type">{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签标题" min-width="150px">
        <template scope="scope">
          <span class="link-type">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="理由内容" min-width="120px">
        <template scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150px" >
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="showDelAlert(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 底部分页 -->
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogData.id ? '编辑理由' : '新建理由' " size="small" :visible.sync="detailDialogVisible" @close="detailDialogVisible = false">
      <div class="dialog-title">
        <h4>标 题：</h4>
        <el-input
          class="input-title"
          type="text"
          placeholder="请输入标题"
          v-model="dialogData.title">
        </el-input>
        <h4>编辑理由</h4>
        <el-input
          class="input-reason"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="dialogData.remark">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button v-if="!dialogData.id" type="primary" @click="addSubmitDialog">新 建</el-button>
        <el-button v-else type="primary" @click="submitDialog">更 新</el-button>
        </el-button>
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
      dialogData: {id: '', title: '', remark: ''},
      listLoading: false,
      detailDialogVisible: false,
      list: [],
      total: 0,
      listQuery: {
        limit: 20,
        page: 1
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {  
    async getList () {
      let params = {
        url: 'http://read-pre.xinshengdaxue.com/remark/list' //连接服务器的URL地址
      }
      try {
        this.listLoading = true
        let data = await api.getReasonList(params)
        this.listLoading = false
        this.list = data
        this.total = data.length
      } catch (
        err) {
        this.listLoading = true
        this._notify(err, 0, 2000)
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentOffsetChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.dialogData = {id: '', title: '', remark: ''}
      this.detailDialogVisible = true
    },
    showDelAlert (index, row) {
      if (row && row.id) {
        this.$confirm('将删除这条理由, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFaq(row.id)
        }).catch(() => {
        });
      }
    },
    async deleteFaq (id ) {
        this.listLoading = true
        try {
          let params = {
            url: 'http://read-pre.xinshengdaxue.com/remark/delete',
            data: { id: id}
          }
          let result = await api.deleteReason(params)
          this._notify('删除成功', 1, 2000)
          this.getList()
        } catch (err) {
          window.alert(err)
        }
        this.listLoading = false
      },
    edit (index, row) {
      this.detailDialogVisible = true
      this.dialogData = row
    },
    checkRemark () {
      if (!this.dialogData.remark) {
        this._notify('内容不能为空', 0, 2000)
        return false
      }
      return true
    },
    checkTitle () {
      if (!this.dialogData.title) {
        this._notify('标题不能为空', 0, 2000)
        return false
      }
      return true
    },
    limitTitleLength () {
      if (this.dialogData.title.length > 50) {
        this._notify('标题长度不能大于50', 0, 2000)
        return false
      }
      return true
    },
    limitRemarkLength () {
      if (this.dialogData.remark.length > 200) {
        this._notify('内容长度不能大于200', 0, 2000)
        return false
      }
      return true
    },
    async submitDialog () {
      if (!this.checkRemark() || !this.checkTitle() || 
        !this.limitTitleLength () || !this.limitRemarkLength()) {
        return
      }
      let params = {
        url: 'http://read-pre.xinshengdaxue.com/remark/update', //连接服务器的URL地址
        data: {
          id: this.dialogData.id,
          remark: this.dialogData.remark,
          title: this.dialogData.title 
        }
      }
      try {
        this.listLoading = true
        let data = await api.updateReason(params)
        this.listLoading = false
        this.detailDialogVisible = false
      } catch (err) {
        this.listLoading = true
        this._notify(err, 0, 2000)
      }
    },
    async addSubmitDialog () {
      if (!this.checkRemark() || !this.checkTitle() || 
        !this.limitTitleLength () || !this.limitRemarkLength()) {
        return
      }
      let params = {
        url: 'http://read-pre.xinshengdaxue.com/remark/insert', //连接服务器的URL地址
        
        data: {
          id: this.dialogData.id,
          remark: this.dialogData.remark,
          title: this.dialogData.title 
        }
      }
      try {
        this.listLoading = true
        let data = await api.insertReason(params)
        this.listLoading = false
        this.detailDialogVisible = false
        this.getList()
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
<style type="text/css">
  /*.add {
    margin: 20px;
  }*/
  .del-reason-manage {
    margin: 20px;
  }
  .input-reason {
    margin-top: -15px;
  }
  .input-title {
    margin-top: -15px;

  }
</style>