import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from '../views/layout/Layout';

// dashboard
const dashboard = resolve => require(['../views/dashboard/index'], resolve);

/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

/* login*/
import Login from '../views/login/';
import authRedirect from '../views/login/authredirect';

/* super admin */
const Admin = resolve => require(['../views/admin/index'], resolve);

/* work log */
const WorkLog = resolve => require(['../views/workLog/index'], resolve);

/* userlist */
const UserList = resolve => require(['../views/userlist/userList'], resolve);
const UserWalletList = resolve => require(['../views/generalSetup/userWalletList'], resolve);
const Record = resolve => require(['../views/generalSetup/record'], resolve);
const UserTag = resolve => require(['../views/userlist/userTag'], resolve);

/* theme*/
const Theme = resolve => require(['../views/theme/index'], resolve);

/* 课程 */
const Course = resolve => require(['../views/course/index'], resolve);
const CreateCourse = resolve => require(['../views/course/createCourse'], resolve);
const EditCourse = resolve => require(['../views/course/editCourse'], resolve);
const CourseUser = resolve => require(['../views/course/courseUser'], resolve);

const BlankLayout = resolve => require(['../views/blankLayout'], resolve);

/* 运营推广 */
const RecommendBanner = resolve => require(['../views/homeModule/recommendBanner/index'], resolve);
const CreateBanner = resolve => require(['../views/homeModule/recommendBanner/create'], resolve);
const EditBanner = resolve => require(['../views/homeModule/recommendBanner/edit'], resolve);

/* 推荐频道 */
const RecommendChannel = resolve => require(['../views/homeModule/recommendChannel/index'], resolve);
const RecommendChannelCreate = resolve => require(['../views/homeModule/recommendChannel/create'], resolve);
const RecommendChannelEdit = resolve => require(['../views/homeModule/recommendChannel/edit'], resolve);

/* 推荐课程 */
const RecommendCourse = resolve => require(['../views/homeModule/recommendCourse/index'], resolve);
const RecommendCourseCreate = resolve => require(['../views/homeModule/recommendCourse/create'], resolve);
const RecommendCourseEdit = resolve => require(['../views/homeModule/recommendCourse/edit'], resolve);

/* 推荐文章 */
const RecommendArticle = resolve => require(['../views/homeModule/recommendArticle/index'], resolve);
const RecommendArticleCreate = resolve => require(['../views/homeModule/recommendArticle/create'], resolve);
const RecommendArticleEdit = resolve => require(['../views/homeModule/recommendArticle/edit'], resolve);

// 把文章变为可推荐的
const ArticleStatus = resolve => require(['../views/articleStatus/index'], resolve);

/* 频道管理 */
const Channel = resolve => require(['../views/channel/index'], resolve);
const CreateChannel = resolve => require(['../views/channel/createChannel'], resolve);
const EditChannel = resolve => require(['../views/channel/editChannel'], resolve);
const OperateContent = resolve => require(['../views/channel/operateContent'], resolve);
const OperatePost = resolve => require(['../views/channel/operatePost'], resolve);
const OperateReply = resolve => require(['../views/channel/operateReply'], resolve);
const ReasonManage = resolve => require(['../views/channel/reasonManage'], resolve);

const Exercise = resolve => require(['../views/exercise/index'], resolve);
const EditExerciseBBS = resolve => require(['../views/exercise/editExerciseBBS'], resolve);
const OperateExercisePost = resolve => require(['../views/exercise/operateExercisePost'], resolve);
const OperateExerciseReply = resolve => require(['../views/exercise/operateExerciseReply'], resolve);

/* 数据分析 */
const Statistics = resolve => require(['../views/dataAnalysis/statistics'], resolve);
const ClassRate = resolve => require(['../views/dataAnalysis/classRate'], resolve);
const LiveData = resolve => require(['../views/dataAnalysis/liveData'], resolve);

/* 频道管理 */
const Recharge = resolve => require(['../views/recharge/index'], resolve);

/* 消息推送 */
const Message = resolve => require(['../views/pushmessage/index'], resolve);

/* 其他 */
const UploadPic = resolve => require(['../views/generalSetup/uploadPic'], resolve);
const FeedbackFAQ = resolve => require(['../views/generalSetup/feedbackFAQ'], resolve);
const EditFeedbackFAQ = resolve => require(['../views/generalSetup/editFeedbackFaq'], resolve);

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  */

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    name: 'admin',
    icon: 'xinrenzhinan',
    meta: { role: ['super_admin'] }, // 权限等级验证
    noDropdown: true,
    children: [
      { path: 'list', component: Admin, name: '超管' }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: 'noredirect',
    name: 'workLog',
    icon: 'bug',
    meta: { role: ['super_admin'] }, // 权限等级验证
    noDropdown: true,
    children: [
      { path: 'index', component: WorkLog, name: '操作日志' }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/courseList',
    name: '课程管理',
    icon: 'zujian',
    meta: { role: ['admin', 'operations'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'courseList', component: Course, name: '课程列表'},
      { path: 'createCourse', component: CreateCourse, name: '创建课程', hidden: true },
      { path: 'editCourse', component: EditCourse, name: '编辑课程', hidden: true },
      { path: 'courseUser', component: CourseUser, name: '人员列表', hidden: true },
      { path: 'homeworkList', component: Exercise, name: '作业列表'},
      { path: 'operateExercisePost', component: OperateExercisePost, name: '作业贴管理', hidden: true },
      { path: 'operateExerciseReply', component: OperateExerciseReply, name: '学生作业管理', hidden: true }
    ]

  },
  {
    path: '/channel',
    component: Layout,
    redirect: '/channel/index',
    name: '频道管理',
    icon: 'zonghe',
    meta: { role: ['admin', 'operations'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'index', component: Channel, name: '频道列表'},
      { path: 'operateContent', component: OperateContent, name: '频道文章贴管理'},
      { path: 'operatePost', component: OperatePost, name: '贴子管理'},
      { path: 'operateReply', component: OperateReply, name: '回复管理'},
      { path: 'createChannel', component: CreateChannel, name: '创建频道', hidden: true },
      { path: 'editChannel', component: EditChannel, name: '编辑频道', hidden: true },
      { path: 'reasonManage', component: ReasonManage, name: '删帖理由管理'},

    ]
  },
  {
    path: '/home',
    component: Layout,
    redirct: '/home/homeCourse',
    name: '首页模块',
    icon: 'tuiguang',
    meta: { role: ['admin', 'operations'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'homeCourse', component: RecommendCourse, name: '首页课程' },
      { path: 'createCourse', component: RecommendCourseCreate, name: '创建推荐课程', hidden: true },
      { path: 'editCourse', component: RecommendCourseEdit, name: '编辑推荐课程', hidden: true },
      { path: 'homeBanner', component: RecommendBanner, name: '首页 Banner' },
      { path: 'createBanner', component: CreateBanner, name: '创建推广内容', hidden: true },
      { path: 'editBanner', component: EditBanner, name: '编辑推广内容', hidden: true },
      { path: 'homeArticle', component: RecommendArticle, name: '首页文章'},
      { path: 'createArticle', component: RecommendArticleCreate, name: '创建推荐文章', hidden: true },
      { path: 'editArticle', component: RecommendArticleEdit, name: '编辑推荐文章', hidden: true },
      { path: 'homeChannel', component: RecommendChannel, name: '首页频道' },
      { path: 'createChannel', component: RecommendChannelCreate, name: '创建推荐频道', hidden: true },
      { path: 'editChannel', component: RecommendChannelEdit, name: '编辑推荐频道', hidden: true },
      { path: 'articleList', component: ArticleStatus, name: '文章列表'}
    ]
  },
  {
    path: '/dataAnalysis',
    component: Layout,
    redirct: '/dataAnalysis/statistics',
    name: '数据分析',
    icon: 'tubiaoleixingzhengchang',
    meta: { role: ['admin', 'operations'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'statistics', component: Statistics, name: '课程报名统计' },
      { path: 'classRate', component: ClassRate, name: '通知到达统计' },
      { path: 'liveData', component: LiveData, name: '直播数据统计' }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'user/list',
    name: '用户管理',
    icon: 'xinrenzhinan',
    meta: { role: ['admin'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'list', component: UserList, name: '用户列表' },
      { path: 'record', component: Record, name: '课程人员', hidden: true },
      { path: 'wallet', component: UserWalletList, name: '用户钱包'},
      { path: 'tag', component: UserTag, name: '用户标签'}
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/index',
    icon: 'jiedianyoujian',
    meta: { role: ['admin', 'operations'] }, // 权限等级验证
    noDropdown: true,
    children: [{ path: 'index', component: Message, name: '消息推送'}]
  },
  {
    path: '/other',
    component: Layout,
    redirct: '/other/recharge',
    name: '其他',
    icon: 'shezhi',
    meta: { role: ['super_admin', 'admin', 'operations'] }, // 权限等级验证
    noDropdown: false,
    children: [
      { path: 'recharge', component: Recharge, name: '充值定价', meta: { role: ['admin'] }},
      { path: 'feedbackFAQ', component: FeedbackFAQ, name: '帮助与反馈', meta: { role: ['admin', 'operations'] }},
      { path: 'editFeedbackFAQ', component: EditFeedbackFAQ, name: '编辑常见问题', meta: { isEdit: true }, hidden: true },
      { path: 'createFeedbackFAQ', component: EditFeedbackFAQ, name: '新建常见问题', hidden: true },
      { path: 'uploadPic', component: UploadPic, name: '上传图片', meta: { role: ['admin', 'operations'] }},
      { path: 'theme', component: Theme, name: '换肤', meta: { role: ['super_admin', 'admin', 'operations'] }}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
