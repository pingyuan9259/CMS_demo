<template>
  <div>
    <div style="display: -webkit-flex;display: flex; flex-direction:column; align-items: center; justify-content: center;" class="block">
<!--       <el-carousel style="width: 800px;" height="300px">
        <el-carousel-item v-for="item in coursePreview.banner_list" :key="item">
          <img sytle="height: auto;" :src="item">
        </el-carousel-item>
      </el-carousel> -->
      <img :src="coursePreview.course_avatar" style="width: 800px; height: 450px;">
      <br>
      <h1>{{ coursePreview.name }}</h1>
      <div style="display: inline;">

        <span style="font-size: 17px; font-weight: 600; margin-right: 10px;">价格：{{ coursePreview.price }}</span>
        <span style="font-size: 17px; font-weight: 600; margin-left: 10px; color: #13ce66;" v-if="coursePreview.member_price > 0">会员价格：{{ coursePreview.member_price }}</span>
        <span v-else style="font-size: 17px; font-weight: 600; margin-left: 10px; color: #13ce66;">会员免费</span>
      </div>
      <h5 style="margin: 6px 0 24px 0;">报名截止时间: {{ deadline }}</h5>
      <el-button type="success" style="height: 40px; width: 100px; cursor: initial;">我要报名</el-button>
      <br>
      <br>
      <br>

      <h3 v-if="coursePreview.course_type === courseType.SYSTEM">我能学到什么</h3>
      <div v-if="coursePreview.course_type === courseType.SYSTEM" style="width: 70%; padding: 0 40px;">
        <div style="width: 40%; height: 160px; margin: 0 0 0 40px; overflow-y: scroll; display: inline-block;" v-for="feature in coursePreview.feature_list" :key="feature">
        <!-- <img style="width: 20%;" :src="feature.imageUrl"> -->
          <h4>{{feature.title}}</h4>
          <h5>{{feature.description}}</h5>
        </div>
      </div>
      <img v-if="coursePreview.course_type === courseType.SHARE" v-for="avatar of coursePreview.banner_list" :src="avatar.url" style="width: 800px; height: 450px;">

      <br>
      <h3>课程大纲</h3>
      <div style="margin: 10px auto; width: 60%; border-radius: 6px; border: 1px solid #d9d9d9; display: flex;" v-for="outline in coursePreview.outline_list" :key="outline">
        <img style="height: 90px; margin: 20px 20px;" :src="outline.imageUrl">
        <div style="margin-top: 5px;">
          <h4>{{outline.title}}</h4>
          <h5 style="color: grey; margin-top: 5px;">{{outline.description}}</h5>
        </div>
      </div>

      <br><br><br>
      <div style="margin: 20px auto; width: 65%; display: flex;">
        <img style="height: 200px; " :src="coursePreview.teacher_intros.avatarUrl">
        <div style="margin: 5px 0 0 30px;overflow-y: scroll;">
          <h4>授课教师</h4>
          <h4>{{coursePreview.teacher_intros.name}}</h4>
          <h5 style="color: grey; margin-top: 30px;">{{coursePreview.teacher_intros.intro}}</h5>
        </div>
      </div>

      <br><br><br>
      <h3 v-if="coursePreview.faq_list.length">常见问题</h3>
      <div style="width: 80%; padding: 0 20px  0 40px;">
        <div style="width: 40%; height: 160px; margin: 0 0 0 40px; overflow-y: scroll; display: inline-block;" v-for="faq in coursePreview.faq_list" :key="faq">
          <h4>{{faq.question}}</h4>
          <h5 style="color: grey; ">{{faq.answer}}</h5>
        </div>
      </div>

      <el-button type="success" style="height: 40px; width: 100px; margin-top: 80px; cursor: initial;">我要报名</el-button>
    </div>
  </div>
</template>

<script>
import { parseTime, dateFormat } from 'utils'
import { courseType } from '../../views/course/types.js'
export default {
  name: 'coursePreview',
  props: {
    coursePreview: {
      type: Object
    }
  },
  data () {
    return {
      courseType: courseType
      // coursePreview: {}
    }
  },
  computed : {
    deadline () {
      return parseTime(this.coursePreview.signup_deadline).replace('00:00:00', '23:59:59')
    }
  },
  created () {
    // console.log('---- this.preview : ', this.coursePreview)
  }
}

</script>

<style lang="scss">
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

    .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  h1 {

  }

  h3 {
    font-size: 19px;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }
</style>