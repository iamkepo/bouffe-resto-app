import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Alert } from "react-native";
import { AntDesign, Octicons, MaterialIcons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import * as FileSystem from 'expo-file-system';
import io from "socket.io-client";
import axios from "axios";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, favorieAction, panierAction, platAction, _platAction } from '../Store/ActivityActions';

import DoublePressComponent from './DoublePressComponent';
import CONST from '../Store/const';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    favorieAction, 
    panierAction,
    platAction,
    _platAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

  const socket = io(CONST.socket_url);
function PlatComponent (props){
  const [edit, setEdit] = useState(false);
  const [objet, setObjet] = useState(props.item);

  const sender = async(etat)=>{
    await FileSystem.uploadAsync(CONST.socket_url+'binary-upload', props.item.photo, {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        name : props.data.user.numero,
        photo: etat.photo[0] == "h" ? etat.photo.replace(CONST.socket_url, "./") : ""
      },
      sessionType : FileSystem.FileSystemSessionType.BACKGROUND,
      uploadType : FileSystem.FileSystemUploadType.BINARY_CONTENT,
      fieldName : "test",
      mimeType : "png",
      parameters : "*/*",
    })
    .then( (response)=> {
      console.log(response.status);
      FileSystem.deleteAsync(etat.photo);
      var photo = {
        ...etat,
        photo: CONST.socket_url+'uploads/'+response.body+'.png'
      }
      if (photo.ide) {
        socket.emit('Update_plat', photo);
        socket.on('Update_plat', (resp) => {
          console.log(resp);
        })
      } else {
        photo.ide = response.body;
        socket.emit('Add_plat', photo);
        socket.on('Add_plat', (resp) => {
          console.log(resp);
        })
      }
          props.parseAction({i: props.id, item: photo});
          props.platAction({i: props.id, item: photo});
    })
    .catch( (error)=> {
      console.log(error);
    });
  }
  const changeEtat = ()=> {
    var etat = {
      ...props.data.objet,
      etat: !props.data.objet.etat,
      restaurant: {
        ...props.data.user,
        menu_length: props.data.list.length-1
      }
    }
    if (props.data.objet.photo != "") {
      if (props.data.objet.photo[0] == "f") {
        sender(etat);
      } else {
        console.log(etat.photo);
        socket.emit('Update_plat', etat);
        socket.on('Update_plat', (resp) => {
          console.log(resp);
          props.parseAction({i: props.id, item: etat});
          props.platAction({i: props.id, item: etat});
        })
      }
    } else {
      alert("il manque une image pour ce plat")
    }
}
  return(
    <DoublePressComponent 
      style={[styles.item, {borderColor : props.click ? "#FFD700" : "#FFF",}]
      }
      doubleTap={()=> changeEtat()} 
      longTap={()=>false} 
      singleTap={() => {
        console.log(props.item);
        props.parseAction({i: props.id, item: props.item});
      }} 
      delay={300}
    >
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <Text style={{ width: "80%",color : '#000', fontSize: 15, fontWeight: (props.click) ? "bold": "normal" }}>
          {props.item.name}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#ECE31A", }}>{props.item.prix} F </Text>
      </View>
      {
        props.click ?
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <TouchableScale
          style={{
            width: 50,
            height: 50,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Switch
                trackColor={{ false: '#767577', true: '#228B22' }}
                thumbColor={props.item.etat ? '#FFD700' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> changeEtat()}
                value={props.item.etat}
              />
        </TouchableScale>
        <TouchableScale
          style={{
            width: 50,
            height: 50,
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onPress={()=> { 
            Alert.alert(
              "Suppression de plat",
              "Voulez-vous vraiment supprimer "+props.item.name+" ?",
              [
                {
                  text: "Annuler",
                  onPress: () => false,
                  style: "cancel"
                },
                { text: "Supprimer", onPress: () => { 
                  if (props.data.objet.photo != "" && props.data.objet.photo[0] != "f") {  
                    var objet = {
                      ...props.data.objet,
                      photo: props.data.objet.photo.replace(CONST.socket_url, "./")
                    }
                    socket.emit('Delete_plat', objet);
                    socket.on('Delete_plat', (resp) => {
                      console.log(resp);
                    })
                  }
                  props._platAction(props.id); 
                  var ob = {
                    "etat": false,
                    "name": "",
                    "photo": "",
                    "prix": "",
                  }
                  props.parseAction({i: 0, item: ob}) ;
                }}
              ],
              { cancelable: false }
            );
          }}
        >
          <MaterialIcons
            name='delete'
            size={25}
            style={{
              color: "#F00",
            }}
          />
        </TouchableScale>
      </View>
      :<View style={{height: 15}}/>
      }
    </DoublePressComponent>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  item: {
    paddingHorizontal: 15,
    paddingTop: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#FFF",
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,  
  },
  title: {
    fontSize: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PlatComponent);