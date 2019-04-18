import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-session-id";

export const onSignIn = async (sessionID) => {
  try {
    await AsyncStorage.setItem(USER_KEY, sessionID);
  } catch (error) {
    console.log("Error saving sessionID to async storage");
  }
};

export const onSignOut = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.log("Error removing sessionID from async storage");
  }
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