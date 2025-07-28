const firebaseConfig = {
    apiKey: "AIzaSyBbqrvLJjj2yLkZ8TtnUnididsVVHDM_58",
    authDomain: "infostar-education.firebaseapp.com",
    projectId: "infostar-education",
    storageBucket: "infostar-education.appspot.com",
    messagingSenderId: "744791526573",
    appId: "1:744791526573:web:c7e7e539f089f2fe41ca24",
    measurementId: "G-Q90L381XBK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);