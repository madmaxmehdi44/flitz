// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js")
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js")

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: "AIzaSyByNJBwKMofz-yj8iOs1WzQD5kx8zHbI4c",
  authDomain: "sssdsa-289e5.firebaseapp.com",
  projectId: "sssdsa-289e5",
  storageBucket: "sssdsa-289e5.appspot.com",
  messagingSenderId: "232583032985",
  appId: "1:232583032985:web:43d62cf755456e03dc0808",
  measurementId: "G-6FERCC2J63",
})

// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  }
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions)
})
