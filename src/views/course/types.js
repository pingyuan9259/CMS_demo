const courseType = {
  SYSTEM: 1,
  SHARE: 2
}
const courseAvatarSize = {
  WIDTH: 2010,
  HEIGHT: 1080
}
// const actionTypeOptions = [{
//   key: "modify",
//   display_name: '修改'
// }, {
//   key: "drop",
//   display_name: '下架'
// }, {
//   key: "del",
//   display_name: '删除'
// }]
const actionTypeOptions = [
  {
    key: "drop",
    display_name: '下架'
  }
]
const mediaType = {
  TEXT: 1,
  IMG: 2,
  VIDEO: 3,
  AUDIO: 4
}
const featureContentTag = {
  MEDIA: 1,
  TITLE: 2,
  DESCRIPTION: 3
}
const outlineContentTag = {
  MEDIA: 1,
  TITLE: 2,
  DESCRIPTION: 3,
  TEXT: 4
}
const faqContentTag = {
  QUESTION: 1,
  ANSWER: 2
}
const courseMessageLength = {
  onlineMsgMaxLen: 500,
  offlineMsgMaxLen: 500
}

export { courseType, courseAvatarSize, actionTypeOptions, mediaType, featureContentTag, outlineContentTag, faqContentTag, courseMessageLength }
