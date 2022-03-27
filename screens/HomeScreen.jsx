import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, BackHandler, NativeModules } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Octicons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { favorieAction, panierAction, parseAction, listAction } from '../Store/ActivityActions';

import DoublePressComponent from '../components/DoublePressComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    favorieAction, 
    panierAction,
    parseAction,
    listAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");
class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      index: 0,
      downloadProgress: 0,
      task: '',
      status: null,
      size: null,
      exists: false,
      popupLogin: false,
    };
    this.tab = [],
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

  
  componentDidMount(){
    this.props.listAction(this.props.data.list);

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
     );
  }
  detail(i, item){
    this.props.parseAction({i: i, item: item});
    this.navigation.navigate('Restaurant');
  }
  render(){    
    return (
      <ScrollView>
        <View style={styles.container}>
          {
            this.props.data.list.map((item, i)=>(
              <DoublePressComponent
                key={i} 
                style={styles.plat}
                singleTap={()=> this.detail(i, item)} 
                doubleTap={()=> this.props.favorieAction(item)}
                longTap={()=> false}
                delay={300}
              >
                <View 
                  style={{
                    width: "100%",
                    height: "100%",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image 
                    source={{ uri: item.photo }} 
                    style={{ 
                      width: "100%", 
                      height: "60%", 
                      resizeMode: "cover", 
                      borderTopRightRadius: 5, 
                      borderTopLeftRadius: 5, 
                    }}
                  />
                  <View style={{width: "90%", height: "40%", justifyContent: "space-around", paddingVertical: "5%"}}>
                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                      <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                        {item.name}
                        <Text style={{ color: "#228B22" }}> {item.prix} F </Text>
                      </Text>
                      <TouchableScale
                      style={{
                        position: "absolute",
                        top: -15,
                        right: -15,
                        zIndex: 2,
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onPress={()=> this.props.favorieAction(item)}
                    >
                      <AntDesign
                        name='heart'
                        size={25}
                        style={{
                          color: item.favorie ? "#FFD700" : "#BBB",
                        }}
                      />
                    </TouchableScale>
                    </View>
                    
                    <Text style={{ color: "#BBB", fontSize: 15 }}>De: 
                      <Text style={{ color: "#000" }}> {item.restaurant_name}</Text>
                    </Text>
                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                      <Text style={{ fontSize: 15, color: "#BBB" }}> Avec  
                        <Text style={{ color: "#228B22" }}> {item.restaurant_menu >=10 ? null : 0 }{item.restaurant_menu} </Text>autres plats à
                        <Text style={{ color: "#228B22" }}> 100m </Text> de vous 
                      </Text>
                      <TouchableScale
                        style={{
                          position: "absolute",
                          top: -15,
                          right: -15,
                          zIndex: 2,
                          width: 50,
                          height: 50,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onPress={()=> this.props.panierAction(item)}
                      >
                        <Octicons
                          name='diff-added'
                          size={25}
                          style={{
                            color: "#FFD700",
                          }}
                        />
                      </TouchableScale>
                    </View>
                  </View>
                </View>
              </DoublePressComponent>
            ))
          }
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%", 
    minHeight: screen.height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 100
  },
  plat: { 
    width: "90%",
    backgroundColor: '#FFF',
    height: screen.height/3,
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);