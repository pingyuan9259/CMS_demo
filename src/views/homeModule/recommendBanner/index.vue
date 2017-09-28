<template>
  <div class="app-container calendar-list-container index-recommend">
    <el-col :span="16" :push="2" class="margin">
      <!-- 顶部搜索、排序 -->
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Bannner 标题" v-model="listQuery.title">
      </el-input>
      <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" style="float: left; margin-right: 20px;" @click="handleCreate" type="primary" icon="plus">添加 Banner</el-button>

    </el-col>

    <el-col :span="16" :push="2" class="margin">

      <el-tabs v-model="activeName">
        <el-tab-pane label="全部" name="first">
          <div v-for="(item, index) in list" >
            <el-col :span="20" class="center">
              <img :src="item.image_url" class="image">
            </el-col>
            <el-col :span="2" class="margin">
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item ><div @click="handleEdit(index, item)">修改</div></el-dropdown-item>
                  <el-dropdown-item><div @click="handleDelete(index, item)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <p>权重：{{ item.weight }}</p>
            </el-col>
          </div>
        </el-tab-pane>
        <el-tab-pane label="web站" name="second">
          <div v-for="(item, index) in list" v-if="item.type === 2">
            <el-col :span="20" class="center">
              <img :src="item.image_url" class="image">
            </el-col>
            <el-col :span="2" class="margin">
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item ><div @click="handleEdit(index, item)">修改</div></el-dropdown-item>
                  <el-dropdown-item><div @click="handleDelete(index, item)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <p>权重：{{ item.weight }}</p>
            </el-col>
          </div>
        </el-tab-pane>
        <el-tab-pane label="手机" name="third">
          <div v-for="(item, index) in list" v-if="item.type === 1">
            <el-col :span="20" class="center">
              <img :src="item.image_url" class="image">
            </el-col>
            <el-col :span="2" class="margin">
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item ><div @click="handleEdit(index, item)">修改</div></el-dropdown-item>
                  <el-dropdown-item><div @click="handleDelete(index, item)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <p>权重：{{ item.weight }}</p>
            </el-col>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <!-- 底部分页 -->
    <!-- <el-col :span="16" v-show="!listLoading" class="center margin">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-col> -->
  </div>
</template>

<script>
  import api from './api.js'
  import _ from 'lodash'

  export default {
    data() {
      return {
        activeName: 'first',
        id: '', // 列表的id
        list_first:[],
        list: [],
        total: null,
        currentPage: 1,
        listLoading: true,
        listQuery: {
          offset: 1,
          limit: 10,
          title: undefined,
          type: 0,
          status: undefined,
          sort: '+id'
        },
        tableKey: 0
      }
    },
    watch: {
    },
    async created() {
      await this.getBanner()
      // await
    },
    filters: {

    },
    methods: {
      async getBanner() {
        try {
          this.listLoading = false
          let params = {
            url: '/admin/panel/list',
            data: {
              offset: (this.currentPage - 1) * this.listQuery.limit,
              limit: this.listQuery.limit
            }
          }
          let result = await api.getBanner(params)

          let rows = result.rows
          rows = _.sortBy(rows, 'weight')
          rows = _.sortBy(rows, function(item) {
            return -item.weight;
          })

          this.list = rows
          this.total = result.total
        } catch (err) {
          this.listLoading = false
          this.logerrFail(err)
        }
      },

      logerrSuccess () {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      },

      async handleDelete (index, row) {
        try {
          this.listLoading = false
          let result = await api.deleteBanner({id: row.id})

          this.list = this.list.filter((rec) => {
            return rec.id !== row.id
          })

          this.logerrSuccess()


        } catch (err) {
          this.listLoading = false
          this.logerrFail(err)
        }
      },

      logerrFail (err) {
        this.$notify({
          title: '提示',
          message: err,
          type: 'warning',
          duration: 2000
        })
      },

      handleFilter() {
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getBanner()
      },
      // 页码数改变
      handleCurrentOffsetChange(val) {
        // this.listQuery.offset = val
        this.currentPage = val
        this.getBanner()
      },

      handleCreate () {
        this.$router.push({path: './createBanner'})
      },

      handleEdit (index, row) {
        localStorage.setItem(`banner_${row.id}`, JSON.stringify(row))
        this.$router.push({path: './editBanner', query: {id: row.id}})
      },
    }
  }

</script>
<style lang="scss" scoped>
  .center {
    text-align: center
  }

  .margin {
    margin: 20px;
  }

  .image {
    width: 100%;
    display: block;
    margin: 0 0 12px;
    border-radius: 5px;
    display: block;
    border: 1px solid #d8d8d8;
    padding: 3px;
  }
</style>
