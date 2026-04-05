export const requestPermission = async () => {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
};

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    return reg;
  } catch (err) {
    console.error("SW registration failed:", err);
    return null;
  }
};

export const scheduleNotificationCheck = (cheques) => {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({ type: "CHECK_CHEQUES", cheques });
  });
};

export const setupDailyCheck = (cheques) => {
  // run once immediately on app open
  scheduleNotificationCheck(cheques);

  // then every 6 hours while app is open
  const interval = setInterval(
    () => {
      scheduleNotificationCheck(cheques);
    },
    6 * 60 * 60 * 1000,
  );

  return () => clearInterval(interval);
};
