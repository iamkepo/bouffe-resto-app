import React from 'react';
import { View, BackHandler } from 'react-native';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listAction, userAction, notificationAddAction, setState } from '../Store/ActivityActions';

import FavorieScreen from '../screens/FavorieScreen';
import HomeScreen from '../screens/HomeScreen';

import HomeHeaderComponent from '../components/HomeHeaderComponent';
import PanierButtonComponent from '../components/PanierButtonComponent';

const Tab = createMaterialTopTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    listAction,
    userAction,
    notificationAddAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class HomeNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
  }
  backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
   this.subscription1.remove(); 
   this.subscription2.remove();
  }
  async componentDidMount() {

    //console.log( this.props.data.list );

    const list = await Notifications.getAllScheduledNotificationsAsync();
    //console.log(list.length);

    this.subscription1 = Notifications.addNotificationReceivedListener(notification => {
      //console.log(notification);
      var object = {...notification, vue: false}
      this.props.notificationAddAction(object);

    });
    this.subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
      this.navigation.navigate('Notification')

      //console.log( this.props.data.objet );
      //console.log( response );
    });
    this.unsubscribe3 = NetInfo.addEventListener(state => {
      this.props.setState({index:'isConnected', value: state.isConnected});
    });
    
    this.unsubscribe3();
    // To unsubscribe to these update, just use:
    //console.log(this.props.data.myState.isConnected);

   this.backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    this.backAction
   );
  }

  render(){
    return (
      <View style={{width: '100%', height:'100%' }}>
        <HomeHeaderComponent navigation={this.navigation} />
        <Tab.Navigator
          tabBarPosition="bottom"
          tabBarOptions={{
            activeTintColor: "#000",
            inactiveTintColor: "#BBB",
            scrollEnabled: false,
            indicatorStyle: {
                backgroundColor: "#FFD700",
                height: 57,
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                textTransform: 'none',
            },
            tabStyle: {
                display: "flex",
                alignItems: "center",
                height: 55,
                backgroundColor: "#FFF",
                flex: 1,
            },
            style: {
                backgroundColor: 'transparent',
                display: 'flex',
                height: "auto",
            },
            upperCaseLabel: false,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} navigation={this.navigation} />
          <Tab.Screen name="Favorie" component={FavorieScreen} navigation={this.navigation}  />
        </Tab.Navigator>
        {
          this.props.data.user.type == "Client" ?
          <PanierButtonComponent navigation={this.navigation} /> : false
        }
        
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);