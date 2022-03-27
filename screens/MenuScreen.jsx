import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, BackHandler } from "react-native";
import { Ionicons, Octicons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import io from "socket.io-client";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, favorieAction, panierAction, platAction, _platAction, listAction, restaurantAction, setState} from '../Store/ActivityActions';

import PlatComponent from '../components/PlatComponent';
import PhotoComponent from '../components/PhotoComponent';
import AddPlatComponent from '../components/AddPlatComponent';
import HomeHeaderComponent from '../components/HomeHeaderComponent';
import CONST from '../Store/const';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    favorieAction, 
    panierAction,
    platAction,
    _platAction,
    listAction,
    restaurantAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class MenuScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: '',
      prix: 0,
      refreshing: false
    };
    this.socket = io(CONST.socket_url);
    this.navigation = this.props.navigation;
    this.props.navigation.addListener('focus', ()=>{
      this.props.listAction(this.props.data.list);
    })
  }
  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  
  async componentDidMount(){
    
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh = () => {
     this.setState({refreshing: true});
  
    wait(2000).then(() =>{
      this.socket.emit('List', this.props.data.user);
      this.socket.on('List', (tab) => {
        this.props.listAction(tab);
      })
      this.setState({refreshing: false}) ;
    });
  }

  render() {
    return (
      <View style={{width: '100%', height:'100%' }}>
        <HomeHeaderComponent navigation={this.navigation} />
        <PhotoComponent />
      <ScrollView
        contentContainerStyle={{}} style={styles.container}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
      >
        <View style={{height:30}} />
          {
            this.props.data.list.map((item, i)=>(
              <PlatComponent 
                key={i} 
                id={i}
                click={(item.name == this.props.data.objet.name && item.prix == this.props.data.objet.prix)}
                item={item}
              />
            ))
          } 
          <View style={{height:100}} />
        </ScrollView>
        <StatusBar style="auto" /> 
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
                bottom: 30,
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  item: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 5
  },
  title: {
    fontSize: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);