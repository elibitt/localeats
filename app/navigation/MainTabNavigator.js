import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MealScreen from '../screens/MealScreen';

const HomeStack = createStackNavigator({
	Home: HomeScreen,
	Meal: MealScreen,
});

HomeStack.navigationOptions = {
	tabBarLabel: 'Home',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? 'ios-home'
					: 'md-home'
			}
		/>
	),
};

const CreateStack = createStackNavigator({
	Create: CreateScreen,
});

CreateStack.navigationOptions = {
	tabBarLabel: 'Create',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-add-circle${focused ? '' : '-outline'}`
					: 'md-add-circle'
			}
		/>
	),
};

const ProfileStack = createStackNavigator({
	Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
	tabBarLabel: 'Profile',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
		/>
	),
};

export default createBottomTabNavigator({
	HomeStack,
	CreateStack,
	ProfileStack,
});
