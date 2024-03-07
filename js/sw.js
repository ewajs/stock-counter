self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles/styles.css',
          '/styles/bootstrap.min.css',
          '/styles/bootstrap-icons.min.css',
          '/styles/fonts/bootstrap-icons.woff2',
          '/js/reader.js',
          '/js/bootstrap.bundle.min.js',
          '/js/sweetalert2.min.js',
          '/js/papaparse.min.js',
          '/icon/icon.png'
        ]);
      })
    );
  });