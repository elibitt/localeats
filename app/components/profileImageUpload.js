import React, { Component } from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Icon,
  Avatar,
} from 'react-native-elements';
import { Constants, ImagePicker, Permissions } from 'expo';
import ActionSheet from 'react-native-actionsheet';
import { API_URL } from '../constants/apiSource';


export default class ImgUpload extends Component {
  constructor(props){
    super(props);
     this.state = {
      image: '',
      uploading: false,
      infoLoaded: false
    };

    this._loadUserInfo = this._loadUserInfo.bind(this);


  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.infoLoaded && nextProps.username && nextProps.sessionID) {
      this._loadUserInfo(nextProps);
      this.setState({infoLoaded:true});
    }
  }

  _loadUserInfo(newProps){
    //START GET USER INFO API FETCH
    if (newProps.sessionID && newProps.username){
      fetch(API_URL+'/api/user/getInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: newProps.sessionID,
          username: newProps.username
        })
      })
      .then(res => res.json())
      .then(response => {
        //console.log(response.data);
        if(response.success){
          //console.log("profimg: "+response.data);
          if(response.data.info.hasOwnProperty('picURL')){
            this.setState({image:response.data.info.picURL});
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
    }
    //END GET USER INFO API FETCH
  }

  showActionSheet = () => {
    //To show the Bottom ActionSheet
    this.ActionSheet.show();
  };

  render() {
    let {
      image
    } = this.state;

    var optionArray = [
      'Import from Camera Roll',
      'Take Photo',
      'Cancel',
    ];

    return (
      <View style={styles.container}>
        {this._maybeRenderImage()}
        <Button
          onPress={this.showActionSheet}
          type="clear"
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, width: '100%'}}
          title={this.state.image == '' ? 'Add a picture' : ''} />

          <ActionSheet
          ref={o => (this.ActionSheet = o)}

          options={optionArray}
          //Define cancel button index in the option array
          //this will take the cancel option in bottom and will highlight it
          cancelButtonIndex={2}
          //If you want to highlight any specific option you can use below prop
          destructiveButtonIndex={2}
          onPress={index => {
            //Clicking on the option will give you the index of the option clicked
            if (index == 0){
              this._pickImage();
            }
            else if (index == 1){
              this._takePhoto();
            }
          }}
        />
        {this._maybeRenderUploadingOverlay()}
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (image == '') {
      return (
        <Avatar 
        rounded
        size="large"
        onPress={this.showActionSheet}
        showEditButton
        icon={{name: 'user', type: 'font-awesome'}}
        />
      );
    }

    return (
      <Avatar 
        source={{ uri: image }}
        rounded
        onPress={this.showActionSheet}
        size="large"
        showEditButton
         />
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        this.setState({
          image: uploadResult.location
        });
        this.props.saveImage(uploadResult.location);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
}

async function uploadImageAsync(uri) {
  let apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 200,
    width: '100%',
    marginBottom: 15,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});
