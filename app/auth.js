import { AsyncStorage } from "react-native";
import { API_URL } from './constants/apiSource';

export const USER_KEY = "auth-session-id";
export const USER_EMAIL = "current-user-email";

export const onSignIn = async (sessionID, email) => {
  // Save session ID to storage
  console.log(sessionID);
  console.log(email);
  try {
    await AsyncStorage.multiSet([[USER_KEY, sessionID],[USER_EMAIL, email]]);
  } catch (error) {
    console.log("Error saving sessionID/email to async storage");
  }
  
};

export const onSignOut = async (id) => {
  console.log(id);
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.log("Error removing sessionID from async storage");
  }
  //send to API
	fetch(API_URL+'/api/signin/logout', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
	    sessionID: id
	  })
	}).then(res => res.json())
	.catch(err => {
		//console.error('Error:', err);
    Alert.alert("Error! Couldn't connect to server.");
	});
};

export const isSignedIn = () => {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem(USER_KEY)
			.then(res => {
				if (res !== null) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(err => reject(err));
	});
};

export const getSessionID = async () => {
	var value, collect;
  try {
    value = await AsyncStorage.getItem(USER_KEY).then(
        (item) => {
          collect = item;
        });
  } catch (error) {
    console.log("Error getting sessionID from async storage");
  }
  return collect;
};

export const getUserEmail = async () => {
	var value, collect;
  try {
    value = await AsyncStorage.getItem(USER_EMAIL).then(
        (item) => {
          collect = item;
        });
  } catch (error) {
    console.log("Error getting email from async storage");
  }
  return collect;
};