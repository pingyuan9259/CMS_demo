const sortOptions = [
  // { display_name: '默认', key: 0 },
  { display_name: '已推荐', key: 1 },
  { display_name: '未推荐', key: 2 },
  { display_name: '公开', key: 3 },
  { display_name: '私有', key: 4 }
]

const channelActionTypeOptions = [
  {
    key: "del",
    display_name: '删除'
  },
  {
    key: "operate",
    display_name: '运营'
  }
]

const BBSAvatarSize = {
  WIDTH: 160,
  HEIGHT: 160
}

const bbsPublicType = {
    PRIVATE: 0,
    PUBLIC: 1
}

export { sortOptions, channelActionTypeOptions, BBSAvatarSize, bbsPublicType }