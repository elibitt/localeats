import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Card, Button, Input } from 'react-native-elements';
import { onSignIn } from "../auth";

export default ({ navigation }) => (
	<View style={{ paddingVertical: 20 }}>
		<Image
	    source={require('../assets/images/logov1.png')}
	    style={styles.welcomeImage}
	  />
		<Card>
			<Input label="Email" placeholder="Email address..." />
			<Input label="Password" secureTextEntry placeholder="Password..." />
			<Input label="Confirm Password" secureTextEntry placeholder="Confirm Password..." />
			<Button
				buttonStyle={{ marginTop: 20, backgroundColor: "#03A9F4" }}
				title="SIGN UP"
				onPress={() => {
					onSignIn().then(() => navigation.navigate("SignedIn"));
				}}
			/>
			<Button
				buttonStyle={{ marginTop: 20, backgroundColor: "transparent" }}
				titleStyle={{ color: "#000" }}
				title="Have an Account? Sign In"
				onPress={() => navigation.navigate("SignIn")}
			/>
		</Card>
	</View>
);

const styles = StyleSheet.create({
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});