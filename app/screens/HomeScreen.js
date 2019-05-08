import React from 'react';
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
      mealArray: [],
      refreshing: false,
    }
    
    this.renderMealCards = this.renderMealCards.bind(this);
    this.convertMonth = this.convertMonth.bind(this);
    this.convertDay = this.convertDay.bind(this);
    this.onPressed = this.onPressed.bind(this);
    this._onRefresh = this._onRefresh.bind(this);



  }
  static navigationOptions = {
    title: 'LocalEats',
    headerLeft: (
      <Image
        source={require('../assets/images/logov1.png')}
        style={{height: 40, width: 40, marginLeft: 20, marginTop:0}}
        PlaceholderContent={<ActivityIndicator />}
      />
    ),
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
          if(response.success){
            this.setState({ refreshing: false, mealArray: response.data });
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
            
          </Card>
          </TouchableOpacity>
        ]
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/logov1.png')}
              style={styles.welcomeImage}
              PlaceholderContent={<ActivityIndicator />}

            />
          </View>

            <Text style={styles.welcomeText}>Welcome to LocalEats!</Text>
          <View>
            {this.renderMealCards()} 
          </View>
          <Image
              source={require('../assets/images/logov1.png')}
              style={styles.welcomeImage}
              PlaceholderContent={<ActivityIndicator />}
            />
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
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center'
  },
  welcomeText: {
    fontSize: 24,
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

const tempArray = [{ "seats" : 6, "address" : "151 N Craig St, Pittsburgh, PA 15213, USA", "coordinates" : { "lat" : 40.4490241, "lng" : -79.95060149999999 }, "name" : "Fluffy Pancakes!", "description" : "They’re my grandmother’s recipe, everyone loves them!", "datetime" : "05-12-2019 11:00", "price" : 0, "image" : "https://exponent-file-upload-example.s3.amazonaws.com/1556593554310.png", "cookName" : "Lysa Arryn", "cookPicture" : "https://www.hbo.com/content/dam/hbodata/series/game-of-thrones/character/s5/lysa-arryn-1920.jpg/_jcr_content/renditions/cq5dam.web.1200.675.jpeg", "cookRating" : 4.6,"host" : "test@test.co", "openSeats" : 6, "diners" : [ ] },{ "seats" : 12, "address" : "4548 Carroll St, Pittsburgh, PA 15224, USA", "coordinates" : { "lat" : 40.4652846, "lng" : -79.9507045 }, "name" : "Fresh Caught Seafood Burritos", "description" : "I’ve been making burritos since I was a little boy, I’d love to share them with you", "datetime" : "06-02-2019 17:00", "price" : 5, "image" : "https://exponent-file-upload-example.s3.amazonaws.com/1556593645790.png", "cookName" : "Davos Seaworth", "cookPicture" : "", "cookRating" : 4.9, "host" : "test@test.co", "openSeats" : 12, "diners" : [ ] },{ "seats" : 4, "address" : "5708 Walnut St, Pittsburgh, PA 15232, USA", "coordinates" : { "lat" : 40.452171, "lng" : -79.930131 }, "name" : "Hipster Avocado Toast", "description" : "Why did the hipster burn his tongue?... He started eating before it was cool.", "datetime" : "05-03-2019 14:00", "price" : 26, "image" : "https://exponent-file-upload-example.s3.amazonaws.com/1556593732202.png", "cookName" : "John Arryn", "cookPicture" : "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg", "cookRating" : 3.4, "host" : "test@test.co", "openSeats" : 4, "diners" : [ ] },{ "seats" : 3, "address" : "14th St & Smallman St, Pittsburgh, PA 15222, USA", "coordinates" : { "lat" : 40.4479676, "lng" : -79.99049749999999 }, "name" : "Homemade Sushi Rolls", "description" : "They’re so good, you’re going to love them!", "datetime" : "05-29-2019 17:30", "price" : 12, "image" : "https://exponent-file-upload-example.s3.amazonaws.com/1556647659937.png", "cookName" : "Sherri Melisandre", "cookPicture" : "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg", "cookRating" : 4.4, "host" : "test@test.co", "openSeats" : 3, "diners" : [ ] }]


