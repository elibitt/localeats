import React from 'react';
import { onSignOut, getSessionID, getUserEmail } from "../auth";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Text,
  Image,
  Rating,
  Card,
  Input,
  Tile,
  Icon,
  ButtonGroup,
  Button,
  ListItem,
  Avatar,
} from 'react-native-elements';
import { ExpoConfigView } from '@expo/samples';
import { API_URL } from '../constants/apiSource';
import ImgUpload from '../components/profileImageUpload';
import Dialog from "react-native-dialog";


export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sessionID: '',
      email: '',
      mealArray: [],
      refreshing: false,
      foundUserData: false,
      displayName: '',
      imgURL: '',
      dialogVisible: false,
      delMealID: '',
      optionIndex: 0
    }

    this.renderMealCards = this.renderMealCards.bind(this);
    this.logout = this.logout.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
    this.updateIndex = this.updateIndex.bind(this);


  }
  static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile',
            headerLeft: null,
            headerRight: (
                <Button 
                type='clear' 
                onPress={navigation.getParam('logout')} //call that function in onPress using getParam which we already set in componentDidMount
                style={{marginRight: 10}}
                title="Sign Out">
                </Button>
            )
        };
    };

  componentWillMount(){
    this.setState({ refreshing: true});

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
                  this.setState({imgURL:response.data.info.picURL});
                }
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
            //START GET MY MEALS API FETCH
            fetch(API_URL+'/api/meals/getMyMeals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionID: this.state.sessionID,
              })
            })
            .then(res => res.json())
            .then(response => {
              //console.log(response.data);
              if(response.success){
                this.setState({ refreshing: false, mealArray: response.data });
              }
              else{
                Alert.alert("Error! Bad server response.");
                this.setState({ refreshing: false });
              }
              //console.log(response.data);
            })
            .catch(err => {
              //console.error('Error:', err);
              Alert.alert("Error! Couldn't connect to server.");
              this.setState({ refreshing: false });
            });//END GET MY MEALS API FETCH
          }); //set state sessionID
        }); //get sessionID        
      }); //set state email
    }); //get email
  } // componentWillMount

  componentDidMount() {
    this.props.navigation.setParams({ logout: this.logout });
  }

  logout = () => {
    onSignOut(this.state.sessionID).then(
      () => this.props.navigation.navigate('SignedOut')
    );
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
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
          this.setState({imgURL:response.data.info.picURL});
        }
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
    fetch(API_URL+'/api/meals/getMyMeals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionID: this.state.sessionID,
          })
        })
        .then(res => res.json())
        .then(response => {
          //console.log(response.data);
          if(response.success){
                this.setState({ mealArray: response.data });
              }
              else{
                Alert.alert("Error! Bad server response.");
                console.log(response.data);
              }
          setTimeout(() => {
            console.log('Done Refreshing');
            this.setState({ refreshing: false });
          }, 500);
        })
        .catch(err => {
          console.log('Error:', err);
          Alert.alert("Error! Couldn't connect to server.");
          this.setState({ refreshing: false });
        });
  }

  updateIndex (selectedIndex) {
    this.setState({optionIndex: selectedIndex});
  }

  convertMonth(datetime){
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
      ];
    var m = datetime.split('-');
    m = parseInt(m[0]);
    return(monthNames[m-1]);
  }
  convertDay(datetime){
    var m = datetime.split('-');
    m = parseInt(m[1]);
    return(m);
  }

  saveImage(imgsrc) {
    this.setState({ imgURL: imgsrc });
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
        Alert.alert("Error saving image to server.");
        //this.setState({ refreshing: false });
      });
      //END SET USER INFO API FETCH
  }

  onPressed(meal){
    this.props.navigation.navigate(
      'Meal',
      {mealObj: meal, callbackRefresh: this._onRefresh}
    );
  }

  showDialog(mealID) {
    this.setState({ dialogVisible: true, delMealID:mealID });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  deleteMeal(mealID){
    this.setState({ dialogVisible: false });
    //START DELETE MEAL API CALL
      fetch(API_URL+'/api/meals/deleteMeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: this.state.sessionID,
          mealID: mealID
        })
      })
      .then(res => res.json())
      .then(response => {
        //console.log(response.data);
        if(response.success){
          //console.log(response.data);
          this._onRefresh();
          Alert.alert("Meal deleted successfully");
        }
        else{
          Alert.alert("Error deleting meal. Try again.");
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
  }

  setDisplayName(){
    //START SET USER INFO API FETCH
      fetch(API_URL+'/api/user/setInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: this.state.sessionID,
          info: {displayName: this.state.displayName,
                  picURL: this.state.imgURL}
        })
      })
      .then(res => res.json())
      .then(response => {
        //console.log(response.data);
        if(response.success){
          //console.log(response.data);
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

  renderMealCards() {
    if (this.state.mealArray.length < 1){
      return(
        <Card 
          featuredTitle="You dont have any meals yet!" 
          image={require('../assets/images/food/meal-placeholder.png')}>
          <Text style={{alignSelf:'center', fontSize:16}}>Create one now!</Text>
        </Card>
        
        )
    }
    console.log(this.state.mealArray);
    return (

      this.state.mealArray.map((c, i) => {
        return [
        <TouchableOpacity key={i} onPress={() => this.onPressed(this.state.mealArray[i])} >
          <Card
            image={c.image != '' ? { uri: c.image} : require('../assets/images/food/meal-placeholder.png') } 
            featuredTitle={c.price > 0 ? "$"+c.price.toString() : "FREE"}
            featuredTitleStyle={{
              alignSelf:'flex-end', bottom:45, marginRight:10,
              backgroundColor:'#333', fontSize:28}}>
            <Text h4>{c.name}</Text>
            <View style={{
                      flex: 1, 
                      flexDirection: 'row', 
                      justifyContent: 'space-between',
                      marginTop:10}} >
              <View style={{
                flex: 1, 
                flexDirection: 'row', alignItems: 'center'}}>
                <Avatar
                  rounded
                  size="medium"
                  title={c.cookName.charAt(0)}
                  source={ c.cookPicture == "" ? {} : {uri:c.cookPicture} }
                />
                <View style={{marginLeft:10, overflow:'none', alignItems:'flex-start'}}>
                <Text style={{fontSize:18}}>{c.cookName}</Text>
                <Rating
                  imageSize={20}
                  readonly
                  startingValue={c.cookRating}
                  style={{ marginTop:3 }}
                />
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row',width:'50%'}}>
                <View style={{
                  flex: 1, flexDirection: 'row', 
                  justifyContent: 'flex-end', alignItems:'center',
                  }}>
                <Icon name='user' 
                      type='font-awesome'
                      color='#555'
                      size={30}
                />
                <Text style={{fontSize:30, marginLeft:6 }}>{c.openSeats}</Text>
                </View>
                <View style={{
                  flex: 1, flexDirection: 'row', 
                  justifyContent:'center', }}>
                  <Icon name='calendar-o' 
                      type='font-awesome'
                      color='#555'
                      size={55}
                      style={{marginTop:0}}
                />
                <Text style={{position:'absolute', fontSize:14, top:18}}>{this.convertMonth(c.datetime)}</Text>
                <Text style={{position:'absolute',fontSize:20, top:30}}>{this.convertDay(c.datetime)}</Text>
                </View>
              </View>
            </View>
            <Button
            backgroundColor="#03A9F4"
            style={{marginTop:7}}
            title="EDIT MEAL"
            onPress={() => Alert.alert("This feature is coming soon!")}
          />
          <Button
            buttonStyle={{backgroundColor: "#C0392B"}}
            style={{marginTop:7}}
            title="DELETE MEAL"
            onPress={() => this.showDialog(c._id)}
          />
            
          </Card>
          </TouchableOpacity>
        ]
      })
    );
  }


  render() {
    const optionButtons = ["Your Meals", "Your Reservations"];

    return (
      <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />}
      >
      <View style={{ paddingVertical: 20}}>
        <Card title={"User Profile"}>
        <View style={{alignItems: 'center', marginBottom:10}}>
          <ImgUpload 
            saveImage={this.saveImage}
            username={this.state.email} 
            sessionID={this.state.sessionID}/>
        </View>
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
                    onChangeText={displayName => this.setState({ displayName })}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}/>
          }
          <Text style={{ alignSelf: "center", fontSize: 18, marginTop:10 }}>{this.state.email}</Text>
          <Text style={{ marginTop: 15, alignSelf: "center", fontSize: 12, marginBottom:5 }}>{"SessionID: "+this.state.sessionID}</Text>
          
        </Card>
      </View>
      <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.optionIndex}
            buttons={optionButtons}
            containerStyle={{height: 40, borderRadius:10}}
          />
      <View style={{
                marginTop: 15,
                display: this.state.optionIndex == 0 ? 'none':'flex'}} >
        <Text style={{marginLeft:15}} h2>Your Reservations</Text>
        <Text style={{marginLeft:15}} h4>Coming soon!</Text>
      </View>
      <View style={{marginTop:15, display: this.state.optionIndex == 0 ? 'flex':'none'}} >
        <Text style={{marginLeft:15}} h2>Your Meals</Text>
        {this.renderMealCards()} 
      </View>
      <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone.
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Delete" onPress={() => this.deleteMeal(this.state.delMealID)} />
        </Dialog.Container>
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
