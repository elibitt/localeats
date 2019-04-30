import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';import { Card, Button, Input, Icon } from 'react-native-elements';
import { API_URL } from '../constants/apiSource';

import { onSignIn } from "../auth";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../assets/images/login-bg.jpg');


export default class SignUp extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: '',
      password: '',
      fontLoaded: true, //edit later to add fonts
      isLoading: false,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
		}
		//this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);

	}

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleAPIRes(res) {
  	if (res.success){
  		console.log(JSON.stringify(res.sessionID));
      onSignIn(res.sessionID, this.state.email);
  		LayoutAnimation.easeInEaseOut();
    	this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate("SignedIn");
  	}
  	else{
  		console.log(JSON.stringify(res.data));
  		Alert.alert(JSON.stringify(res.data));
  		LayoutAnimation.easeInEaseOut();
    	this.setState({isLoading: false});
  	}
  	
  }

  signUp() {
    const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true }); //set spinner

    LayoutAnimation.easeInEaseOut();
    this.setState({
      isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
      isPasswordValid: password.length >= 6 || this.passwordInput.shake(),
      isConfirmationValid:
        password === passwordConfirmation || this.confirmationInput.shake(),
    }, () => {
			
    	if (this.state.isEmailValid && this.state.isPasswordValid 
    	&& this.state.isConfirmationValid){
	    	//send to API
		    fetch(API_URL+'/api/signin/register', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		      },
		      body: JSON.stringify({
		        username: email,
		        password: password
		      })
		    }).then(res => res.json())
		    .then(response => this.handleAPIRes(response))
		    .catch(error => {
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
	
	render() {
		const {
      isLoading,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
      email,
      password,
      passwordConfirmation,
    } = this.state;
	return(
		<View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          {this.state.fontLoaded ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
              <KeyboardAvoidingView
                contentContainerStyle={styles.loginContainer}
                behavior="position"
                keyboardVerticalOffset={10}
              >
                <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleText}>Welcome to LocalEats!</Text>
                  </View>
                  <View style={{ marginTop: -10, marginLeft: 10 }}>
                    <Text style={styles.titleText2}>Let's get started...</Text>
                  </View>
                </View>
                  <Input
                    leftIcon={
                      <Icon
                        name="envelope-o"
                        type="font-awesome"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    value={email}
                    keyboardAppearance="light"
                    autoFocus={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    inputStyle={{ marginLeft: 10 }}
                    placeholder={'Email'}
                    containerStyle={{
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}
                    ref={input => (this.emailInput = input)}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    onChangeText={email => this.setState({ email })}
                    errorMessage={
                      isEmailValid ? null : 'Please enter a valid email address'
                    }
                  />
                  <Input
                    leftIcon={
                      <Icon
                        name="lock"
                        type="simple-line-icon"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    value={password}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    returnKeyType='next'
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}
                    inputStyle={{ marginLeft: 10 }}
                    placeholder={'Password'}
                    ref={input => (this.passwordInput = input)}
                    onSubmitEditing={() => this.confirmationInput.focus()}
                    onChangeText={password => this.setState({ password })}
                    errorMessage={
                      isPasswordValid
                        ? null
                        : 'Please enter at least 6 characters'
                    }
                  />
                    <Input
                      leftIcon={
                        <Icon
                          name="loop"
                          type="simple-line-icon"
                          color="rgba(0, 0, 0, 0.38)"
                          size={25}
                          style={{ backgroundColor: 'transparent' }}
                        />
                      }
                      value={passwordConfirmation}
                      secureTextEntry={true}
                      keyboardAppearance="light"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                      containerStyle={{
                        marginTop: 16,
                        borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                      }}
                      inputStyle={{ marginLeft: 10 }}
                      placeholder={'Confirm password'}
                      ref={input => (this.confirmationInput = input)}
                      onSubmitEditing={this.signUp}
                      onChangeText={passwordConfirmation =>
                        this.setState({ passwordConfirmation })
                      }
                      errorMessage={
                        isConfirmationValid
                          ? null
                          : 'Please enter the same password'
                      }
                    />
                  <Button
                    buttonStyle={styles.loginButton}
                    containerStyle={{ marginTop: 32, flex: 0 }}
                    activeOpacity={0.8}
                    title='SIGN UP'
                    onPress={this.signUp}
                    titleStyle={styles.loginTextButton}
                    loading={isLoading}
                    disabled={isLoading}
                  />
                  <View style={styles.signInContainer}>
                <Button
                  title={'Already have an account? Sign In'}
                  titleStyle={{ color: 'black' }}
                  buttonStyle={{ backgroundColor: 'transparent' }}
                  underlayColor="transparent"
                  onPress={() => this.props.navigation.navigate("SignIn")}
                />
              </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            </TouchableWithoutFeedback>

          ) : (
            <Text>Loading...</Text>
          )}
        </ImageBackground>

      </View>

	);
	  }};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    alignItems: 'center',
    //justifyContent: 'center',
    flex: 1,
  },
  loginTextButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'rgba(232, 147, 142, 1)',
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  titleContainer: {
    marginBottom: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, .95)',
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 22,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    //fontFamily: 'light',
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: 'black',
    fontSize: 30,
    //fontFamily: 'regular',
  },
  titleText2: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    //fontFamily: 'regular',
  },
  signInContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});