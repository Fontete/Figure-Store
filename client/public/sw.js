self.addEventListener('push', event => {
	const data = event.data.json()
	self.registration.showNotification(data.title, {
		body: 'New product on Kaze figure',
		icon: data.icon,
		time: new Date(Date.now()).toString(),
		actions: [
			{
				action: 'accept-action',
				title: 'View now',
				icon: data.icon,
			},
			{
				action: 'cancle-action',
				title: 'Later',
				icon: data.icon,
			},
		],
	})
})
self.addEventListener('notificationclick', event => {
	event.notification.close()
	let clickResponsePromise = Promise.resolve()
	switch (event.action) {
		case 'accept-action':
			clickResponsePromise = clients.openWindow('http://localhost:5000/')
			break
		case 'cancle-action':
			break
		default:
			clickResponsePromise = clients.openWindow('http://localhost:5000/')
			break
	}
	event.waitUntil(
		Promise.all([
			clickResponsePromise,
			window.self.analytics.trackEvent('notification-click'),
		]),
	)
})

self.addEventListener('notificationclose', event => {
	event.waitUntil(
		Promise.all([window.self.analytics.trackEvent('notification-close')]),
	)
})
