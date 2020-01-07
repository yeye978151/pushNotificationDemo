const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpush = require('web-push');


const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

const vapidKeys = {
    publicKey:
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
};

const subscriptions = new Set();

webpush.setVapidDetails(
    'mailto:zhangxx_cs@163.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));


app.get('/api/hello-world', (req, resp) => {
    resp.end('hello world');
});
app.post('/api/pushNotification/register', function (req, resp) {
    console.log(`接收到新的推送订阅:${req.body}`);
    subscriptions.add(req.body);
    console.log(`插入订阅成功，现在已有的订阅为: ${subscriptions.size}`);
    resp.json(req.body);
});

app.post('/api/trigger-push-msg/', async function (req, resp) {
    console.log(`subscriptions : ${subscriptions}`);
    const msg = '' + req.body.text;
    for (s of subscriptions) {
        console.log(`处理订阅:${JSON.stringify(s)}`);
        try {
            const sendResult = await sendPushNotification(s, msg);
            console.log(`处理此订阅成功: ${JSON.stringify(sendResult)}`);
        } catch (e) {
            console.error(e);
        }
    }
    resp.end(JSON.stringify(subscriptions));
});


async function sendPushNotification(subscription, dataToSend) {
    try {
        return webpush.sendNotification(subscription, dataToSend);
    } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('Subscription has expired or is no longer valid: ', err);
        } else {
            throw err;
        }
    }
}

// Serve the files on port 3000.
app.listen(3000, () => {
    console.log('app listening on port 3000!\n');
});
