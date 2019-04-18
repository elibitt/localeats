import React from 'react';
import { Card, Button } from "react-native-elements";
import { onSignOut, getSessionID } from "../auth";


import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sessionID: '',
    }

    getSessionID().then((id)=>{
      this.setState({sessionID: id});
    });

  }
  static navigationOptions = {
    title: 'Profile',
  };


  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="John Doe">
          <View
            style={{
              backgroundColor: "#bcbec1",
              alignItems: "center",
              justifyContent: "center",
              width: 81,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
          </View>
          <Text style={{ alignSelf: "center", fontSize: 13, marginBottom:20 }}>{"SessionID: "+this.state.sessionID}</Text>
          <Button
            backgroundColor="#03A9F4"
            title="SIGN OUT"
            onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}
          />
        </Card>
      </View>
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
