import React from 'react';

import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';

import { createStackNavigator } from '@react-navigation/stack';

import RestaurantNavigator from './RestaurantNavigator';
import HomeNavigator from './HomeNavigator';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listAction, userAction, notificationAddAction, setState } from '../Store/ActivityActions';

import ChooseScreen from '../screens/ChooseScreen';
import ProfilScreen from '../screens/ProfilScreen';
import MenuScreen from '../screens/MenuScreen';
import NotificationScreen from '../screens/NotificationScreen';


const Stack = createStackNavigator();

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

class MainNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  componentWillUnmount() {
   this.subscription1.remove(); 
   this.subscription2.remove();
  }
  async componentDidMount() {
    const list = await Notifications.getAllScheduledNotificationsAsync();
    //console.log(list.length);

    this.subscription1 = Notifications.addNotificationReceivedListener(notification => {
      //console.log(notification);
      var object = {...notification, vue: false}
      this.props.notificationAddAction(object);

    });
    this.subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
      //console.log( response );
      this.navigation.navigate('Notification')
    });
    this.unsubscribe3 = NetInfo.addEventListener(state => {
      this.props.setState({index:'isConnected', value: state.isConnected});
    });
    
    this.unsubscribe3();
    // To unsubscribe to these update, just use:
    //console.log(this.props.data.myState.isConnected);
  }
  render(){
    return (
        <Stack.Navigator>
          <Stack.Screen 
            name="Choose" 
            component={ChooseScreen}
            route={this.route} 
            navigation={this.navigation}
            options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}} 
          />
          <Stack.Screen 
            name="Menu" 
            component={MenuScreen}
            route={this.route} 
            navigation={this.navigation}
            options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}} 
          />
          <Stack.Screen 
            name="Profil" 
            component={ProfilScreen}
            route={this.route} 
            navigation={this.navigation}
            options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}} 
          />
          <Stack.Screen 
            name="Notification" 
            component={NotificationScreen}
            route={this.route} 
            navigation={this.navigation}
            options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}} 
          />
        </Stack.Navigator>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);