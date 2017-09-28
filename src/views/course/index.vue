<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <!-- 顶部搜索、排序 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名" v-model="listQuery.name">
      </el-input>
      <el-select clearable @change='handleFilter' class="filter-item" style="width: 100px" v-model="listQuery.type" placeholder="类型">
        <el-option v-for="item in courseTypeOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <!-- <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>-->
      <el-button style="margin-left: 12px;" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="plus">添加课程</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button> -->

      <!-- 表格 -->
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" fit highlight-current-row>
        <el-table-column width="85px" align="center" label="课程 ID">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="课程名">
          <template scope="scope">
            <span class="link-type" @click="goToEditCourse(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="头像" width="120px">
          <template scope="scope" style="">
            <div class="img-wrapper">
              <img style="max-width: 100%; max-height: 100%; border-radius: 6px;" :src="scope.row.avatar || 'https://o4a7cbihz.qnssl.com/picture/41a736cc-948c-4670-a2a4-87219e6d59ab'">
            </div>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" label="价格">
          <template scope="scope">
            <span style='color:red;'>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column width="85px" align="center" label="类型">
          <template scope="scope">
            <el-tag hit type="primary" v-if="scope.row.type === 1">系统课</el-tag>
            <el-tag hit type="success" v-if="scope.row.type === 2">分享课</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="225px" align="center" label="直播 ID">
          <template scope="scope">
            <span v-if="scope.row.liveshowId">{{scope.row.liveshowId}}</span>
            <el-button v-else
              size="mini"
              type="primary"
              @click="createCourseLiveshow(scope.$index, scope.row)">创建直播</el-button>
          </template>
        </el-table-column>
        <el-table-column width="95px" align="center" label="频道 ID">
          <template scope="scope">
            <span v-if="scope.row.bbsId" class="link-type" @click="goToCourseChannel(scope.row)">{{scope.row.bbsId}}</span>
            <el-button v-else
              size="mini"
              type="primary"
              @click="createCourseBBS(scope.$index, scope.row)">创建频道</el-button>
          </template>
        </el-table-column>

        <el-table-column width="125px" align="center" label="作业论坛 ID">
          <template scope="scope">
            <span v-if="scope.row.jobId" class="link-type" @click="goToCourseChannel(scope.row)">{{scope.row.jobId}}</span>
            <el-button v-else
              size="mini"
              type="primary"
              @click="createCourseJob(scope.$index, scope.row)">创建作业论坛</el-button>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" label="权重">
          <template scope="scope">
            <span>{{scope.row.weight}}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button
              v-if="scope.row.status === 1"
              size="small"
              type="primary"
              @click="shelfCourse(scope.$index, scope.row)">上架</el-button>
            <el-button
              v-if="scope.row.status === 2"
              size="small"
              type="danger"
              @click="alertDropCourse(scope.$index, scope.row)">下架</el-button>
            <router-link :to="{path: '/course/courseUser', query: { courseId: scope.row.id }}">
              <el-button size="small" type="success">人员列表</el-button>
            </router-link>
          </template>
        </el-table-column>

      </el-table>

      <!-- 底部分页 -->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentOffsetChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import { courseType, actionTypeOptions, courseMessageLength } from './types'
  import Cookies from 'js-cookie';
  import Request from 'utils/request';
  import { APP_TOKEN_KEY, APP_ENV } from 'config/app'
  import api from './api.js'
  import channelApi from '../channel/api.js'
  import qs from 'qs'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    data() {
      return {
        list: [],
        total: null,
        currentPage: 1,
        listLoading: true,
        listQuery: {
          limit: 10,
          name: '',
          type: undefined,
          status: undefined,
          sort: '+id'
        },
        courseType: courseType,
        courseTypeOptions: [{ label: '系统课', key: 1 }, { label: '分享课', key: 2 }],
        actionTypeOptions: actionTypeOptions,
        sortOptions: [{
          label: '按ID升序',
          key: '+id'
        }, {
          label: '按ID降序',
          key: '-id'
        }],
        tableKey: 0
      }
    },
    watch: {
    },
    created() {
      this.getList()
    },
    filters: {

    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          let result = await api.getCourseList({url: this.queryURL()})
          this.listLoading = false
          this.list = result.rows
          this.total = result.total
        } catch (err) {
          this.listLoading = false
          window.alert(err)
        }
      },
      queryURL () {
        let url = '/admin/course/course-list?offset=' + (this.currentPage - 1) * this.listQuery.limit + '&limit=' + this.listQuery.limit
        if (this.listQuery.type) {
          url = url + '&type=' + this.listQuery.type
        }
        if (this.listQuery.name.trim().length) {
          url = url + '&name=' + this.listQuery.name.trim()
        }
        return url
      },
      handleFilter() {
        this.getList()
      },
      // 分页大小改变 (limit)
      handleSizeChange(val) {
        this.listQuery.limit = val
        if ((this.currentPage - 1) * val > this.total) { return }
        this.getList()
      },
      // 页码数改变
      handleCurrentOffsetChange(val) {
        // this.listQuery.offset = val
        this.currentPage = val
        this.getList()
      },
      create() {
      },
      update() {
      },
      resetTemp() {},
      handleDownload() {},
      handleCommand(command) {
        let courseId = command.split('#')[1]
        let action = command.split('#')[0]
        if (action === 'drop') {
          this.alertDropCourse(courseId)
        }
      },
      handleCreate () {
        console.log('--------------------------------')
        this.$router.push('./createCourse')
      },
      goToEditCourse (row) {
        localStorage.setItem(`course${row.id}`, JSON.stringify(row))
        this.$router.push({ path: './editCourse', query: { id: row.id }})
      },
      alertDropCourse (index, row) {
        this.$confirm('将下架该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dropCourse(index, row)
        }).catch(() => {

        })
      },
      async shelfCourse (index, row) {
        if (!row.id) {
          return
        }
        try {
          let result = await api.postShelfCourse({id: row.id})
          if (result === 1) {
            row.status = 2
            this.list.splice(index, 1, row)
          }
        } catch (err) {
          window.alert(err)
        }
      },

      async dropCourse(index, row) {
        if (!row.id) {
          return
        }
        try {
          let result = await api.postDropCourse({id: row.id})
          if (result) {
            this.notifySuccessSubmit('课程已下架')
            row.status = 1
            this.list.splice(index, 1, row)
          }
        } catch (err) {
          window.alert(err)
        }
      },

      goToCourseChannel (row) {
        window.open(`http://web${ENV}.tinfinite.com/user/lessons/details/comments?id=${row.id}`)
      },

      async createCourseLiveshow (index, row) {
        try {
          let adminsIds = await this.getAdmins(row.id)
          if (!adminsIds) {
            this.notifyFailedSubmit('获取管理员列表失败，请检查管理员列表')
            return
          }
          let adminsInfos = await this.getUsersInfosFromIds(adminsIds)
          if (!adminsInfos) {
            this.notifyFailedSubmit('获取管理员列表失败，请检查管理员列表')
            return
          }
          let adminsToSend = Object.keys(adminsInfos).map(key => adminsInfos[key]).map((admin) => {
            return JSON.stringify({
                     id: admin.id || '',
                     name: admin.fullname || ''
            })
          })
          let teachersIds = await this.getTeachers(row.id)
          if (!teachersIds) {
            this.notifyFailedSubmit('获取老师列表失败，请检查老师列表')
            return
          }
          let teachersInfos = await this.getUsersInfosFromIds(teachersIds)
          if (!teachersInfos) {
            this.notifyFailedSubmit('获取老师列表失败，请检查老师列表')
            return
          }
          let teachersToSend = Object.keys(teachersInfos).map(key => teachersInfos[key]).map((teacher) => {
            return JSON.stringify({
                     id: teacher.id || '',
                     name: teacher.fullname || ''
            })
          })
          let dataToUpdate = { product_id: row.id, admins: adminsToSend, speakers: teachersToSend }
          let result = await api.postCreateLiveshow(dataToUpdate)
          if (!result) {
            this.notifyFailedSubmit('创建直播失败')
            return
          }
          this.resetLiveshow(index, row)
        } catch (err) {
          window.alert(err)
        }
      },
      async getAdmins(product_id) {
        // let url = '/admin/course/get-admin-list?product_id=' + product_id
        try {
          let result = await api.getCourseAdmins(product_id)
          return result || []
        } catch (err) {
          window.alert(err)
        }
      },
      async getTeachers(product_id) {
        // let url = '/admin/course/get-teacher-list?product_id=' + product_id
        try {
          let result = await api.getCourseTeacherList(product_id)
          return result || []
        } catch (err) {
          window.alert(err)
        }
      },
      async createCourseJob(index, row) {
        try {
          let result = await api.postCreateCourseJob({ product_id: row.id })
          if (result === 1) {
            this.resetCourseRow(index, row, '创建作业论坛成功')
          } else {
            this.notifyFailedSubmit('创建作业论坛失败')
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async createCourseBBS(index, row) {
        try {
          let result = await api.postCreateCourseBBS({ product_id: row.id })
          if (result === 1) {
            this.resetCourseRow(index, row, '创建频道成功')
          } else {
            this.notifyFailedSubmit('创建频道失败')
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async resetCourseRow (index, row, msg='创建成功') {
        let url = '/admin/course/course-list?product_ids[]=' + row.id
        try {
          let result = await api.getCourseList({url: url})
          if (result && result.rows && result.rows.length) {
            this.list.splice(index, 1, result.rows[0])
            this.notifySuccessSubmit(msg)
          } else {
            this.notifyFailedSubmit('创建成功，请手动刷新列表')
          }
        } catch (err) {
          window.alert(err)
        }
      },

      async getUsersInfosFromIds (ids) {
        try {
          if (ids && ids.length) {
            let url = '/admin//user/user-info-map?field=_id'
            url = url + '&' + qs.stringify({ values: ids}, { arrayFormat: 'brackets' })
            url = url + '&projection=avatar fullname'
            let result = await channelApi.getUsersInfos({url: url})
            return result || []
          }
        } catch (err) {
          window.alert(err)
        }
      },
      async resetLiveshow (index, row) {
        let url = '/admin/course/course-list?product_ids[]=' + row.id
        try {
          let result = await api.getCourseList({url: url})
          if (result && result.rows && result.rows.length) {
            this.list.splice(index, 1, result.rows[0])
            this.notifySuccessSubmit('创建直播成功')
          } else {
            this.notifyFailedSubmit('创建成功，请手动刷新列表')
          }
        } catch (err) {
          window.alert(err)
        }
      },
      notifyFailedSubmit(msg='出错了') {
        this.$notify.error({
          title: '出错了',
          message: msg,
          duration: 2000
        })
      },
      notifySuccessSubmit (msg='成功') {
        this.$notify.success({
          title: '成功',
          message: msg,
          duration: 1000
        })
      }

    }
  }

</script>
<style lang="scss" scoped>

  .img-wrapper {
    padding: 4px;
    height: 60px;
    overflow:hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cell .el-tag {
    margin-right: 0;
    margin-top: 0;
  }

</style>
