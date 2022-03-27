import React from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons, AntDesign } from 'react-native-vector-icons';
import { Camera } from 'expo-camera';

import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, platAction } from '../Store/ActivityActions';

import DoublePressComponent from './DoublePressComponent';
import { BackgroundImage } from 'react-native-elements/dist/config';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    platAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class PhotoComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      full: false,
      permission: null,
      take: false
    };
    this.camera= null;
  }
  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
      this.setState({permission: status === 'granted'});
    const { status1 } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  backAction = () => {
    this.setState({full: false, take: false})
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  async snap() {
    if (this.camera) {
      let p = await this.camera.takePictureAsync();
      console.log(p);
      var photo = {
        ...this.props.data.objet,
        photo: p.uri
      }
      this.props.platAction({ i: this.props.data.i, item: photo});
      this.props.parseAction({ i: this.props.data.i, item: photo});
      this.setState({full: false, take: false})
    }
  };
  async pickImage() {
    let p = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    //console.log(p);
    var photo = {
      ...this.props.data.objet,
      photo: p.uri
    }
    this.props.platAction({ i: this.props.data.i, item: photo});
    this.props.parseAction({ i: this.props.data.i, item: photo});
    this.setState({full: false, take: false})
  };
  render(){
    return(
      <DoublePressComponent
        longTap={()=> false}
        doubleTap={()=> this.props.data.objet.photo != "" ? this.setState({full: !this.state.full }) : false}
        delay={300}
        singleTap={()=> this.props.data.objet.photo == "" ? this.setState({take: true, full: true }) : false}
        style={{width: '100%', height:this.state.full ? '100%' : '30%', backgroundColor: '#000000', alignItems: "center", justifyContent: "center"}}
      >
        {
          this.props.data.objet.photo != ""  && !this.state.take?
            <BackgroundImage
              source={{ uri: this.props.data.objet.photo }} 
              style={{
                marginTop: this.state.full ? "25%" : 0,
                resizeMode: this.state.full ? "contain" : "cover",
                width: '100%',
                height: this.state.full ? '60%' : '100%',
                alignItems: "center", 
                justifyContent: this.state.take ? "center" : "flex-end",
              }}
            >
            {
              !this.state.full ? 
              <View style={{width: '100%', height: this.state.full ? '15%' : '40%', alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>
                <TouchableOpacity
                  style={{width: 50, height: 50, alignItems: "center", justifyContent:"center"}}
                  onPress={() => {
                    this.setState({full: true, take: true})
                  }}>
                  <AntDesign
                    name='camera'
                    size={25}
                    style={{
                      color: "#FFF",
                    }}
                  />
                </TouchableOpacity>
              </View>
              : false
            }
          </BackgroundImage>
          :
          !this.state.take ?
          <AntDesign
            name='camera'
            size={25}
            style={{
              color: "#FFF",
            }}
          />
          :
          <Camera 
            ref={ref => {
              this.camera = ref;
            }}
              style={{
                width: '100%', 
                height: this.state.full ? '60%' : '100%', 
                alignItems: "center", 
                justifyContent:"flex-end",
                marginTop: "-25%"
              }} 
              type={Camera.Constants.Type.back}
              //zoom={2}
            >
              <View style={{width: '100%', height: this.state.full ? '15%' : '40%', alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>
                
                <TouchableOpacity
                  style={{width: 50, height: 50, alignItems: "center", justifyContent:"center"}}
                  onPress={() => {
                    this.setState({full: !this.state.full, take: !this.state.take})
                  }}>
                  <MaterialIcons
                    name={this.state.full ? 'arrow-back' : 'fullscreen'}
                    size={25}
                    style={{
                      color: "#FFF",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 50, height: 50, alignItems: "center", justifyContent:"center"}}
                  onPress={() => {
                    this.snap()
                  }}>
                  <AntDesign
                    name='camera'
                    size={25}
                    style={{
                      color: "#FFF",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 50, height: 50, alignItems: "center", justifyContent:"center"}}
                  onPress={() => {
                    this.pickImage()
                  }}>
                  <AntDesign
                    name='download'
                    size={25}
                    style={{
                      color: "#FFF",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
        }
          
      </DoublePressComponent>
    );
  }
};
// function App(props) {
//   let camera = React.createRef(null)
//   const [hasPermission, setHasPermission] = React.useState(null);

//   React.useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
  
// }
export default connect(mapStateToProps, mapDispatchToProps)(PhotoComponent);