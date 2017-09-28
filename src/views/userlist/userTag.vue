<template>
	<div class="user-tag">
    <el-button class="filter-item" @click="updateVisible($event)" type="primary">添加新标签</el-button>
    <!-- <el-button class="filter-item" @click="MaxLabelVisible" type="primary">设置标签上限</el-button> -->

    <el-table class="tag-table" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="标签ID" min-width="90px">
        <template scope="scope">
          <span class="link-type">{{scope.row._id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台标签" min-width="90px">
        <template scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签颜色" min-width="90px">
        <template scope="scope">
          <span class="link-type">{{scope.row.color}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="90px">
        <template scope="scope">
          <el-button type="primary" @click="updateVisible($event, scope.row)">编辑</el-button>
          <el-button type="danger" @click="delLabel(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="tagId ? '编辑标签' : '新建标签'" :visible.sync="showUpdateTag" size="small" top="10%">
      <span>标&nbsp;&nbsp;签&nbsp;&nbsp;名：</span>
      <el-input style="width:560px;margin-top:10px" placeholder="请输入标签名" v-model="tagName"></el-input><br>
      <template>
        <span>标签颜色：</span>
        <el-input style="width:500px;" placeholder="请输入十六进制的标签颜色" v-model="tagColor"></el-input>
        <el-color-picker style="margin-top:10px;vertical-align:-6px;" v-model="tagColor"></el-color-picker>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpdateTag = false">取 消</el-button>
        <el-button v-if="!tagId" type="primary" @click="createLabel">新 建</el-button>
        <el-button v-else type="primary" @click="updateLabel">更 新</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置用户标签上限" :visible.sync="showMaxTag" size="small" top="10%">
      <el-input class="filter-item" placeholder="请输入用户最大标签上限" type="Number" v-model="tagNumber"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMaxTag = false">取 消</el-button>
        <el-button type="primary" @click="setMaxLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from './api'
  export default {
    name: 'uaerTag',
    data () {
      return {
        list: [],
        listLoading: false,
        showUpdateTag: false,
        tagId: '',
        tagName: '',
        tagColor: '',
        showMaxTag: false,
        tagNumber: 1
      }
    },
    created () {
      this.getLabelList()
    },
    methods: {
      async getLabelList () {
        let params = {
          url: '/v4/labels'
        }
        try {
          this.listLoading = true
          this.list = []
          let data = await api.getLabelList(params)
          this.listLoading = false
          this.list = data.result
        } catch (err) {
          this.listLoading = true
          this._notify(err, 0, 2000)
        }
      },
      updateVisible (e, row) {
        this.showUpdateTag = true
        if (row) {
          this.tagId = row._id
          this.tagName = row.name
          this.tagColor = row.color
        } else {
          this.tagId = ''
          this.tagName = ''
          this.tagColor = '#000000' // 默认标签颜色
        }
      },
      async createLabel () {
        if (!this.checkName()) {
          this._notify('标签名不可为空或长度大于6', 0, 2000)
          return
        }
        if (!this.checkColor()) {
          this._notify('标签颜色请使用合法的完整十六进制色值', 0, 2000)
          return
        }
        let params = {
          url: '/v4/labels',
          data: {
            name: this.tagName,
            color: this.tagColor
          }
        }
        try {
          let result = await api.createLabel(params)
          this._notify('创建成功', 1, 2000)
          this.showUpdateTag = false
          this.getLabelList()
        } catch (err) {
          this._notify(err, 0, 2000)
        }
      },
      async updateLabel () {
        if (!this.checkName()) {
          this._notify('标签名不可为空或长度大于6', 0, 2000)
          return
        }
        if (!this.checkColor()) {
          this._notify('标签颜色请使用合法的完整十六进制色值', 0, 2000)
          return
        }
        let params = {
          url: '/v4/labels/' + this.tagId,
          data: {
            name: this.tagName,
            color: this.tagColor
          }
        }
        try {
          let result = await api.updateLabel(params)
          this._notify('更新成功', 1, 2000)
          this.showUpdateTag = false
          this.getLabelList()
        } catch (err) {
          this._notify(err, 0, 2000)
        }
      },
      async delLabel (id) {
        let params = {
          url: '/v4/labels/' + id
        }
        try {
          let result = await api.delLabel(params)
          this._notify('删除成功', 1, 2000)
          this.getLabelList()
        } catch (err) {
          this._notify(err, 0, 2000)
        }
      },
      MaxLabelVisible () {
        this.getMaxLabel()
        this.showMaxTag = true
      },
      async getMaxLabel () {
        let params = {
          url: '/v4/config/maxuserlabels'
        }
        try {
          let result = await api.getMaxLabel(params)
          this.tagNumber = result.max_user_labels
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      },
      async setMaxLabel () {
        if (!this.tagNumber || this.tagNumber < 1) {
          this._notify('标签上限不可小于1', 0, 2000)
          return
        }
        let params = {
          url: '/v4/config/maxuserlabels',
          data: {
            max_user_labels: this.tagNumber
          }
        }
        try {
          let result = await api.setMaxLabel(params)
          this._notify('更新成功', 1, 2000)
          this.showMaxTag = false
        } catch (err) {
          this._notify(err, 0, 2000)
        }
      },
      checkName () {
        let len = this.tagName && this.tagName.replace(/[^\x00-\xff]/g, '01').length
        if (!this.tagName || len > 12) {
          return false
        } else {
          return true
        }
      },
      checkColor () {
        if (!this.tagColor || !/^#[0-9a-fA-F]{6}$/.test(this.tagColor)) {
          return false
        } else {
          return true
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
  .user-tag {
    margin: 20px;
  }
  .tag-table {
    margin-top: 20px;
  }
</style>