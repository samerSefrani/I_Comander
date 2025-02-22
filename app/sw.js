/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');


if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.precaching.precacheAndRoute([
        'style/main.css',
        'demo-index.html',
        'js/idb-promised.js',
        'js/main.js',
        'images/**/*.*',
        'manifest.json',
    ]);


    workbox.routing.registerRoute(
        /\/api\/kier_secret$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'data-cache',
        })
    );
    workbox.routing.registerRoute(
        /\.html$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'html-cache',
        })
    );
    workbox.routing.registerRoute(
        /\.css$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'css-cache',
        })
    );
    workbox.routing.registerRoute(
        /\.js$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'js-cache',
        })
    );

    workbox.routing.registerRoute(
        /profile$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'page-cache',
        })
    );
    workbox.routing.registerRoute(
        /(\/$|index$)/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'page-cache',
        })
    );

    workbox.routing.registerRoute(
        /dashboard$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'page-cache',
        })
    );

    workbox.routing.registerRoute(
        /login$/,
        new workbox.strategies.NetworkOnly({
            cacheName: 'page-cache',
        })
    );
    workbox.routing.registerRoute(
        /add_checklist$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'page-cache',
        })
    );

    workbox.routing.registerRoute(
        /checklist$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'page-cache',
        })
    );


    const showNotification = () => {
        self.registration.showNotification('Background sync success!', {
            body: '🎉`🎉`🎉`'
        });
    };

    const bgSyncPlugin = new workbox.backgroundSync.Plugin(
        'dashboardr-queue',
        {
            callbacks: {
                queueDidReplay: showNotification
                // other types of callbacks could go here
            }
        }
    );

    const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin],
    });

    workbox.routing.registerRoute(
        /\/api\/add/,
        networkWithBackgroundSync,
        'POST'
    );

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
