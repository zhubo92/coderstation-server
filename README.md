# 代码论坛服务端

## 技术栈：express + mongoDB

### 第一次运行只需要自行安装 mongoDB 即可

### 注意 node 版本，自行安装 nvm 后，在根目录下执行下列命令即可
```shell
nvm use $(Get-Content .nvmrc)
```
注：node版本不对会导致数据库连接不上

1. 先下载mongodb，在下载mongostore
2. 执行下列命令导入数据到数据库coderstation
```shell
mongorestore -h localhost:27017 -d coderstation --dir C:\Users\admin\Desktop\coderstationData
```
