<template>
  <div class="components-container" style='height:100vh'>
    <div>
      <h4>操作前请先阅读</h4>
      <el-card class="box-card">
        <div>
          <p>1. 添加充值的定价时，需要IOS提供一个ios product id。该值是通过向苹果申请后获得的。（IOS的开发知道这些值）</p>
          <p>2. 充值金额换算成新生币的比例不能通过输入的方式修改，如果需要修改，请联系CMS的开发。</p>
          <p>3. 已有的充值段位不能更新，如果填错了请删除再重新输入。这样做的目的是保证ios product id对应的值是正确的，避免修改时发生对不上的情况。</p>
          <p>4. 所有值都为整数。</p>
          <p>5. 目前，不支持调整顺序。如果想要正确的顺序，请按顺序录入。如果顺序真的乱了，那么全部删除重新来一次吧。</p>
        </div>
      </el-card>
    </div>

    <el-col :span="24">
      <h4>充值段</h4>
      <el-table
        :data="prices">
        <el-table-column
          type="index"
          prop="ios"
          label="操作"
          align="center"
          width="160">
          <template scope="scope">
            <el-button type="danger" icon="delete" size="mini" @click="deletePrice(scope)"></el-button>
            <el-button type="primary" icon="edit" size="mini" @click="showEditDialog(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="非IOS价格"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="iosPrice"
          label="IOS价格"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="newbornNum"
          label="新生币"
          align="right"
          width="80">
        </el-table-column>
        <el-table-column
          prop="iosProductId"
          label="IOS产品ID">
        </el-table-column>
      </el-table>
    </el-col>

    <el-col :span="24">
      <h4>录入新的充值段</h4>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="非IOS充值金额">
            <el-input v-model.number="form.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="IOS充值金额">
            <el-input v-model.number="form.iosPrice" type="number"></el-input>
          </el-form-item>
          <el-form-item label="IOS的产品ID（从苹果那边获取）">
            <el-input v-model="form.iosProductId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">创建</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-dialog title="编辑产品定价" :visible.sync="editDialogVisible" @close="cancelEditDialog">
      <el-form ref="formToEdit" :model="formToEdit" label-width="80px" label-position="top">
        <el-form-item label="非 iOS 充值金额">
          <el-input v-model.number="formToEdit.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="iOS 充值金额">
          <el-input v-model.number="formToEdit.iosPrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="新生币">
          <el-input v-model.number="formToEdit.newbornNum" type="number"></el-input>
        </el-form-item>
        <el-form-item label="iOS 的产品 ID（从苹果那边获取）">
          <el-input v-model="formToEdit.iosProductId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditDialog">取 消</el-button>
        <el-button type="primary" @click="updatePrice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import _ from 'lodash'
  import api from './api'
  import { MessageBox } from 'mint-ui'
  export default {
    name: 'rechargeprice',
    data () {
      return {
        prices: [],
        editDialogVisible: false,
        formToEdit: {
          id: '',
          newbornNum: 0,
          price: 0,
          iosPrice: 0,
          iosProductId: 0
        },
        form: {
          newbornNum: 0,
          price: 0,
          iosPrice: 0,
          iosProductId: 0
        }
      }
    },
    async created () {
      try {
        this.prices = await api.getPrices()
      } catch (err) {
        window.alert(err)
      }
    },
    methods: {
      async deletePrice (scope) {
        try {
          let result = await this.showConfirm('确认删除吗？')
          if (result === 0) {
            return
          }
          let resp = await api.deletePrice(scope.row)
          if (resp) {
            let index = _.findIndex(this.prices, function(item) {
              return item.id === scope.row.id
            })
            if (index > -1) {
              this.prices.splice(index, 1)
            }
          } else {
            this.notifyFailedSubmit('删除出错了')
          }

        } catch (err) {
          window.alert(err)
        }
      },
      cancelEditDialog () {
        this.editDialogVisible = false
        this.formToEdit = {
          id: '',
          newbornNum: 0,
          price: 0,
          iosPrice: 0,
          iosProductId: 0
        }
      },
      async updatePrice () {
        if (!this.formToEdit.id || this.formToEdit.id.length < 1) {
          return
        }
        try {
          let result = await api.postUpdatePrice(this.formToEdit)
          if (result) {
            this.notifySuccessSubmit('修改产品定价成功')
          } else {
            this.notifyFailedSubmit()
          }
          this.prices = await api.getPrices()
        } catch (err) {
          window.alert(err)
        }
        this.cancelEditDialog()
      },
      showEditDialog (index, row) {
        if (row.id) {
          this.editDialogVisible = true
          this.formToEdit = _.cloneDeep(row)
        }
      },
      notifySuccessSubmit (msg='成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        })
      },
      notifyFailedSubmit(msg='出错了') {
        this.$notify.error({
          title: '出错了',
          message: msg,
          duration: 1000
        })
      },

      async onSubmit () {
        try {
          let result = await this.showConfirm('确认添加吗？')
          if (result === 0) {
            return
          }
          this.prices = await api.getPrices()
          let data = await api.addPrice({
            newbornNum: this.form.price,
            price: this.form.price,
            iosPrice: this.form.iosPrice,
            iosProductId: this.form.iosProductId})

          data.price = data.price / 100
          data.iosPrice = data.iosPrice / 100
          data.newbornNum = data.newbornNum / 100

          this.prices.push(data)
        } catch (err) {
          window.alert(err)
        }
      },
      async showConfirm(message) {
        // 将MessageBox的处理封装的目的是为了解决一个大坑。
        // MessageBox.confirm本身返回一个promise对象，但是，当用户点击cancel按钮的时候，被MessageBox处理成reject。
        // 这样势必导致我们的业务代码不好处理。所以，通过封装，将MessageBox返回的reject转成resolve。
        // 用1代表success，用0代表cancel。这样业务代码就可以同步的判断。
        try {
          await MessageBox.confirm(message)
          return Promise.resolve(1)
        } catch (err) {
          return Promise.resolve(0)
        }
      }
    }
  }
</script>
