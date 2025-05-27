# browser_thumbprint

* But aren't there enough things called `something-'fingerprint'` for browsers?

    Yes, but ...

    All of these are focussed on identifying the user, not the browser itself.

* But why would you want to identify the browser?

    Two words: *"Push Notifications"*
    
    More on that below in [PWAs and Push Notifications](#pwas-and-push-notifications), but the key point is:

    **Users don't subscribe to push notifications, browsers do.**

For those looking to use a 'browser fingerprint' as a proxy for identifying a user, this isn't the library for you. Please check [Origins and Alternatives](#origins-and-alternatives) below for a couple of alternatives you may wish to consider.

For those of you still here, welcome, let's get on with things.

## Installation
| Your preferred installer | Command |
| :------------------- | ----------: |
| npm             | `npm i browser_thumbprint` |
| yarn            | `yarn add browser_thumbprint` |
| pnpm            | `pnpm add browser_thumbprint` |
| bun             | `bun add browser_thumbprint` |

## Usage

`browser_thumbprint` is only intended to run in the browser.

`setThumbprint()` is intended to execute when the browser is idle. So there will always be some short delay.

The minimum delay will depend on multiple factors related to whichever browser is executing this code. Minimum can be as little as 20ms, but 600ms is recommended for almost all browsers.

If `getThumbprint()` is called too early (for this browser to have finished running `setThumbprint()`) then it will return an empty string. So you can use a simple falsey test to identify this situation.

If `getThumbprint()` returns a non-empty string this is a 'thumbprint' that you can use to consistently identify this browser.

Occasionally, if the user makes some significant change to their browser and/or OS settings then a new thumbprint may result. If that happens then the previous browser thumbprint will be invalid, and any push notfication token associated with it will be rendered unusable. You should always check for this scenario and if necessary request a new push notification token from the browser.

### Example
``` javascript
import { getThumbprint, setThumbprint } from "browser_thumbprint";

setThumbprint();

setTimeout(() => {
    const thumbprint = getThumbprint();
    if (!thumbprint) {
        console.warn("This browser needs more time to set the thumbprint");
    }
    // Now that you have your thumbprint you need to get it to your server somehow
    // The browser thumbprint will need to be recorded with the push notification subscription token returned by this browser on your server.
}, 600);
```

### Service Workers and Push Notifications

I would strongly recommend that you check out [Mozilla's documentation on Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) for an overview.

The basic process to subscribe to push notifications, not allowing for revoked permissions for subscriptions etc., is as follows:
* get the service worker
* ask for any existing subscription token, or
* ask for a new subscription token
  * ask the server for its VAPID key details
  * using the server's public key, ask the service worker to subscribe to get a new subscription token
* send the subscription token details plus the browser thumbprint (plus some other info) back to the server, for it to use for push notifications

This is glossing over an enormous amount of detail.

## PWAs and Push Notifications

PWAs (Progressive Web Apps) are quite awesome. They let your web page function as an app that the user can 'install', and that app has powers that a regular web page does not, including supporting push notifications.

But there's a catch - actually there's several. Here's an incomplete list:

* Your user has to opt-in to push notifications. You can't just shove a notification at them without asking.
* When you send your user a push notification, it does not go directly to them, it goes via a service.
* To get this service to accept the push notification you have to include a special subscription token. And of course that token came from the user when they opted-in for push notifications.

And ... what's written above is probaby like what you've already read about push notifications, and it's also largely false, because it's actually written from the wrong perspective.

* That service that you send the push notifications through - is provided by the browser manufacturer (or some delegate).
* The user doesn't really opt-in to receive push notifications - instead what really happens is
    * The user gives permission to their browser to opt-in to push notifications.
* When the user gives that permission, the browser gets back the subscription token from that service, and you need that token back on your server to send the push notifications.
* Your server needs to keep track of the relationship between the user, their browsers, and each browser's subscription token.
* Per browser and PWA (URL), no more than one subscription token will ever be valid at any given time.
* Send too many push notifications using out-of-date or incorrect tokens and you can find all push notfications going via that service blocked. Because as far as the service is concerned, you're a spammer.
* It's best to pre-emptively remove/deprecate subscription tokens you know to be out-of-date or invalid rather than throwing them at the service and seeing if they fail. Because every failure counts towards the limits imposed by the service - and they can (and do) change those limits. 

**Users don't subscribe to push notifications, browsers do.**

All of which means you need to identify the browser (and manage the subscription tokens), much more than you need to identify the user.

Hence the reason for a browser fingerprint/thumbprint library that actually focusses on identifying the browser.

## Origins and Alternatives

This library started life as a derivative of [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs). With [V2](https://github.com/fingerprintjs/fingerprintjs/tree/v2) it pretty much did everything desired for identifying a browser. But then with `V3` they totally focussed on identifying users, browsers - not so much.

There's also [browser_fingerprint](https://github.com/actionhero/browser_fingerprint) which has been around a long time, but thankfully still seems to be maintained. Plus several others that seem to be derivatives/forks, some better maintained than others.

