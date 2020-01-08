# Push Notification Demo

## 运行方法

1. 下载代码：
```bash
git clone git@github.com:yeye978151/pushNotificationDemo.git
```

2. 安装依赖
需要先全局安装好cnpm，如果已经安装过，可以跳过。如果安装提示权限不够，请加上`sudo`
```bash
npm install -g cnpm
```
安装依赖
```bash
cnpm install 
```

3. 启动项目
```bash
npm run server
```
如果提示端口被占用，请修改server.js中的端口号。



4. 访问项目
访问url：http://localhost:3000

5. 点击页面按钮，开启通知

6. 触发服务器端通知

```bash
 9552* curl http://localhost:3000/api/trigger-push-msg -H 'Content-Type:application/json' -d '{"text":"张萌萌真可爱"}'
```
