import React from 'react';
import { ScrollView, StyleSheet, Text, View , TouchableOpacity, Linking, Image} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import * as MailComposer from 'expo-mail-composer';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction } from '../Store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

function InfosScreen(props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nom du restaurant: {props.data.objet.restaurant_name}</Text>
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <Text style={styles.text}>Situé a: {props.data.objet.restaurant_adresse.lieu.name}</Text>
        {
          props.data.user.type == "Restaurant" ? 
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            <MaterialIcons
            name='edit'
            size={20}
            style={{
              color: "#FFD700",
            }}
          />
          </TouchableOpacity>
          :false
        }
      </View>
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <Text style={styles.text}>
          Numéro: {props.data.objet.restaurant_adresse.contact.numero}
        </Text>
        {
          props.data.user.type == "Restaurant" ? 
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            <MaterialIcons
            name='edit'
            size={20}
            style={{
              color: "#FFD700",
            }}
          />
          </TouchableOpacity>
          :false
        }
      </View>
      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
        <Text onPress={async()=> await MailComposer.composeAsync({recipients : [props.data.objet.restaurant_adresse.contact.email]})} style={styles.linking}>
        Email: {props.data.objet.restaurant_adresse.contact.email}
        </Text>
        {
          props.data.user.type == "Restaurant" ? 
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            <MaterialIcons
            name='edit'
            size={20}
            style={{
              color: "#FFD700",
            }}
          />
          </TouchableOpacity>
          :false
        }
      </View>
      {
        props.data.objet.restaurant_adresse.contact.web.map((z, i)=>(
          <View key={i} style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
            <Text onPress={()=> Linking.openURL(z)} style={styles.linking}>
              {z}
            </Text>
            {
              props.data.user.type == "Restaurant" ? 
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 2,
                }}
              >
                <MaterialIcons
                name='edit'
                size={20}
                style={{
                  color: "#FFD700",
                }}
              />
              </TouchableOpacity>
              :false
            }
          </View>
        ))
      }
      {
        props.data.objet.restaurant_photo != "" ?
        <Image 
          source={{ uri: props.data.objet.restaurant_photo }} 
          style={{ width: "100%", height: 200, resizeMode: "cover", marginVertical: 10}}
        /> 
        :
        false
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100
  },
  title: {
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "justify"
  },
  text: {
    width: "70%",
    marginVertical: 10,
  },
  linking: {
    marginVertical: 10,
    textAlign: "justify",
    color: "#00B"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(InfosScreen);