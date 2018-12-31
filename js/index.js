console.log('index2')
// 用于标注创建的缓存，也可以根据它来建立版本规范

const CACHE_NAME='FANMAN V1.0.0';
// 列举要默认缓存的静态资源，一般用于离线使用

const urlsToCache=[
    'offline.js',
    '../images/offline.png'
];


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