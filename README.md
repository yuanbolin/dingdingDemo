钉钉自定义机器人

1. 新建群组
2. 设置==>智能群助手==>自定义机器人
3. 填写名称,选择关键词 复制Webhook地址
4. 代码配置

// 发送消息 this.robot({ msgtype: 'text', text: { content: '阀门监控报警:水压力异常', //聊天内容 }, }); //方法 robot(message) { var postData
= JSON.stringify(message); console.log(message); var options = { method: 'POST', encoding: 'utf-8', headers: {
'Content-Type': 'application/json', }, body: postData, }; fetch(
'https://oapi.dingtalk.com/robot/send?access_token=5b56ff90ac133b85d57e86f6d20cc2900e1c7ad7887510d7e03ea4665243e874',
options,
)
.then(response => { // 获取到网络请求返回的对象 response.json(); })
.then(json => { console.log('json', json); })
.catch(error => { console.log('error', error); }); }


