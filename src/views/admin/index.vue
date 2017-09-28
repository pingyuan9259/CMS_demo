<template>
	<div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="createAdmin" type="primary" icon="edit">添加管理员</el-button>
      <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="姓名" width="240">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="权限等级" width="210">
          <template scope="scope">
            <span>{{scope.row.level === 2 ? '管理员' : '内容运营'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="180">
          <template scope="scope">
            <span>{{scope.row._status === 1 ? '正常' : '冻结'}}</span>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="操作">
          <template scope="scope">
            <el-button type="primary" @click='editAdmin(scope.row)' size="small" icon="edit">编辑</el-button>
            <el-button v-if="scope.row._status === 1" type="warning" @click="stopAdmin(scope.row)" size="small" icon="warning">冻结</el-button>
            <el-button v-else type="warning" @click="stopAdmin(scope.row)" size="small" icon="warning">恢复</el-button>
            <el-button type="danger" @click="delAdmin(scope.row)" size="small" icon="close">删除</el-button>
            <el-button type="success" @click='resetAdmin(scope.row)' size="small" icon="setting">重置密码</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="账号">
          <el-input v-model="adminName"></el-input>
        </el-form-item>

        <el-form-item label="密码" v-if="dialogStatus=='create'">
          <el-input v-model="adminPassword"></el-input>
        </el-form-item>

        <el-form-item label="权限">
          <el-select class="filter-item" v-model="adminLevel" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createSubmit">确 定</el-button>
        <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="modifyPassVisible">
      <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="新密码">
          <el-input v-model="newPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from './api'
  export default {
    name: 'admin',
    data () {
      return {
        list: [],
        listLoading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        adminName: '',
        adminPassword: '',
        adminLevel: 3,
        statusOptions: [{label: '管理员', key: 2, value: 2}, {label: '内容运营', key: 3, value: 3}],
        editId: '',       // 当前要修改的admin的id
        modifyPassVisible: false,
        newPassword: ''
      }
    },
    async created () {
      this.listLoading = true

      try {
        this.list = await api.adminList()
      } catch (err) {
        this.$notify({
          title: '提示',
          message: err,
          type: 'warning',
          duration: 2000
        })
      }

      this.listLoading = false
    },
    methods: {
      createAdmin () {
        // 初始化数据
        this.adminName = ''
        this.adminPassword = ''
        this.adminLevel = 3
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      editAdmin (row) {
        // 继承数据
        this.adminName = row.name
        this.adminPassword = row.password
        this.adminLevel = row.level
        this.editId = row.id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      async stopAdmin (row) {
        let tip = row._status === 1 ? '冻结' : '恢复'
        try {
          let result = await api.stopAdmin(row)
          if (result) {
            this.$notify({
              title: '成功',
              message: `${tip}成功`,
              type: 'success',
              duration: 2000
            })
            // 刷新列表
            this.list = await api.adminList()
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
      resetAdmin (row) {
        this.editId = row.id
        this.modifyPassVisible = true
      },
      async resetPassword () {
        try {
          let result = await api.resetPassword(this.editId, this.newPassword)
          this.modifyPassVisible = false
          if (result) {
            this.$notify({
              title: '成功',
              message: '重置密码成功',
              type: 'success',
              duration: 2000
            })
            // 清空数据
            this.editId = ''
            this.newPassword = ''
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
      async delAdmin (row) {
        try {
          let result = await api.delAdmin(row.id)
          if (result) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            // 刷新列表
            this.list = await api.adminList()
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
      async createSubmit () {
        if (!this.adminName || !this.adminPassword) {
          this.$notify({
            title: '提示',
            message: '用户名或密码不可为空',
            type: 'warning',
            duration: 2000
          })
          return
        }
        if (this.adminPassword.length < 6) {
          this.$notify({
            title: '提示',
            message: '密码最少为6位',
            type: 'warning',
            duration: 2000
          })
          return
        }
        try {
          let result = await api.createAdmin(this.adminName, this.adminPassword, this.adminLevel)
          this.dialogFormVisible = false
          if (result) {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            // 刷新列表
            this.list = await api.adminList()
            // 清空数据
            this.adminName = ''
            this.adminPassword = ''
            this.adminLevel = 3
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
      async updateSubmit () {
        try {
          let result = await api.updateAdmin(this.editId, this.adminName, this.adminLevel)
          if (result) {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            // 刷新列表
            this.list = await api.adminList()
            // 清空数据
            this.adminName = ''
            this.adminLevel = 3
            this.editId = ''
          }
        } catch (err) {
          this.$notify({
            title: '提示',
            message: err,
            type: 'warning',
            duration: 2000
          })
        }
      }
    }
  }
</script>