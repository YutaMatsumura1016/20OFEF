const cacheName = 'V6.4.1'; //キャッシュの名づけ

const cacheAssets = [ //必要最低限のもの
	'index.html',
	'toujitsu.html',
	'siryou20.html',
	'siryouKako.html',
	'style.css'
]


self.addEventListener('install', async(ev) => { //installハンドラ
	console.log("SW: install eventが発火");
	ev.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		cache.addAll(cacheAssets);
		return self.skipWaiting();
	})()); //即時実行

});

self.addEventListener('activate', async(ev) => { //activateハンドラ
	console.log("SW: activate eventが発火");
	ev.waitUntil((async () => {
		const keys = await caches.keys();-
		console.log(keys);
		const targets = keys.filter(key => key !== cacheName);
		console.log(targets);
		return Promise.all(targets.map(target => caches.delete(target)));
	})());

});

self.addEventListener('fetch', async(ev) => { //fetchハンドラ
	ev.respondWith((async() => {
		const hit = await caches.match(ev.request);
		console.log('HTTPがリクエストされました');

		//キャッシュがあれば返す
		if(hit){
			return hit;
		}

		//なければ取りに行く、かつキャッシュを保存しておく
		try{
			const res = await fetch(ev.request);
			const resClone = res.clone();
			const cache = await caches.open(cacheName);
			cache.put(ev.request, resClone);
			return res;
		}catch(error){
			return new Response(error);
		}

	})());



});