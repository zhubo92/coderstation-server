# 代码论坛服务端

## 技术栈：express + mongoDB

### 第一次运行只需要自行安装 mongoDB 即可

### 注意 node 版本，自行安装 nvm 后，在根目录下执行下列命令即可
```shell
nvm use $(Get-Content .nvmrc)
```
注：node版本不对会导致数据库连接不上

1. 先下载mongodb，在下载 mongostore
2. 执行下列命令导入数据到云数据库 coderstation
```shell
mongorestore -h 120.26.76.192:27017 -u coderstation -p ECbmmEK8T84wLSt4 -d coderstation --dir C:\demo-project\coderstation-server\coderstationData
```

# 前端页面放到 /public 目录下面
例如：http://120.26.76.192/web/#/ 项目，打包后直接放到/public/web文件下即可。
