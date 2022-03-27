import React, { useState, useEffect } from 'react';
import {BackHandler,StyleSheet,ScrollView,View,Text,KeyboardAvoidingView,Dimensions,TouchableOpacity,TextInput, Image} from 'react-native';
import { AntDesign, Octicons } from 'react-native-vector-icons';
import NetInfo from '@react-native-community/netinfo';
import TouchableScale from 'react-native-touchable-scale';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listAction, parseAction, panierAction, setState } from '../Store/ActivityActions';

import PanierButtonComponent from '../components/PanierButtonComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    listAction,
    panierAction,
    parseAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

class SearchScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      show: true,
      query: "",
      list: []
    };
    this.navigation = this.props.navigation;
  }
  backAction = () => {
    this.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.props.setState({index:'isConnected', value: state.isConnected});
    });
    
    this.unsubscribe();
   this.backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    this.backAction
   );
  }
  updateSearch(text) {
    this.setState({list: []});
    this.setState({query: text});
    if (text != "" ){
      let stock = [];
      this.props.data.list.forEach(item => {
        if (item.name.search(text) != -1) {
          stock = stock.concat(item);
        }
      });
      this.setState({list: stock});
    }
  }

  render(){
    return (
      <KeyboardAvoidingView behavior={'height'} style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            onPress={()=> this.props.navigation.goBack()}
            style={styles.vwSearch}
          >
            <AntDesign
              name='arrowleft'
              size={20}
              style={{
                color: "#000",
              }}
            />
          </TouchableOpacity>

          <TextInput
            autoFocus={true}
            value={this.state.query}
            placeholder="Search"
            style={styles.textInput}
            onChangeText={(text) => this.updateSearch(text)}
          />
          {
            this.state.query ?
              <TouchableOpacity
                onPress={() => this.setState({query: ""})}
                style={styles.vwClear}
              >
                <AntDesign
                  name='close'
                  size={20}
                  style={{
                    color: "#000",
                  }}
                />
              </TouchableOpacity>
            : false
          }

        </View>
        <ScrollView>
        {
          this.state.list.map((item, i)=>(
            <TouchableOpacity
              key={i} 
              style={styles.plat}
              onPress={()=> {
                this.props.parseAction({i: i, item: item}); 
                this.props.navigation.navigate('Restaurant')
              }}
            >
              <View 
                style={{
                  width: "100%",
                  height: "100%",
                  flexWrap: "nowrap",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <Image 
                  source={{ uri: item.photo }} 
                  style={{ width: "35%", height: "100%", resizeMode: "cover", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}
                />
                <View style={{width: "65%", height: "100%", justifyContent: "space-around", padding: "2%"}}>
                  <View style={{width: "80%", justifyContent: "space-between", flexDirection: "row"}}>
                    <Text style={{ color: "#000", fontSize: 13, }}>
                      {item.name}
                      <Text style={{ color: "#228B22" }}> {item.prix} F </Text>
                    </Text>
                    <TouchableScale
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -45,
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
                  
                  <Text style={{ color: "#BBB", fontSize: 12 }}>De: 
                    <Text style={{ color: "#000" }}> {item.restaurant_name}</Text>
                  </Text>
                  <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                    <Text style={{ fontSize: 12, color: "#BBB" }}> Avec  
                      <Text style={{ color: "#228B22" }}> {item.restaurant_menu >=10 ? null : 0 }{item.restaurant_menu} </Text>autres plats à
                      <Text style={{ color: "#228B22" }}> 100m </Text> de vous 
                    </Text>
                  </View>
                  
                </View>
              </View>
            </TouchableOpacity>
          ))
        }
        </ScrollView>
        {
          this.props.data.user.type == "Client" ?
          <PanierButtonComponent navigation={this.props.navigation} /> : false
        }
      </KeyboardAvoidingView >
    );
  }
}
const styles = StyleSheet.create({
  vwClear: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },

  vwSearch: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer:
  {
    backgroundColor: '#EEE',
    width: '90%',
    height: 50,
    flexDirection: 'row',
    borderRadius: 5,
    marginBottom: 20

  },
  container: {
    backgroundColor: '#FFF',
    width: '100%',
    height: screen.height,
    alignItems: 'center',
    paddingTop: 50
  },
  plat: { 
    width: "94%",
    backgroundColor: '#FFF',
    height: 100,
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
    alignSelf: "center"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
