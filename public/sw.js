/* eslint-env serviceworker */

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        if (list.length > 0) return list[0].focus();
        return clients.openWindow("/");
      }),
  );
});

self.addEventListener("message", (e) => {
  if (e.data?.type === "CHECK_CHEQUES") {
    const cheques = e.data.cheques || [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const due = cheques.filter((c) => {
      if (c.status !== "pending") return false;
      const d = new Date(c.cashInDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === tomorrow.getTime();
    });

    due.forEach((cheque) => {
      self.registration.showNotification("Cheque due tomorrow", {
        body: `${cheque.recipient} — LKR ${Number(cheque.amount).toLocaleString()}`,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: `cheque-${cheque.id}`,
        data: { chequeId: cheque.id },
      });
    });
  }
});
