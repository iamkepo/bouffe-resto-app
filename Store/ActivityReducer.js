import { combineReducers } from 'redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import axios from "axios";
import NetInfo from '@react-native-community/netinfo';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const INITIAL_STATE = {
  i: null,
  objet: {},
  panier: [],
  total: 0,
  list: [],
  user: {
    lieu: [],
    email: "",
    web: []
  },
  profil: false,
  commande: [],
  notifListSent: [],
  myState: {
    awaitNotif: false,
    isConnected: false
  }

};
async function setsession (key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
async function mergesession (key, value) {
  await AsyncStorage.mergeItem(key, JSON.stringify(value));
}
async function getsession (key) {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
async function session(key, value) {
  let list = await getsession(key).then(()=>{
    if (list != null && list != undefined) {
      mergesession (key, value)
    } else {
      setsession (key, value)
    }
    //return value;
  })
}
function tab_trie(array, index){
  var tab = [];
  for (let i = 0; i < array.length; i++) {
    if (i != index) {
      tab.push(array[i]);
    }
  }
  //console.log(tab);
  return tab;
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function addPlat(array, element){
  var tab = [ element ];
  tab = tab.concat( array.map( item => item ) );
  //console.log(tab);
  return tab;
}
function getDateTimeSpan( date ) {
  return Math.floor(date.getTime()/ 1000);
}

function timeRem( end, time ){
    let currentDate = Math.floor( Date.now() / 1000 );
    let date = getDateTimeSpan( new Date( end ) );
  
    let timeRem = date - currentDate ;
    let ds = timeRem - time;
  
    return ( ds ) ;
}

function createNotifications( data ) {
    let tab = {
      content: {
        title: "Titre",
        body: 'Detail',
        data: {data: data},
      },
      trigger: { 
        seconds: 1,
        repeats: false,
      },
    }
  
    return tab;
}
async function scheduleAndCancel(array) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  array.forEach(element => {
    Notifications.scheduleNotificationAsync(element);
  });
}


function sender(user, cars) {
  NetInfo.fetch().then(state => {
    if( state.isConnected && user.numero){
      var push = {
        name: user.name,
        phone_number: user.numero,
        cars: cars
      };
      //console.log( push, "................................." );
      axios({ method: 'post', url:"https://swiitch-bukar.herokuapp.com/api/user", data: push }).then((response)=>{
        //console.log(response.data, "*************************************");
      })
    }
  });

}


function monReducer (state = INITIAL_STATE, action) {
  let nextState
  switch(action.type) {
    case 'PARSE':
      nextState = {
          ...state,
          i: action.payload.i,
          objet: action.payload.item
      }
      return nextState

    case 'PANIER':
      nextState = {
          ...state,
          total: state.total+action.payload.prix,
          panier: state.panier.concat(action.payload)
      }
      return nextState

    case '_PANIER':
      nextState = {
          ...state,
          total: state.total-state.panier[action.payload].prix,
          panier: tab_trie(state.panier, action.payload)
      }
      return nextState

    case 'FAVORIE':
      state.list.forEach(y =>(
        y.favorie = (action.payload.name == y.name && action.payload.prix == y.prix && action.payload.restaurant_adresse.contact.numero == y.restaurant_adresse.contact.numero) ? !y.favorie : y.favorie
      ));
      session('resto', state.list);

      nextState = {
          ...state,
          list: state.list
      }
      return nextState

    case 'LIST':
      if (action.payload != null) {
        state.list = action.payload
      } else {
        
      }
      session('resto', state.list);
      
      nextState = {
          ...state,
          list: state.list
      }
      return nextState

    case 'USER':
      if (action.payload.index == "user" && action.payload.value == null) {
        state.user = state.user;
      } else if (action.payload.index == "user" && action.payload.value != null) {
        state.user = action.payload.value;
      }else{
        state.user[action.payload.index] =  action.payload.value
      }

      session('user', state.user);

      nextState = {
          ...state,
          user: state.user
      }
      return nextState
    case 'ADD':
      if (state.list.length == 0) {
        state.list = state.list.concat(action.payload)
      } else {
        state.list = addPlat( state.list, action.payload );
      }

      session('resto', state.list);
      
      nextState = {
          ...state,
          list: state.list
      }
      return nextState

    case 'PLAT':
        
        state.list[action.payload.i || state.i] = action.payload.item;
        //console.log(state.list[action.payload.i || state.i]);
        session('resto', state.list);
        
        nextState = {
            ...state,
            list: state.list
        }
        return nextState

    case '_PLAT':
      var stock = tab_trie(state.list, action.payload);
      
      session('resto', stock);
      
      nextState = {
          ...state,
          list: stock
      }
      return nextState

    case 'RESTO':
      
      state.list.forEach(x => {
        x.restaurant_name = action.payload.restaurant_name ? action.payload.restaurant_name : x.restaurant_name;
        x.restaurant_photo= action.payload.restaurant_photo ? action.payload.restaurant_photo : x.restaurant_photo;
        x.restaurant_adresse.contact.numero = action.payload.restaurant_adresse.contact.numero ? action.payload.restaurant_adresse.contact.numero : x.restaurant_adresse.contact.numero;
        x.restaurant_adresse.contact.email = action.payload.restaurant_adresse.contact.email ? action.payload.restaurant_adresse.contact.email : x.restaurant_adresse.contact.email;
        x.restaurant_adresse.contact.web = action.payload.restaurant_adresse.contact.web ? action.payload.restaurant_adresse.contact.web : x.restaurant_adresse.contact.web;
        x.restaurant_adresse.lieu.name= action.payload.restaurant_adresse.lieu.name ? action.payload.restaurant_adresse.lieu.name : x.restaurant_adresse.lieu.name;
        x.restaurant_adresse.lieu.longitude= action.payload.restaurant_adresse.lieu.longitude ? action.payload.restaurant_adresse.lieu.longitude : x.restaurant_adresse.lieu.longitude;
        x.restaurant_adresse.lieu.latitude= action.payload.restaurant_adresse.lieu.latitude ? action.payload.restaurant_adresse.lieu.latitude : x.restaurant_adresse.lieu.latitude;
      });

      session('resto', state.list);

      nextState = {
          ...state,
          list: state.list
      }
      return nextState

    case 'ADD_COMMANDE':
        state.commande = addPlat( state.commande, action.payload );
        state.total = 0;
        state.panier = [];

      session("commande", state.commande);
      
      nextState = {
          ...state,
          commande: state.commande,
          panier: state.panier,
          total: state.total
      }
      return nextState

    case 'COMMANDE':
      if (action.payload != null) {
        state.commande = action.payload
      } else {
        state.commande = state.commande;
      }
      session("commande", state.commande);
      
      nextState = {
          ...state,
          commande: state.commande
      }
      return nextState
      
    case 'PROFIL':
      
      nextState = {
          ...state,
          profil: action.payload
      }
      return nextState

    case 'STATE':
      
      state.myState[action.payload.index] = action.payload.value
      
      nextState = {
          ...state,
          myState: state.myState
      }
      return nextState

    case 'NOTIFICATION':
      if (action.payload != null) {
        state.notifListSent = action.payload
      } else {
        state.notifListSent = state.notifListSent;
      }
      session('notification', state.notifListSent);
        
        nextState = {
            ...state,
            notifListSent: state.notifListSent
        }
      return nextState

    case 'NOTIFICATION_ADD':
      let notifTab = addPlat( state.notifListSent, action.payload );

      session('notification', notifTab );
        
        nextState = {
            ...state,
            notifListSent: notifTab
        }
      return nextState

    //...
    default: 
      return state
  }
}

export default combineReducers({
  data: monReducer
});
