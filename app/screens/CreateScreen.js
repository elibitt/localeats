import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Picker,
} from 'react-native';
import {
  Text,
  Image,
  Card,
  Tile,
  Icon,
  Button,
  ListItem,
  Avatar,
  Input,
} from 'react-native-elements';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Create New Meal',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Card image={require('../assets/images/food/meal-placeholder.png')}>
            <Button
              icon={<Icon type='ionicon' name='ios-add-circle' color='#ffffff' iconStyle={{marginRight:10}}/>}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Upload an Image' />
          </Card>
          <Card >
            <Input inputStyle={{ marginLeft: 10 }}
                    placeholder={'Name your meal'} 
                    keyboardAppearance="light"
                    returnKeyType='next'
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}/>
              <Input inputStyle={{ marginLeft: 10, height: 120,  }}
                    placeholder={'Describe your meal'} 
                    multiline={true}
                    keyboardAppearance="light"
                    returnKeyType='next'
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      backgroundColor:"#eee",
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',

                    }}/>
                <Text h3 style={{ alignSelf: "center", marginTop:25 }}>How many portions?</Text>
                <Picker
                  selectedValue={4}
                  style={{width: "100%"}}>
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                </Picker>

            
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
