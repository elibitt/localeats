import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
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
} from 'react-native-elements';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'LocalEats',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/logov1.png')}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Welcome to LocalEats</Text>
          </View>
          <View>
          <Card
            image={require('../assets/images/food/burrito.jpg')}>
            <Text h4>Authentic Mexican Burritos</Text>
            <Text style={{marginBottom: 10}}>
              A generations-old recipe, each burrito is crafted carefully just for you!
            </Text>
            <Button
              icon={<Icon type='ionicon' name='ios-clipboard' color='#ffffff' iconStyle={{marginRight:10}}/>}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='RESERVE THIS MEAL' />
          </Card>
          <Card
            image={require('../assets/images/food/avo.jpg')}>
            <Text h4>Avocado Toast</Text>
            <Text style={{marginBottom: 10}}>
              You know you want it.
            </Text>
            <Button
              icon={<Icon type='ionicon' name='ios-clipboard' color='#ffffff' iconStyle={{marginRight:10}}/>}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='RESERVE THIS MEAL' />
          </Card>
          <Card
            image={require('../assets/images/food/pancakes.jpg')}>
            <Text h4>Pancakes!</Text>
            <Text style={{marginBottom: 10}}>
              Fluffy and delicious!
            </Text>
            <Button
              icon={<Icon type='ionicon' name='ios-clipboard' color='#ffffff' iconStyle={{marginRight:10}}/>}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='RESERVE THIS MEAL' />
          </Card>

          </View>

        </ScrollView>

      </View>
    );
  }


  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://www.google.com');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://www.google.com'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});
