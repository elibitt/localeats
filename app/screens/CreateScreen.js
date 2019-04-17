import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Create New Meal',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Card>
          <Input label="cuisine"  placeholder="Cuisine" />
          <Input label="seats"    placeholder="Open Seats " />
          <TextInput
            label="description"
            placeholder="Describe your meal..."
            multiline={true}
            numberOfLines={4}
          />
          <Button
            buttonStyle={{ marginTop: 20, backgroundColor: "#03A9F4" }}
            title="SIGN IN"
            onPress={() => {
              onSignIn().then(() => navigation.navigate("SignedIn"));
            }}
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
});
