import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, MaterialIcons } from "react-native-vector-icons";
import io from "socket.io-client";
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction, listAction, parseAction, restaurantAction, platAction, commandeAction, notificationAction, setState } from '../Store/ActivityActions';

import LoginComponent from "../components/LoginComponent";
import AddPlatComponent from "../components/AddPlatComponent";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction,
    listAction,
    parseAction,
    restaurantAction,
    platAction,
    commandeAction,
    notificationAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class ChooseScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      popupLogin: false,
      step: 0,
    };
    this.socket = null,
    this.list = undefined;
    this.commande = undefined;
    this.notification = undefined;
    this.user = undefined;
    this.navigation = this.props.navigation;
  }
  async componentDidMount() {
    //this.socket = io("http://192.168.100.6:3000/");
    this.user = await AsyncStorage.getItem('user');
    this.commande = await AsyncStorage.getItem('commande');
    this.notification = await AsyncStorage.getItem('notification');
    this.list = await AsyncStorage.getItem("resto");
    this.props.listAction(this.list != undefined ? JSON.parse(this.list) : null);
    this.props.commandeAction(this.commande != undefined ? JSON.parse(this.commande) : null);
    this.props.notificationAction(this.notification != undefined ? JSON.parse(this.notification) : null);
    this.props.userAction({index: "user", value: (this.user != undefined ? JSON.parse(this.user) : null)});
    this.setState({step: 1})
  }
  async verify(){
    this.setState({step: 0});

    this.props.userAction({index: "type" , value: "resto"}); 
    this.props.userAction({index: "name", value: "kepo"});
    this.props.userAction({index: "numero", value: "+22996772265"});
    if (this.props.data.user.type == undefined) {
      this.setState({step: 1})
    } else if (this.props.data.user.name == undefined && this.props.data.user.numero == undefined) {
      this.setState({step: 3})
    } else {
      if (this.props.data.list.length == 0) {
        this.setState({step: 4})
      } else {
        this.props.parseAction({i: 0, item: this.props.data.list[0]})
        this.navigation.navigate('Menu');
      }
    }
      
  }
  render(){
    return (
      <>
        <View style={styles.container}>
        {this.state.step == 0 ? <ActivityIndicator color="#FFD700" size="large" /> : false}
        {this.state.step == 1 ? 
          <View style={styles.sous}>
            
            {/* <Text style={styles.title}>Vous ètes un: </Text> */}

            <TouchableOpacity
              onPress={()=> this.verify()}
              style={[styles.btn, {backgroundColor: "#FFD700"}]}
            >
              <Text style={{color: "#FFF", fontSize: 18}}>Commencer</Text>
            </TouchableOpacity>

          </View>  
        : false}
        {this.state.step == 3 ? <LoginComponent cancel={()=> this.verify()}/> : false}
        </View>
        {this.state.step == 4 ? <AddPlatComponent closeForm={()=> this.verify()}/> : false}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
  },
  sous: {
    width: "100%",
    height: 300,
    alignItems: "center", 
    justifyContent: "space-around",
  },
  title: {
    marginBottom: 2,
    fontSize: 29,
    fontWeight: 'bold',
    textAlign: "center"
  },
  textInput: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: 'bold',
  },
  btn: {
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ChooseScreen);