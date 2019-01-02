console.log('index123')
// 用于标注创建的缓存，也可以根据它来建立版本规范

const CACHE_NAME='FANMAN V11.0.0';
// 列举要默认缓存的静态资源，一般用于离线使用


console.log(CACHE_NAME)
const urlsToCache=[
    './js/offline.js',
    './images/offline.png',
    './css/main.css',
    './index.html',
    './index.js',
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
// function onlineRequest(fetchRequest){
//     // 使用fetch API获取资源,以实现对资源请求控制
//     return fetch(fetchRequest).then(response=>{
//         //在资源请求成功后，将image、js、css资源加入缓存列表
//         // if(!response||response.status!==200||!response.headers.get('Content-type').match(/image|javascript|text\/css |text\/html/i)){
//         //     return response;
//         // }

//         if(!response||response.status!==200||!response.type!=='basic'){
//             return response;
//         }
//         const responseToCache=response.clone();
//         caches.open(CACHE_NAME)
//                 .then(function(cache){
//                     cache.put(fetchRequest,responseToCache)
//                 })

//          return response;       
//     }).catch(()=>{
//         // 获取失败,离线资源降级替换
//         offlineRequest(fetchRequest);
//     })
// }


// 离线状态下执行,降级替换


self.addEventListener('fetch', function(event) {
    event.respondWith(
        // 忽略任何查询字符串参数,这样便不会造成任何缓存未命中
      caches.match(event.request,{ignoreSearch:true})
        .then(function(response) {
          if (response) {
            return response;
          }
  
          // 因为 event.request 流已经在 caches.match 中使用过一次，
          // 那么该流是不能再次使用的。我们只能得到它的副本，拿去使用。
          var fetchRequest = event.request.clone();
  
          // fetch 的通过信方式，得到 Request 对象，然后发送请求
          return fetch(fetchRequest).then(
            function(response) {
              // 检查是否成功
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // 如果成功，该 response 一是要拿给浏览器渲染，而是要进行缓存。
              // 不过需要记住，由于 caches.put 使用的是文件的响应流，一旦使用，
              // 那么返回的 response 就无法访问造成失败，所以，这里需要复制一份。
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log(cache);
                  cache.put(fetchRequest, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });



// 缓存更新
self.addEventListener('activate',function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    console.log(cacheName);
                        // 如果当前版本和缓存版本不一致
                    if(cacheName!==CACHE_NAME){
                        return caches.delete(cacheName);
                    }

                })
            )
        })
    )
})

