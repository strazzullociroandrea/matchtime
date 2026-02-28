self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const {
    title = "Aggiornamento del calendario.",
    body = "È stato rilevato un aggiornamento del calendario!",
    icon = "./logo.png",
    badge = "./logo.png",
    tag = "posts-new",
    url = "/",
    data: notificationData = {},
  } = data;

  const options = {
    body,
    icon,
    badge,
    tag,
    requireInteraction: true,
    data: {
      ...notificationData,
      url,
    },
    actions: [
      {
        action: "open",
        title: "View Post",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const data = event.notification.data || {};
  const urlToOpen = data.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const existing = clientList.find(
          (client) => client.url.includes(urlToOpen) && "focus" in client,
        );

        if (existing) {
          return existing.focus();
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
