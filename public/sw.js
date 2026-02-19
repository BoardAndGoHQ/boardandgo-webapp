self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || 'BoardAndGo Update';
  const body = payload.body || 'You have a new flight notification.';
  const notificationId = payload.notificationId || '';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      data: {
        notificationId,
      },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        const client = clientList[0];
        if (client) {
          client.focus();
          client.navigate('/dashboard');
        }
        return undefined;
      }
      return clients.openWindow('/dashboard');
    })
  );
});
