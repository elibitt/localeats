import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
  LayoutAnimation, 
  Keyboard,
  Dimensions,
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
  Slider,
  Input,
} from 'react-native-elements';
import { getSessionID, getUserEmail } from "../auth";
import KeyboardAwareScrollView from "../components/keyboardAware/KeyboardAwareScrollView";
import { API_URL } from '../constants/apiSource';
import ImgUpload from '../components/imageUpload';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const HERO_IMAGE = require('../assets/images/createmeal-hero.jpg');

export default class CreateScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sessionID: '',
      email: '',
      mealSeats: 2,
      mealName: '',
      mealDesc: '',
      mealAddress: '',
      isMealDescValid: true,
      isMealNameValid: true,
      isMealAddressValid: true,
      isLoading: false,
      formVisible: 'none',
      introVisible: '',
      imgURL: '',
    }
    this.submitMeal = this.submitMeal.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.saveImage = this.saveImage.bind(this);


    getSessionID().then((id)=>{
      this.setState({sessionID: id});
    });
    getUserEmail().then((addy)=>{
      this.setState({email: addy});
    });

  }
  static navigationOptions = {title: 'Create New Meal',};

  saveImage(imgsrc) {
    this.setState({ imgURL: imgsrc });
  }

  showForm() {
    this.setState({ formVisible: '', introVisible: 'none' });
  }
  hideForm() {
    this.setState({ 
      formVisible: 'none', 
      introVisible: '',
      mealName: '',
      mealDesc: ''
       });
  }

  submitMeal() {
    const { email,
            sessionID,
            mealSeats,
            mealName,
            mealDesc,
            mealAddress,
            isMealDescValid,
            isMealNameValid,
            isMealAddressValid,
            imgURL } = this.state;
    this.setState({ isLoading: true }); //set spinner

    LayoutAnimation.easeInEaseOut();
    this.setState({
      isMealNameValid: mealName.length > 1,
      isMealDescValid: mealDesc.length > 1,
      isMealAddressValid: mealAddress.length > 1
    }, () => {
      if (mealName.length > 1 && mealDesc.length > 1 && mealAddress.length > 1){
        //create Meal object
        const mealObject = {
          seats: mealSeats,
          address: mealAddress,
          name: mealName,
          description: mealDesc,
          image: imgURL
        }
        //send to API
        fetch(API_URL+'/api/meals/addMeal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionID: sessionID,
            meal: mealObject
          })
        }).then(res => res.json())
        .then(response => {
          console.log(response);
          this.setState({ isLoading: false });
        })
        .catch(err => {
          //console.error('Error:', err);
          Alert.alert("Error! Couldn't connect to server.");
          this.setState({ isLoading: false });
        });
        Alert.alert("Meal was uploaded successfully!")
        this.hideForm();
      }
      else{
        this.setState({ isLoading: false })
      }

    });
  }

  render() {
    const {
      isLoading,
      mealSeats,
      mealName,
      mealDesc,
      mealAddress,
      isMealAddressValid,
      isMealDescValid,
      isMealNameValid,
      formVisible,
      introVisible,
    } = this.state;
    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={80} style={styles.container}>
      <ScrollView>
        <View>

        <Image source={HERO_IMAGE} style={{ width: SCREEN_WIDTH, height: 200 }}/>
        </View>
          <View style={{padding: 20, alignItems:"center", marginBottom: 25, display: introVisible}}>
          <Text style={{fontSize:16, color: '#222'}}>
          Join the LocalEats community and share some food with others.
          It doesn't matter if you are a first time cook or a pro chef, offering up your food 
          is good for you and your community!
          </Text>
          <Button
            buttonStyle={styles.submitButton}
            containerStyle={{ marginTop: 32, flex: 0 }}
            activeOpacity={0.8}
            title='CREATE A NEW MEAL'
            onPress={this.showForm}
            titleStyle={styles.submitTextButton}
            loading={isLoading}
            disabled={isLoading}
          />
          </View>
        <View style={{display: formVisible}}>
        <Card>
            <ImgUpload saveImage={this.saveImage}/>
          </Card>
          <Card>
            <Input inputStyle={{ marginLeft: 10 }}
                    placeholder={"What's on the menu?"} 
                    keyboardAppearance="light"
                    returnKeyType='next'
                    blurOnSubmit={true}
                    value={mealName}
                    ref={input => {(this.mealNameInput = input);}}
                    onSubmitEditing={() => this.mealDescInput.focus()}
                    onChangeText={mealName => this.setState({ mealName })}
                    errorMessage={
                      isMealNameValid
                        ? null
                        : 'Please enter a name'
                    }
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}/>
              <Input inputStyle={{ marginLeft: 10, height: 120,  }}
                    placeholder={'Add some more detail here...'}
                    multiline={true}
                    keyboardAppearance="light"
                    returnKeyType='next'
                    blurOnSubmit={true}
                    value={mealDesc}
                    ref={input => {(this.mealDescInput = input);}}
                    onSubmitEditing={() => this.mealAddressInput.focus()}
                    onChangeText={mealDesc => this.setState({ mealDesc })}
                    errorMessage={
                      isMealDescValid
                        ? null
                        : 'Please enter a description'
                    }
                    inputContainerStyle={{borderBottomColor:'rgba(0, 0, 0, 0)'}}
                    containerStyle={{
                      marginTop: 16,
                      borderWidth: 1,
                      borderColor: '#ddd',
                    }}/>
              </Card>
              <Card>
              <Text h3 style={{ alignSelf: "center", marginTop:25, color: '#222' }}>Seats Available: {this.state.mealSeats}</Text>
              <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', marginBottom: 10 }}>
                <Slider
                  value={mealSeats}
                  onValueChange={mealSeats => this.setState({ mealSeats })}
                  minimumValue={1}
                  maximumValue={12}
                  step={1}
                  animateTransitions={true}
                  animationType='spring'
                  thumbTintColor='#03A9F4'
                />
              </View>
              <Input inputStyle={{ marginLeft: 10 }}
                    placeholder={"Enter your address"} 
                    keyboardAppearance="light"
                    returnKeyType='done'
                    blurOnSubmit={true}
                    value={mealAddress}
                    ref={input => {(this.mealAddressInput = input);}}
                    onChangeText={mealAddress => this.setState({ mealAddress })}
                    errorMessage={
                      isMealAddressValid
                        ? null
                        : 'Please enter an address'
                    }
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}/>
            
          </Card>
          <View style={{alignItems:"center", marginBottom: 25}}>
          <Button
            buttonStyle={styles.submitButton}
            containerStyle={{ marginTop: 32, flex: 0 }}
            activeOpacity={0.8}
            title='CREATE MEAL'
            onPress={this.submitMeal}
            titleStyle={styles.submitTextButton}
            loading={isLoading}
            disabled={isLoading}
          />
          </View>
          </View>
        
          </ScrollView>
      </KeyboardAvoidingView>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
      },
  innerContainer: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  submitButton: {
  backgroundColor: '#03A9F4',
  borderRadius: 10,
  height: 50,
  width: SCREEN_WIDTH-30,
  },
  submitTextButton: {
  fontSize: 16,
  color: 'white',
  fontWeight: 'bold',
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    //justifyContent: 'center',
    paddingTop: 120,
    alignItems: 'center',
  },
});
