import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
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
import { WebBrowser } from 'expo';
import { API_URL } from '../constants/apiSource';
import { MonoText } from '../components/StyledText';
import { getSessionID, getUserEmail } from "../auth";
import Dialog from "react-native-dialog";



export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      sessionID: '',
      email: '',
      mealObj: this.props.navigation.getParam('mealObj', {}),
      dialogVisible: false,
      resSeats: '',
      refreshing: false,
      alertText: '',
      alertVisible: 'none'
    }
    
    getSessionID().then((id)=>{
      this.setState({sessionID: id});
    });
    getUserEmail().then((addy)=>{
      this.setState({email: addy});
    });

    this.convertMonth = this.convertMonth.bind(this);
    this.convertDay = this.convertDay.bind(this);
    this.convertYear = this.convertYear.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.handleReservation = this.handleReservation.bind(this);

  }
  static navigationOptions = {
    title: 'Meal Info',
  };
  _onRefresh = () => {
    setTimeout(() => {
            console.log('Done Refreshing');
            this.setState({ refreshing: false });
          }, 500);
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
 
  handleDialogSubmit = () => {
    // The user has pressed the "Reserve" button
    this.setState({ dialogVisible: false });
    this.handleReservation(this.state.mealObj._id, parseInt(this.state.resSeats));
  };

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
  convertYear(datetime){
    var m = datetime.split('-');
    m = m[2].split(' ');
    m = m[0];
    return(m);
  }
  convertTime(datetime){
    var m = datetime.split(' ')[1];
    var hours = parseInt(m.split(':')[0]);
    var minutes = m.split(':')[1];
    var suffix = hours >= 12 ? "PM":"AM";
    hours = ((hours + 11) % 12 + 1) + ':' + minutes + ' ' + suffix;
    return(hours);
  }
  
  handleReservation(mealID, numSeats){
    this.setState({ refreshing: true });
    fetch(API_URL+'/api/meals/reserveSeats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionID: this.state.sessionID,
            mealID: mealID,
            seatsNumber: numSeats
          })
        })
        .then(res => res.json())
        .then(response => {
          console.log(response);
          if (response.success){
            this.setState({ refreshing: false });
            this.setState({ alertText: "Success! Your reservation is confirmed.", 
                            alertVisible: '' });
            //return();
          }
          
          //console.log(this.state.mealArray);
        })
        .catch(err => {
          //console.error('Error:', err);
          this.setState({ refreshing: false });
          this.setState({ alertText: "Error! Couldn't connect to server.", 
                            alertVisible: '' });
          //return("Error! Couldn't connect to server.")
        });
  }

  render() {
    const {
      mealObj,
      resSeats,
      alertVisible
    } = this.state;
    //console.log(mealObj);
    return (
      <View style={{flex: 1, flexDirection: 'column',}}>
        <ScrollView style={{height:'90%'}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          
            <Image source={{ uri: mealObj.image }} style={{width:'100%', height: 200}} />
          <Text style={{backgroundColor:"#03A9F4", color:"#eee", width:'100%', height:50,
                        paddingTop:7, paddingLeft:12, fontSize:20, display:alertVisible}}>
            {this.state.alertText}
          </Text>
          <View style={{padding:15}}>
            <View style={{flex:1, flexDirection:'row', 
            borderBottomWidth: 1, paddingBottom:10, borderColor:'#bbb'}}>
            <Text style={{width:'80%', padding:5}} h4>{mealObj.name}</Text>
            <Text style={{width:'20%', alignSelf:'center'}} h4>{mealObj.price > 0 ? "$"+mealObj.price.toString() : "FREE"}</Text>
            </View>
            <View style={{
                      flex: 1, 
                      flexDirection: 'row', 
                      justifyContent: 'space-between',
                      marginTop:10,
                      paddingBottom: 10,
                      borderBottomWidth:1, 
                      borderColor: '#bbb',}} >
              <View style={{
                flex: 1, 
                flexDirection: 'row', alignItems: 'center'}}>
                <Avatar
                  rounded
                  size="medium"
                  title={mealObj.cookName.charAt(0)}
                  source={ mealObj.cookPicture == "" ? {} : {uri:mealObj.cookPicture} }
                />
                <View style={{marginLeft:10, overflow:'none', alignItems:'flex-start'}}>
                <Text style={{fontSize:18}}>{mealObj.cookName}</Text>
                <Rating
                  imageSize={20}
                  readonly
                  startingValue={mealObj.cookRating}
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
                <Text style={{fontSize:30, marginLeft:6 }}>{mealObj.openSeats}</Text>
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
                <Text style={{position:'absolute', fontSize:14, top:18}}>{this.convertMonth(mealObj.datetime)}</Text>
                <Text style={{position:'absolute',fontSize:20, top:30}}>{this.convertDay(mealObj.datetime)}</Text>
                </View>
              </View>
            </View> 
            <View style={{marginTop:10, marginBottom:10}} >
              <Text style={{fontSize:22}}>
                About this Meal:
              </Text>
              <Text style={{fontSize:16}}>
                {mealObj.description}
              </Text>
            </View>
            <View style={{marginTop:10, marginBottom:10}} >
              <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                <View style={{width:40}}>
                <Icon name='user' 
                      type='font-awesome'
                      color='#03A9F4'
                      size={40}
                      style={{marginTop:0, marginRight:15}}
                />
                </View>
                <Text style={{fontSize:18, marginLeft:15}}>
                  {mealObj.openSeats} / {mealObj.seats} seats available
                </Text>
              </View>
              <View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:15}}>
                <View style={{width:40}}>
                <Icon name='calendar-o' 
                      type='font-awesome'
                      color='#03A9F4'
                      size={40}
                      style={{marginTop:0, marginRight:15}}
                />
                </View>
                <Text style={{fontSize:18, marginLeft:15}}>
                  {this.convertMonth(mealObj.datetime)} {this.convertDay(mealObj.datetime)}, {this.convertYear(mealObj.datetime)}
                  {' @'} {this.convertTime(mealObj.datetime)}
                </Text>
              </View>
              <View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:15}}>
                <View style={{width:40}}>
                <Icon name='map-marker' 
                      type='font-awesome'
                      color='#03A9F4'
                      size={40}
                      style={{marginTop:0, marginRight:15}}
                />
                </View>
                <View>
                  <Text style={{fontSize:18, marginLeft:15}}>
                    {mealObj.address.split(',')[0]}
                  </Text>
                  <Text style={{fontSize:18, marginLeft:15}}>
                    {mealObj.address.split(', ')[1] + ',' + mealObj.address.split(',')[2]}
                  </Text>

                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{height:'10%', justifyContent:'space-between'}}>
          <Text style={{alignSelf:'center', fontSize:18, marginBottom:5}}>
            Only {mealObj.openSeats} spots left!
          </Text>
          <Button
              icon={<Icon type='ionicon' name='ios-clipboard' color='#ffffff' iconStyle={{marginRight:10}}/>}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
              title='RESERVE THIS MEAL' 
              onPress={this.showDialog}/>

        </View>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>How many people</Dialog.Title>
          <Dialog.Description>
            Please enter the number of people in your party.
          </Dialog.Description>
          <Dialog.Input 
              value={resSeats}
              onChangeText={resSeats => this.setState({ resSeats })}
              keyboardType="numeric"
          />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Reserve" onPress={this.handleDialogSubmit} />
        </Dialog.Container>
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

