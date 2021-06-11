import Rebase from "re-base";
import firebase from "firebase";
import "firebase/database";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyDI4pgzvSUdvbom87dTAd_Oi2iC_1sXD-A",
	authDomain: "very-hot-burgers-6eb15.firebaseapp.com",
	databaseURL: "https://very-hot-burgers-6eb15-default-rtdb.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
