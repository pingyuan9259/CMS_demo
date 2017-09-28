## 开发
```bash
    # 安装依赖
    npm install

    # 本地开发 开启服务
    npm start
```
浏览器访问 http://localhost:8090

## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。

## 开发规范
```shell
view
├── xxx                       // 业务文件夹
    ├── api.js                // 定义业务请求
    └── xxx.vue               // 业务代码
```

  # api 请求规范
```javascript
  getList: async (params) => {
    let _event = {            // 定义请求事件 要求必须包括 methods class moment 以便记录日志
      methods: 'pull',        // 操作方式 增删改查 （create delete update pull）
      class: 'user',          // 操作范围 如（super 超管，user 用户相关，course 课程相关，bbs 论坛相关...）
      comment: '获取用户列表'  // 操作概要 要求包含操作的必要信息 如操作涉及到的用户id、课程id等 尽量详细
    }
    try {
      let data = await CMSRequest.get({
        url: params.url,
        params
      }, _event)             // CMSRequest 或 AdminRequest 的第二个参数传定义好的_event

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
```


