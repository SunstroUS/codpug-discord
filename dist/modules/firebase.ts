import * as admin from "firebase-admin";

const serviceAccount = require("../../firebase.config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin.firestore();
