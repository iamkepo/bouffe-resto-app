import React from 'react';
import { View, BackHandler, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import io from "socket.io-client";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { restaurantAction, setState } from '../Store/ActivityActions';

import InfosScreen from '../screens/InfosScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfilScreen from '../screens/ProfilScreen';

import PhotoComponent from '../components/PhotoComponent';
import PanierButtonComponent from '../components/PanierButtonComponent';
import AddPlatComponent from '../components/AddPlatComponent';

const Tab = createMaterialTopTabNavigator();

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    restaurantAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class RestaurantNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      show: true,
      chatMessage: "",
      chatMessages: []
    };
    this.navigation = this.props.navigation;
  }
  backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  componentDidMount() {
    this.socket = io("http://192.168.100.9:3000/");
    //this.socket.emit("chat message",  "BouffeApp" );
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.props.setState({index:'isConnected', value: state.isConnected});
    });
    
    this.unsubscribe();
   this.backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    this.backAction
   );
  }

  async close() {
    this.navigation.goBack();
  }
  render(){
    return (
      <View style={{width: '100%', height:'100%' }}>
        <PhotoComponent />
        <MenuScreen navigation={this.navigation}/>
        <StatusBar style="light" />
        {
          <>
          {
          (this.state.show) ? 
            <TouchableOpacity
              disabled={false}
              onPress={()=> {
                this.setState({show: false});              
              }}
              style={{
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                backgroundColor: "#FFD700DD",
                borderRadius: 50,
                bottom: 60,
                right: 20,
                zIndex: 5,
                shadowColor: '#000',
                shadowRadius: 5,
                shadowOffset: {
                  height: 10,
                  width: 10
                },
                shadowOpacity: 0.5,
                elevation : 10,
              }}
            >
              <Ionicons
                name='add'
                size={25}
                style={{
                  color: "#FFF",
                }}
              />
            </TouchableOpacity>
            :<></>
          }
          {this.state.show || <AddPlatComponent closeForm={()=> {
            this.setState({show: true})
              let resto = {
                ...this.props.data.list[this.props.data.list.length-1],
                restaurant_photo: this.props.data.objet.restaurant_photo,
                restaurant_name: this.props.data.objet.restaurant_name,
                restaurant_adresse: this.props.data.objet.restaurant_adresse
              }
              //this.props.restaurantAction(resto);
            }}/> }
        </>
        }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantNavigator);