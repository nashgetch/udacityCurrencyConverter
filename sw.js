var appCacheName = 'nash-static-v1';
var url = [
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
    'https://www.github.com/udacityCurrencyConverter/manifest.json',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
];
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(appCacheName).then(function(cache){
			return cache.addAll(url);
		})
	);
});

self.addEventListener('message', function(event){
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});

self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cacheName){
					return cacheName.startsWith('nash-') && cacheName !== appCacheName;
				}).map(function(cacheName){
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request).then(function(response){
			if(response){
				return response;
			}
			return fetch(event.request);
		})
	);
});
