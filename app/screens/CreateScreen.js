import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ImagePicker } from 'expo';


export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisine: '',
      seats: 0,
      description: '',
      image: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static navigationOptions = {
    title: 'Create New Meal',
  };

  handleInputChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(JSON.stringify({
      "cuisine": this.state.cuisine,
      "seats": this.state.seats,
      "description": this.state.description,
      "image": this.state.image,
    }));

    fetch('http://0.0.0.0:8080/api/meals/addMeal', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "meal": {
          "cuisine": this.state.cuisine,
          "seats": this.state.seats,
          "description": this.state.description,
          "image": this.state.image
        }
      })
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));

    alert("Meal created!");
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Card>
          <Input
            label="cuisine"
            placeholder="Cuisine"
            value={this.state.cuisine}
            onChange={this.handleInputChange} />
          <Input
            label="seats"
            placeholder="Open Seats"
            value={this.state.seats}
            onChange={this.handleInputChange} />
          <TextInput
            label="description"
            placeholder="Describe your meal..."
            multiline={true}
            value={this.state.description}
            numberOfLines={4}
            onChange={this.handleInputChange} />
          <Button
            title="Add an image"
            onPress={this._pickImage}
          />
          {image &&
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }} />
          }
          <Button
            buttonStyle={{ marginTop: 20, backgroundColor: "#03A9F4" }}
            title="Create Meal"
            onPress={this.handleSubmit}
          />
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
