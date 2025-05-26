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

