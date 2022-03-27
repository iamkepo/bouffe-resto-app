import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { AntDesign, MaterialIcons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listAction } from '../Store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    listAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

function HomeHeaderComponent(props) {
  return (
    <View 
      style={{
        width: '100%', 
        height: 90, 
        flexDirection: "row", 
        paddingTop: 40, 
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#FFF",
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
      <TouchableOpacity
        onPress={()=> props.navigation.navigate('Profil')}
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#BBB",
          borderRadius: 30,
          marginLeft: 20,
        }}
      >
        { props.data.user.photo != "" && props.data.user.photo != undefined ?
        <Image 
          source={{ uri: props.data.user.photo }} 
          style={{ 
            width: "100%", 
            height: "100%", 
            resizeMode: "cover",
            borderRadius: 30,
          }}
        /> 
        :
        <AntDesign
          name='user'
          size={25}
          style={{
            textAlign: 'center',
            color: "#FFF",
          }}
        />}
      </TouchableOpacity>
      <Text style={{fontSize: 25, color: "#000", fontWeight: "bold" }}>BouffesApp</Text>
      <TouchableOpacity
        onPress={()=> props.navigation.navigate('Notification')}
        style={{
          width: 30,
          height: 30,
          marginRight: 20,
        }}
      >
        <MaterialIcons
          name='notifications'
          size={30}
          style={{
            color:  props.data.myState.awaitNotif ? "#F00" : "#000",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeaderComponent);