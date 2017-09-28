import LMT from './lengths'

// 创建课程时的规则
const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: LMT.nameMinLen, max: LMT.nameMaxLen, message: `长度在 ${LMT.nameMinLen} 到 ${LMT.nameMaxLen} 个字符`, trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程描述', trigger: 'blur' },
    { min: LMT.descriptionMinLen, max: LMT.descriptionMaxLen, message: `长度在 ${LMT.descriptionMinLen} 到 ${LMT.descriptionMaxLen} 个字符`, trigger: 'blur' }
  ],
  notice: [
    { required: false, trigger: 'blur'},
    { max: LMT.noticeMaxLen, message: `长度在 ${LMT.noticeMaxLen} 个字符内`, trigger: 'blur'}
  ],
  create_user_id: [
    { required: true, message: '请设置课程创建人' }
  ],
  price: [
    { required: true, message: '请输入价格' },
    { type: 'number', message: '价格必须为数字值' }
    // { validator: checkPrice, trigger: 'blur' }
  ],
  weight: [
    { required: false },
    { type: 'number', message: '权重必须为数字值' }
  ],
  banner_list: [
    { required: true, message: '请上传 banner 图片' }
  ],
  feature_list: [
    { required: true, message: '请输入特色列表' }
  ],
  outline_list: [
    { required: true, message: '请输入课程大纲' }
  ],
  teacher_intros: [
    { required: true, message: '请输入教师介绍' }
  ],
  admin_list: [
    { required: true, message: '请设置管理员' }
  ],
  teacher_list: [
    { required: true, message: '请设置教师' }
  ],
  course_avatar: [
    { required: true, message: '请设置课程头像' }
  ],
  member_price: [
    { required: true, message: '请输入会员价格' },
    { type: 'number', message: '会员价格必须为数字值' }
  ],
  wechat_price: [
    { required: true, message: '请输入微信价格' },
    { type: 'number', message: '微信价格必须为数字值' }
  ],
  member_wechat_price: [
    { required: true, message: '请输入会员微信价格'},
    { type: 'number', message: '会员微信价格必须为数字值' }
  ],
  ios_price: [
    { required: true, message: '请输入 iOS 客户端价格' },
    { type: 'number', message: 'iOS 客户端价格必须为数字值' }
  ],
  ios_member_price: [
    { required: true, message: '请输入 iOS 客户端会员价格' },
    { type: 'number', message: 'iOS 客户端会员价格必须为数字值' }
  ],
  ios_product_id: [
    { required: true, message: '请检查苹果商店商品 id'},
  ],
  signup_deadline: [
    { required: true, message: '请输入课程报名截止时间' }
  ],
  begin_at: [
    { required: true, message: '请输入课程开始时间' }
  ],
  end_at: [
    { required: true, message: '请输入课程结束时间' }
  ]
}
var checkPrice = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('价格不能为空'));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (value < 0) {
        callback(new Error('价格不能为负'));
      } else {
        callback();
      }
    }
  }, 500)
}

export default rules
