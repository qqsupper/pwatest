console.log('index123')
// 用于标注创建的缓存，也可以根据它来建立版本规范

const CACHE_NAME='FANMAN V6.0.0';
// 列举要默认缓存的静态资源，一般用于离线使用

const urlsToCache=[
    './js/offline.js',
    './images/offline.png',
    './css/main.css',
    './index.html',
    './html/offline.html'
];

 

// self 为当前 scope 内的上下文

self.addEventListener('install',event=>{
    // event.waitUtil 用于在安装成功之前执行一些预装逻辑

// 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率

// 安装成功后 ServiceWorker 状态会从 installing 变为 installed

    event.waitUntil(
        // 使用 cache API 打开指定的 cache 文件
        caches.open(CACHE_NAME).then(cache=>{
            console.log(cache)
            //添加要缓存的资源列表
            return cache.addAll(urlsToCache)
        })

    )

})


// // // 更新清理旧版本cache Storage里面缓存文件
// //  //安装阶段跳过等待,直接进入active
// self.addEventListener('install',function(event){
//     event.waitUntil(self.skipWaiting());
// })


// self.addEventListener('activate',event=>event.waitUntil(
//     Promise.all([
//         //更新客户端
//        self.clients.claim(),
//         //清理旧版本
//         caches.keys().then(cacheList=>Promise.all(
//             cacheList.map(cacheName=>{
//                 console.log(cacheName);
//                 if(cacheName!==CACHE_NAME){
//                     caches.delete(cacheName);
//                 }
//             })
//         ))
//     ])

// ))


// 联网状态下执行
function onlineRequest(fetchRequest){
    // 使用fetch API获取资源,以实现对资源请求控制
    return fetch(fetchRequest).then(response=>{
        //在资源请求成功后，将image、js、css资源加入缓存列表
        // if(!response||response.status!==200||!response.headers.get('Content-type').match(/image|javascript|text\/css |text\/html/i)){
        //     return response;
        // }

        if(!response||response.status!==200||!response.type!=='basic'){
            return response;
        }
        const responseToCache=response.clone();
        caches.open(CACHE_NAME)
                .then(function(cache){
                    cache.put(fetchRequest,responseToCache)
                })

         return response;       
    }).catch(()=>{
        // 获取失败,离线资源降级替换
        // offlineRequest(fetchRequest);
    })
}


// 离线状态下执行,降级替换
function offlineRequest(request){
        // 使用离线图片
        if (request.url.match(/\.(png|gif|jpg)/i)){
            return caches.match('/images/offline.png');

        }

        // 使用离线js
        if(request.url.match(/\.js$/)){
            return caches.match('/js/offline.js');
        }

        if(request.url.match(/\.html$/)){
            return caches.match('/html/offline.html');
        }

}

self.addEventListener('fetch',event=>{
        event.respondWith(
            caches.match(event.request)
                .then(hit=>{
                    console.log(hit);
                   if(hit){
                    return hit;
                   }
                    const fetchRequest=event.request.clone();


                    return onlineRequest(fetchRequest);
                    // if(navigator.onLine){
                    //     // 如果为联网状态
                        
                    // }else{
                    //     // 如果为离线状态
                    //     return offlineRequest(fetchRequest);
                    // }
                })
        )

})

