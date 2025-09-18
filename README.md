
# GIG-Flash 项目配置与运行文档

## 项目概述

**GIG-Flash** 是一个基于 **uni-app** 框架开发的跨平台移动应用，支持多端部署（H5、小程序、App）。项目采用 Vue 3 + JavaScript 技术栈，集成了 uview-plus UI 组件库和 Pinia 状态管理。

## 技术架构

- **前端框架**: Vue 3 + uni-app
- **UI组件库**: uview-plus
- **状态管理**: Pinia
- **样式预处理**: SCSS
- **构建工具**: HBuilderX / uni-app CLI
- **目标平台**: App

## 项目结构

```
GIG-Flash/
├── api/                    # API接口配置
├── components/            # 公共组件
├── config/               # 项目配置
├── pages/                # 页面文件
├── static/               # 静态资源
├── store/                # 状态管理
├── uni_modules/          # uni-app插件
├── utils/                # 工具函数
├── App.vue              # 应用入口
├── main.js              # 主入口文件
├── manifest.json        # 应用配置
├── pages.json           # 页面路由配置
└── uni.scss             # 全局样式变量
```

## 配置文件详解

### 1. 环境配置 (config/config.js)

```javascript
// 开发环境配置
const develop = true;

// API服务器地址
let host = '';
if (develop) host = 'http://192.168.0.109:8080/collide-all/api/v1';
else '';

// 生产环境关闭console输出
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};
```

**配置说明**:
- `develop`: 开发环境标识，控制API地址和日志输出
- `host`: API服务器地址，开发环境指向本地服务器

### 2. 应用配置 (manifest.json)

**基本信息**:
- 应用名称: appName
- 应用ID: appId
- 版本号: 1.0.0
- 版本代码: 100

**平台配置**:
- **App端**: 支持Android和iOS，包含相机、视频播放等模块
- **小程序端**: 支持微信、支付宝、百度、头条小程序
- **权限配置**: 包含相机、网络、存储等必要权限

### 3. 依赖配置 (package.json)

```json
{
  "dependencies": {
    "clipboard": "^2.0.11",    // 剪贴板操作
    "dayjs": "^1.11.13",       // 日期处理
    "pinia": "^3.0.3"          // 状态管理
  }
}
```

### 4. 主入口配置 (main.js)

```javascript
import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// z-paging分页组件配置
uni.$zp = {
    config: {
        'default-page-size': 20,
    }
}

// Vue 3 应用创建
export function createApp() {
    const app = createSSRApp(App)
    app.use(uviewPlus).use(pinia)
    return { app }
}
```

## API配置详解

### 1. HTTP请求配置 (utils/http.js)

**请求配置**:
- 基础URL: 从config.js获取
- 请求头: 包含token认证、开发标识
- 超时时间: 15秒
- 加载提示: 800ms后显示loading

**主要功能**:
- 自动token管理
- 请求防重复
- 统一错误处理
- 身份过期自动跳转

**API方法**:
- `request()`: 通用请求方法
- `getRequest()`: GET请求
- `postRequest()`: POST请求
- `putRequest()`: PUT请求

### 2. API接口模块

#### 社区模块 (api/community.js)
- 动态创建、查询、点赞、分享
- 评论管理
- 关注功能

#### 内容模块 (api/content.js)
- 内容列表获取
- 收藏功能
- 长视频相关

#### 消息模块 (api/message.js)
- 消息列表查询
- 消息创建
- 会话详情

## 页面路由配置 (pages.json)

**主要页面**:
- 欢迎页: `/pages/welecome/index`
- 引导页: `/pages/guide/guide`
- 首页: `/pages/index/index` (App端) / `/pages/index/index-v` (其他端)
- 发现页: `/pages/discover/discover`
- 社区页: `/pages/community/community`
- 个人中心: `/pages/my/my`

## 样式配置 (uni.scss)

**全局样式变量**:
- 主题色彩系统
- 尺寸规范
- 间距标准
- 透明度设置

**集成组件**:
- uview-plus主题样式
- 自定义主题变量

## 运行与开发

### 开发环境要求

1. **Node.js**: 建议版本 16+
2. **HBuilderX**: 推荐使用HBuilderX进行开发
3. **依赖安装**: `npm install`

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式 (HBuilderX中操作)
# 1. 点击运行 -> 运行到浏览器
# 2. 点击运行 -> 运行到手机或模拟器
# 3. 点击发行 -> 原生App-云打包
```

### 调试配置

**开发环境**:
- API地址: `http://192.168.0.109:8080/collide-all/api/v1`
- 开启console输出
- 显示请求loading

**生产环境**:
- 关闭console输出
- 隐藏开发标识

## 打包配置

### App端打包

**Android配置**:
- 支持架构: armeabi-v7a, arm64-v8a, x86
- 权限: 相机、网络、存储等
- 图标: 72x72, 96x96, 144x144, 192x192

**iOS配置**:
- 图标尺寸: 1024x1024 (App Store)
- 支持iPhone和iPad


## 部署说明

### 开发部署

1. 修改 `config/config.js` 中的API地址
2. 在HBuilderX中运行到目标平台
3. 检查网络请求和功能正常性

### 生产部署

1. 修改 `config/config.js` 中的 `develop` 为 `false`
2. 配置生产环境API地址
3. 使用HBuilderX进行云打包
4. 上传到各应用商店或平台

## 注意事项

1. **API地址配置**: 开发和生产环境需要不同的API地址
2. **权限管理**: App端需要配置相应的权限声明
3. **跨平台兼容**: 注意不同平台的差异，使用条件编译
4. **性能优化**: 生产环境关闭console输出，优化加载性能
5. **版本管理**: 及时更新manifest.json中的版本信息

## 常见问题

1. **网络请求失败**: 检查API地址配置和网络连接
2. **权限问题**: 确认manifest.json中的权限配置
3. **打包失败**: 检查依赖版本兼容性和配置完整性
4. **跨平台问题**: 使用条件编译处理平台差异



----------------------------

# H5 PWA项目配置

**需要严格按照要求配置**



- 使用[工具](https://favicon.inbrowser.app/tools/favicon-generator)生成图标并放到项目中

- 修改`vite.config.js`文件

```js

VitePWA({
  // ...,
			manifest: {
				name: 'X', // 应用名称
				short_name: 'x',  // 应用短名称
				description: 'A short-video app',  // 应用描述
				theme_color: '#ffffff',
				icons: [{
						src: '/static/icon/pwa-192x192.png',      // 图标路径
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/static/icon/pwa-512x512.png',      // 图标路径
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
})
```


- 修改`index.html`,加入head中

``` html
    <!-- 根据需求调整  不会调就确保文件名一致 -->
    <link rel="apple-touch-icon" href="/static/icon/apple-touch-icon.png">
		<link rel="icon" href="/static/icon/favicon-32x32.png" type="image/png" sizes="32x32">
		<link rel="icon" href="/static/icon/favicon-16x16.png" type="image/png" sizes="16x16">
		<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
		<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">

```

> 如果认为这么配置麻烦,就形成配置,然后引用对应变量