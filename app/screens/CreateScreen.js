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
  Rating,
  ButtonGroup,
  Avatar,
  Slider,
  Input,
} from 'react-native-elements';
import { getSessionID, getUserEmail } from "../auth";
import KeyboardAwareScrollView from "../components/keyboardAware/KeyboardAwareScrollView";
import { API_URL } from '../constants/apiSource';
import ImgUpload from '../components/imageUpload';
import ProfImgUpload from '../components/profileImageUpload';
import DatePicker from 'react-native-datepicker';
import GooglePlacesInput from '../components/addressInput';


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
      isMealDescValid: true,
      isMealNameValid: true,
      isMealAddressValid: true,
      isMealTimeValid: true,
      isCookNameVaild: true,
      priceIndex: 0,
      mealPrice: '',
      isLoading: false,
      formVisible: 'none',
      introVisible: '',
      imgURL: '',
      profImgURL: '',
      displayName: '',
      foundUserData: false,
      datetime: '',
      displayAddress: '',
      coordinatesObj: {"lat": '', "lng": ''},
      cookRating: 4.5,
    }
    this.submitMeal = this.submitMeal.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.saveProfImage = this.saveProfImage.bind(this);
    this.saveAddress = this.saveAddress.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);

    // getSessionID().then((id)=>{
    //   this.setState({sessionID: id});
    // });
    // getUserEmail().then((addy)=>{
    //   this.setState({email: addy});
    // });

  }
  static navigationOptions = {title: 'Create New Meal',};

  componentWillMount(){

    getUserEmail().then((addy)=>{
      this.setState({email: addy},
      () =>{
        getSessionID().then((id)=>{
          this.setState({sessionID: id},
          () =>{
            //START GET USER INFO API FETCH
            fetch(API_URL+'/api/user/getInfo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionID: this.state.sessionID,
                username: this.state.email
              })
            })
            .then(res => res.json())
            .then(response => {
              //console.log(response.data);
              if(response.success){
                //console.log(response.data);
                if(response.data.info.hasOwnProperty('displayName')){
                  this.setState({foundUserData: true, 
                        displayName:response.data.info.displayName});
                }
                if(response.data.info.hasOwnProperty('picURL')){
                  this.setState({profImgURL:response.data.info.picURL});
                }
              }
              else{
                //Alert.alert("Error! Bad server response.");
                console.log(response.data);
              }
            })
            .catch(err => {
              console.log('Error:', err);
              //Alert.alert("Error! Couldn't connect to server.");
              //this.setState({ refreshing: false });
            }); //END GET USER INFO API FETCH
          }); //set state sessionID
        }); //get sessionID        
      }); //set state email
    }); //get email
  } // componentWillMount

  updateIndex (selectedIndex) {
    this.setState({priceIndex: selectedIndex});
    if (selectedIndex == 0){
      this.setState({mealPrice: ''});
    }
  }

  saveImage(imgsrc) {
    this.setState({ imgURL: imgsrc });
  }

  saveProfImage(imgsrc) {
    this.setState({ profImgURL: imgsrc });
    //START SET USER INFO API FETCH
      fetch(API_URL+'/api/user/setInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: this.state.sessionID,
          info: {displayName: this.state.displayName,
                  picURL: imgsrc}
        })
      })
      .then(res => res.json())
      .then(response => {
        //console.log(response.data);
        if(response.success){
          //console.log(response.data);
          //this.setState({foundUserData: true});
        }
        else{
          //Alert.alert("Error! Bad server response.");
          console.log(response.data);
          //this.setState({ refreshing: false });
        }
        //console.log(response.data);
      })
      .catch(err => {
        console.log('Error:', err);
        Alert.alert("Error saving image to server.");
        //this.setState({ refreshing: false });
      });
      //END SET USER INFO API FETCH
  }

  setDisplayName(){
    //START GET USER INFO API FETCH
      fetch(API_URL+'/api/user/setInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: this.state.sessionID,
          info: {displayName: this.state.displayName,
                  picURL: this.state.profImgURL}
        })
      })
      .then(res => res.json())
      .then(response => {
        //console.log(response.data);
        if(response.success){
          console.log(response.data);
          this.setState({foundUserData: true});
        }
        else{
          //Alert.alert("Error! Bad server response.");
          console.log(response.data);
          //this.setState({ refreshing: false });
        }
        //console.log(response.data);
      })
      .catch(err => {
        console.log('Error:', err);
        Alert.alert("Error! Couldn't connect to server.");
        //this.setState({ refreshing: false });
      });
      //END GET USER INFO API FETCH
      this.setState({foundUserData: true});
  }

  saveAddress(displayAddy, coordinates) {
    this.setState({ displayAddress: displayAddy, coordinatesObj: coordinates });
  }

  showForm() {
    this.setState({ formVisible: '', introVisible: 'none' });
  }
  hideForm() {
    this.setState({ 
      formVisible: 'none', 
      introVisible: '',
      mealName: '',
      mealDesc: '',
      mealPrice: '',
      datetime: '',
      priceIndex: 0,
       });
  }

  submitMeal() {
    const { email,
            sessionID,
            mealSeats,
            mealName,
            mealDesc,
            isMealDescValid,
            isMealNameValid,
            isMealAddressValid,
            isCookNameVaild,
            imgURL,
            datetime,
            mealPrice,
            displayAddress,
            coordinatesObj,
            displayName,
            profImgURL,
            cookRating } = this.state;
    this.setState({ isLoading: true }); //set spinner

    LayoutAnimation.easeInEaseOut();
    this.setState({
      isMealNameValid: mealName.length > 1,
      isMealDescValid: mealDesc.length > 1,
      isMealAddressValid: displayAddress.length > 1,
      isMealTimeValid: datetime.length > 1,
      isCookNameVaild: displayName.length > 1
    }, () => {
      if (mealName.length > 1 && datetime.length > 1 && 
          mealDesc.length > 1 && displayAddress.length > 1 &&
          displayName.length > 1){
        //create Meal object
        const mealObject = {
          seats: mealSeats,
          address: displayAddress,
          coordinates: coordinatesObj,
          name: mealName,
          description: mealDesc,
          datetime: datetime,
          price: mealPrice > 0 ? parseInt(mealPrice) : 0,
          image: imgURL,
          cookName: displayName,
          cookPicture: profImgURL,
          cookRating: cookRating,
          cookEmail: email
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
          setTimeout(() => {
            this.hideForm();
            this.setState({ isLoading: false });
            Alert.alert("Meal was uploaded successfully!");
          }, 500);
          
        })
        .catch(err => {
          //console.error('Error:', err);
          Alert.alert("Error! Couldn't connect to server.");
          this.setState({ isLoading: false });
        });
        
      }
      else{
        this.setState({ isLoading: false })
      }

    });
  }

  priceOption() {
    return(
      <Input inputStyle={{ marginLeft: 10 }}
              placeholder={'$'+mealPrice} 
              keyboardAppearance={"light"}
              returnKeyType={'submit'}
              blurOnSubmit={true}
              value={mealPrice}
              ref={input => {(this.mealPriceInput = input);}}
              onSubmitEditing={() => this.submitMeal}
              onChangeText={mealName => this.setState({ mealPrice })}
              containerStyle={{
                marginTop: 16,
                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
              }}
              />
      )
  }

  render() {
    const {
      isLoading,
      mealSeats,
      mealName,
      mealDesc,
      isMealAddressValid,
      isMealDescValid,
      isMealNameValid,
      isCookNameVaild,
      formVisible,
      introVisible,
      priceIndex,
      mealPrice,
      displayName,
      profImgURL,
      cookRating
    } = this.state;
    const priceButtons = ["I'll keep it free", "I'd like to charge"];

    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={80} style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
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
          <Card title="Tell us about your meal!">
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
                  returnKeyType='done'
                  blurOnSubmit={true}
                  value={mealDesc}
                  ref={input => {(this.mealDescInput = input);}}
                  //onSubmitEditing={() => this.mealAddressInput.focus()}
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
          <Card title="How many people can you host?">
            <Text h3 style={{ alignSelf: "center", marginTop:25, color: '#222' }}>{this.state.mealSeats}</Text>
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
          </Card>
          <Card title="Where are you located?" >

          <GooglePlacesInput saveAddress={this.saveAddress}/>

          <Text style={{color:"red"}}>{this.state.isMealAddressValid ? "" : "Please enter an address"}</Text>

          </Card>
          <Card title="When should your guests arrive?">
            <DatePicker
            style={{width: '90%', alignSelf: "center"}}
            placeholder={"Select a date & time"}
            date={this.state.datetime}
            mode="datetime"
            format="MM-DD-YYYY HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 8,
                top: 4,
                marginLeft: 0

              },
              dateText: {
                fontSize: 18
              }
            }}
            minuteInterval={15}
            onDateChange={(datetime) => {this.setState({datetime: datetime});}}
          />
          <Text style={{color:"red"}}>{this.state.isMealTimeValid ? "" : "Please enter date & time"}</Text>

        </Card>
        <Card title="Would you like to charge for your meal?">
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={priceIndex}
            buttons={priceButtons}
            containerStyle={{height: 40, borderRadius:10}}
          />
          <Input inputStyle={{ marginLeft: 10 }}
              placeholder={'Enter price per person'} 
              keyboardAppearance={"light"}
              leftIcon={{ type: 'font-awesome', name: 'usd' }}
              keyboardType="numeric"
              returnKeyType={'done'}
              blurOnSubmit={true}
              value={mealPrice}
              ref={input => {(this.mealPriceInput = input);}}
              onChangeText={mealPrice => this.setState({ mealPrice })}
              containerStyle={{
                marginTop: 16,
                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                display: priceIndex > 0 ? 'flex':'none'
              }}
              />
        </Card>
        <Card title="About the chef">
          <ProfImgUpload 
            saveImage={this.saveProfImage}
            username={this.state.email} 
            sessionID={this.state.sessionID}/>
          {this.state.foundUserData ? 
            <View>
            <Text style={{alignSelf:'center', fontSize: 24}}>{this.state.displayName}</Text>
            <Button type="clear" title="Edit Name" 
            onPress={() => this.setState({foundUserData:false})} />
            
            </View>
            :
            <Input inputStyle={{ marginLeft: 10 }}
                    placeholder={"Please enter your name"} 
                    keyboardAppearance="light"
                    returnKeyType='done'
                    blurOnSubmit={true}
                    value={this.state.displayName}
                    ref={input => {(this.displayNameInput = input);}}
                    onSubmitEditing={this.setDisplayName}
                    onBlur={this.setDisplayName}
                    errorMessage={
                    isCookNameVaild
                      ? null
                      : 'Please enter your name'
                    }
                    onChangeText={displayName => this.setState({ displayName })}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}/>
          }


          {/*
          <Rating
            imageSize={40}
            startingValue={cookRating}
            onFinishRating={(rating)=>{this.setState({cookRating: rating})}}
            style={{marginTop:20}}
            showRating
            fractions={1}
          />*/}
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
