import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import { firebaseAPI } from "./API";

const config = firebaseAPI;
export const app =
  firebase.apps.length > 0 ? "" : firebase.initializeApp(config);

/* firebase.firestore.setLogLevel("debug"); */
export const db = firebase.firestore();

export default { app, db };
