import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
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


export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      sessionID: '',
      email: '',
      mealObj: this.props.navigation.getParam('mealObj', {}),
    }
    console.log(this.props.navigation.getParam('mealObj', "sucks"));
    
    this.convertMonth = this.convertMonth.bind(this);
    this.convertDay = this.convertDay.bind(this);


  }
  static navigationOptions = {
    title: 'Meal Info',
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

  

  render() {
    const {
      mealObj
    } = this.state;
    console.log(mealObj);
    return (
      <View>
        <ScrollView>
          
            <Card
            image={{ uri: mealObj.image }}
            featuredTitle={mealObj.price > 0 ? "$"+mealObj.price.toString() : "FREE"}
            featuredTitleStyle={{
              alignSelf:'flex-end', bottom:45, marginRight:10,
              backgroundColor:'#333', fontSize:28}}>
            <Text h4>{mealObj.name}</Text>
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
                  title={mealObj.cookName[0]}
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
            
          </Card>
        
          
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

