import React from 'react';
import {ScrollView, Dimensions, SafeAreaView,Text,View,StyleSheet,TextInput, TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction, addAction } from '../Store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction,
    addAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");


function AddPlatComponent(props) {
  const [name, setName] = React.useState('');
  const [prix, setPrix] = React.useState(0);

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.formScroll}>
      <View style={styles.subContainer}>

          <Text style={styles.formTitle}>
              Créer un plat
          </Text>

          <View style={[styles.inputContainer, {marginTop: 25}]}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              autoFocus={true}
              autoCompleteType="name"
              keyboardType="default"
              onChangeText={(n) =>{
                setName(n)
              }}
            ></TextInput>
          </View>

          <View style={[styles.inputContainer]}>
            <Text style={styles.inputLabel}>Prix</Text>
            <TextInput
              style={styles.input}
              autoCompleteType="cc-number"
              keyboardType="decimal-pad"
              onChangeText={(p) =>{
                setPrix(p)
              }}
            ></TextInput>
          </View>

          <View style={{marginBottom: 20,}}></View>
        <View style={styles.formButtonContainer}>
          <View style={{flex: 1, marginRight: 10,}}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: "#DADADA", height: 55, justifyContent: "center" }]} 
              onPress={()=>{
                props.closeForm();
              }}
            >
              <Text style={{color: "#353D40", fontSize:12, fontWeight: "normal"}}>Annuler</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, marginLeft: 10,}}>
            <TouchableOpacity 
              disabled={!(name && prix)}
              style={[styles.button, { backgroundColor: "#FFD700", height: 55, justifyContent: "center" }]} 
              onPress={()=>{
                var plat ={
                  name: name,
                  prix: prix,
                  photo: "",
                  etat: false,
                }
                props.addAction(plat);
                //console.log(props.data.list.length);
                props.closeForm();
              }}
            >
              <Text style={{color: "#FFF", fontSize:12, fontWeight: "normal"}}>Créer</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    top: 40,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFFAA",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },

  subContainer: {
    flex: 1,
    height: screen.height/2.3,
    marginVertical: 50,
    width: "100%",
    backgroundColor: "#ffff",
    shadowColor: '#00000011',
    shadowRadius: 0,
    shadowOffset: {
        height: 0,
    },
    elevation : 10,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  formHeaderCross: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },

  formScroll: {
    marginTop: 0,
  },

  formTitle: {
      fontSize: 23,
      color: "#353D40",
  },

  inputContainer: {
    paddingHorizontal: 0,
    marginTop: 20
  },

  inputLabel: {
    marginBottom: 5,
    color: "#15132E",
  },

  input: {
    backgroundColor: "#ffff",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#000",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 4,
  },

  formButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 20,
  },
  button: {
    width: "100%",
    borderWidth: 0,
    borderColor: "#fff",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
}
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPlatComponent);