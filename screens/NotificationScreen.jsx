import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, BackHandler, Dimensions } from "react-native";
import { Ionicons, AntDesign } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, setState } from '../Store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
    this.props.navigation.addListener('focus', ()=>{
      this.props.setState({index: "awaitNotif", value: false});
    })

    this.list= null;
  }

  backAction = () => {
    this.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  componentDidMount() {
    this.props.setState({index: "awaitNotif", value: false});
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  


  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            height: 50,
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10%"
          }}
        >
          <TouchableOpacity
            onPress={()=> this.navigation.goBack()}
          >
            <AntDesign
              name='arrowleft'
              size={25}
              style={{
                color: "#000",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
            }}
          >
            Notification{ this.props.data.notifListSent.length > 0 ? "s" : "" }
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 15,
              }}
            >
              Tout marquer lu
            </Text>
          </TouchableOpacity>
          
        </View>
        {
          this.props.data.notifListSent.length != 0 ?
            <View>
              <ScrollView>
                {
                  this.props.data.notifListSent.map((item, i)=>(
                    <View key={i} style={styles.notification}>
                      <View style={styles.notificationIconContainer}>
                        <Ionicons
                          name='alert-circle'
                          size={30}
                          color={"#FFD700"}
                        />
                      </View>
                      <View style={styles.notificationTextContainer}>
                          <Text style={styles.notificationText}>
                            {item.request.content.body}
                          </Text>

                          <Text style={styles.notificationDate}>
                            {new Date(item.date).toUTCString()}
                          </Text>
                      </View>
                  </View>
                  ))
                }

              </ScrollView>
            </View>
          :
          false
        }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50
  },

  headerContainer: {
    backgroundColor: '#073A6A00',
    flex: 1,
  },

  headerTop: {
    flex: 4,
    alignItems: "center",
    paddingTop: 0,
    backgroundColor: '#073A6A',
  },

  headerTopImage: {
    resizeMode: "contain",
    width: "50%",
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 0,
    backgroundColor: "#073A6A",
    paddingTop: 0,
    paddingBottom: 20,
    height: 150,
  },

  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    flex: 1,
  },

  line: {
    width: "30%",
    height: 2,
    backgroundColor: "#fff",
    marginTop: 10,
    marginLeft: 0,

  },

  noCarsContainer: {
    borderWidth: 0,
    marginTop: "20%",
    //alignItems: "center",
  },

  noCarsText: {
    textAlign: "center",
    fontSize: 15,
    color: "#000000",
    paddingHorizontal: "25%",
    lineHeight: 26,
  },

  noCarsButton: {
    paddingHorizontal: "15%",
    marginTop: 30,
  },

  notification: {
      flexDirection: "row",
      paddingHorizontal: 30,
      paddingRight: 0,
      paddingBottom: 30,
  },

  notificationTextContainer: {
      marginLeft: 15,
      flex: 1,
  },

  notificationText: {
      fontSize: 16,
      color: "#353D40",
      paddingRight: 40,
      borderWidth: 0,
      marginBottom: 10,
  },

  notificationDate: {
      fontSize: 10,
      color: "#353D40",
  },

  NotificationFrequenceContainer: {
    position: "absolute",
    width: "100%",
    height: Dimensions.get('window').height,
    backgroundColor: "#fff",
    flex: 1,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
