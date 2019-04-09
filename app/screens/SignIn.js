import React from "react";
import { View } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";

export default ({ navigation }) => (
	<View style={{ paddingVertical: 20 }}>
		<Card>
			<Input label="Email" placeholder="Email address..." />
			<Input label="Password" secureTextEntry placeholder="Password..." />
			<Button
				buttonStyle={{ marginTop: 20, backgroundColor: "#03A9F4" }}
				title="SIGN IN"
				onPress={() => {
					onSignIn().then(() => navigation.navigate("SignedIn"));
				}}
			/>
		</Card>
	</View>
);