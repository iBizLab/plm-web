# 面包屑导航占位插件

该插件基于面板项增强，主要用于嵌入视图绘制，和面包屑导航功能。**该插件隶属于自定义部件绘制插件（基于面板项进行扩展）**

## 页面展示

![image-20240413171739394](./public/assets/images/scene.png)


## 输入参数

| 属性      | 类型         | 默认值 | 说明                                                  |
| --------- | ----------- | ------ | ----------------------------------------------------- |
| show_breadcrumb     | boolean      | true     | 是否显示面包屑 |


## 功能说明

1. 初始化时从缓存中获取面包屑数据并绘制对应的导航视图

2. 路由变更时，根据路由路径计算面包屑数据

3. 使用嵌入视图的方式绘制导航视图，导航视图创建完成之后更改当前面包屑标题，并缓存面包屑数据

## 附录

### 面包屑导航占位插件

```json
[
  {
    "plugintype": "CUSTOM",
    "rtobjectrepo": "@ibiz-template-plm/breadcrumb-nav-pos@0.0.3-alpha.164",
    "codename": "UsrPFPlugin1211957375",
    "plugintag": "BREADCRUMB_NAV_POS",
    "rtobjectmode": 2,
    "rtobjectname": "BREADCRUMB_NAV_POS",
    "pssyspfpluginname": "面包屑导航区占位"
  }
]
```