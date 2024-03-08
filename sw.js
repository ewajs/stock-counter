self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("v1").then(function (cache) {
      return cache.addAll([
        "stock-counter/",
        "stock-counter/index.html",
        "stock-counter/styles/styles.css",
        "stock-counter/styles/bootstrap.min.css",
        "stock-counter/styles/bootstrap-icons.min.css",
        "stock-counter/styles/fonts/bootstrap-icons.woff2",
        "stock-counter/js/reader.js",
        "stock-counter/js/bootstrap.bundle.min.js",
        "stock-counter/js/sweetalert2.min.js",
        "stock-counter/js/papaparse.min.js",
        "stock-counter/icon/icon.png",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
