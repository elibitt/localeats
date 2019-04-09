import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";


const headerStyle = {
  marginTop: 0
};

// export default createAppContainer(createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Main: MainTabNavigator,
// }));

export const SignedOut = createStackNavigator({
  SignUp: {
	screen: SignUp,
	navigationOptions: {
	  title: "Sign Up",
	  headerStyle
	}
  },
  SignIn: {
	screen: SignIn,
	navigationOptions: {
	  title: "Sign In",
	  headerStyle
	}
  }
});

export const SignedIn = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
});


export const createRootNavigator = (signedIn = false) => {
  return createAppContainer(createSwitchNavigator(
	{
	  SignedIn: {
		screen: SignedIn
	  },
	  SignedOut: {
		screen: SignedOut
	  }
	},
	{
	  initialRouteName: signedIn ? "SignedIn" : "SignedOut"
	}
  ));
};