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
  Tile,
  Icon,
  Button,
  ListItem,
  Avatar,
} from 'react-native-elements';
import { ExpoConfigView } from '@expo/samples';
import { API_URL } from '../constants/apiSource';


export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sessionID: '',
      email: '',
      mealArray: [],
      refreshing: false,
    }

    this.renderMealCards = this.renderMealCards.bind(this);


  }
  static navigationOptions = {
    title: 'Profile',
  };

  componentWillMount(){
    this.setState({ refreshing: true});

    getUserEmail().then((addy)=>{
      this.setState({email: addy});
    });
    getSessionID().then((id)=>{
      this.setState({sessionID: id},
      () =>{
        //console.log(this.state.sessionID);
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
        });
      });
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    fetch(API_URL+'/api/meals/getOpenMeals', {
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
          this.setState({ mealArray: response.data });
          //console.log(response.data[0]);
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

  onPressed(meal){
    this.props.navigation.navigate(
      'Meal',
      {mealObj: meal, callbackRefresh: this._onRefresh}
    );
  }

  renderMealCards() {
    if (this.state.mealArray.length < 1){
      return(
        <Card 
          featuredTitle="No meals to display" 
          image={require('../assets/images/food/meal-placeholder.png')}>
          <Text style={{alignSelf:'center', fontSize:16}}>Check back later!</Text>
        </Card>
        
        )
    }
    return (

      this.state.mealArray.map((c, i) => {
        return [
        <TouchableOpacity key={i} onPress={() => this.onPressed(this.state.mealArray[i])} >
          <Card
            image={{ uri: c.image }}
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
            
          </Card>
          </TouchableOpacity>
        ]
      })
    );
  }


  render() {
    return (
      <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />}
      >
      <View style={{ paddingVertical: 20 }}>
        <Card title={"Welcome!"}>
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
            <Text style={{ color: "white", fontSize: 28 }}>{this.state.email[0]}</Text>
          </View>
          <Text style={{ alignSelf: "center", fontSize: 13, marginBottom:20 }}>{"SessionID: "+this.state.sessionID}</Text>
          <Text style={{ alignSelf: "center", fontSize: 13, marginBottom:20 }}>{"Email: "+this.state.email}</Text>

          <Button
            backgroundColor="#03A9F4"
            title="SIGN OUT"
            onPress={() => onSignOut(this.state.sessionID).then(() => this.props.navigation.navigate('SignedOut'))}
          />
        </Card>
      </View>
      <View style={{marginTop:15}} >
        <Text style={{marginLeft:15}} h2>Your Meals</Text>
        {this.renderMealCards()} 
      </View>
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
