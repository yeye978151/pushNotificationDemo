function component() {
    const element = document.createElement('div');
    const permissionBtn = document.createElement('button');
    const serviceWorkBtn = document.createElement('button');

    element.innerHTML = 'hello, push-notification!';
    permissionBtn.innerHTML = '开启推送通知';
    permissionBtn.addEventListener('click', askPermission);

    serviceWorkBtn.innerHTML = '开启service work';
    serviceWorkBtn.addEventListener('click', registerServiceWork);


    element.appendChild(permissionBtn);
    element.appendChild(serviceWorkBtn);

    return element;
}

async function registerServiceWork() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscribeOptions: PushSubscriptionOptionsInit = {
            userVisibleOnly: true,
            applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
        };
        registration.getNotifications();
        const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
        const resp: Response = await fetch('/api/pushNotification/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pushSubscription),
        })
        const data = await resp.json();
        console.log(data);
    }
    catch (err) {
        console.error('Unable to register service worker.', err);
    }
}

async function askPermission(): Promise<void> {
    const permissionResult: NotificationPermission = await Notification.requestPermission();

    if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
    } else {
        console.log('granted success');
        await registerServiceWork();
    }
}

document.body.appendChild(component());