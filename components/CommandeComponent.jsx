import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, TextInput } from "react-native";
import { AntDesign, Octicons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import { useRoute, useNavigation } from '@react-navigation/native';

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

class CommandeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: null,
      trie:[],
      title: "Toutes les commandes"
    };
    this.navigation = this.props.navigation;
    this.props.navigation.addListener('focus', ()=>{
      switch (this.navigation.dangerouslyGetState().index) {
        case 0:
          this.setState({trie: this.props.data.commande, title: "Toutes les commandes"})
          break;
        case 1:
          var trie = [];
          this.props.data.commande.forEach(x=>{
            if (x.etat == 0) {
              trie = trie.concat(x)
            }
          });
          this.setState({trie: trie, title: "Encours"})
          break;
        case 2:
          var trie = [];
          this.props.data.commande.forEach(x=>{
            if (x.etat == 1) {
              trie = trie.concat(x)
            }
          });
          this.setState({trie: trie, title: "Bien livrés"})
          break;
        case 3:
          var trie = [];
          this.props.data.commande.forEach(x=>{
            if (x.etat == -1) {
              trie = trie.concat(x)
            }
          });
          this.setState({trie: trie, title: "Annuler"})
          break;
      
        default:
          break;
      }
    })
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
            justifyContent: "center",
            marginBottom: "10%"
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {this.state.title} ({this.state.trie.length})
          </Text>
          
        </View>
        <ScrollView style={{minHeight: 600}}>
          <View style={{height:30}} />
            {
              this.state.trie.map((item, i) => (
                
                <View
                  key={i} 
                  style={[styles.item, {borderColor: i == this.state.click ? "#FFD700" : "#FFF"}]}
                >
                  <TouchableOpacity 
                    style={{
                      width: "100%",
                      height: 50,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: "center",
                      backgroundColor: "#FFF",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5
                    }}
                    onPress={()=> this.setState({click: i == this.state.click ? null : i})}
                  >
                    <View style={[styles.activityIndicator, {
                        backgroundColor: item.etat == 0 ? "#FFD700" : item.etat == 1 ? "#228B22" : "#F00",
                      }]}
                    />
                    <Text style={{ color : '#000', fontSize: 12, fontWeight: i == this.state.click ? "bold" : "normal" }}>
                      {new Date(item.date).toUTCString()} | Pour: {item.destinataire.name}
                    </Text>
                      <AntDesign
                        name={i == this.state.click ? 'up' : 'down'}
                        size={20}
                        style={{
                          color: "#000",
                        }}
                      />
                  </TouchableOpacity>
                  { i == this.state.click ?
                    <>
                    {item.plat.map((p, j) => (
                      <View 
                        key={j}
                        style={{ 
                          fontWeight: "normal", 
                          marginHorizontal: 20, 
                          marginVertical: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text style={{ color : '#000', fontSize: 13, }}>{p.name}</Text>
                        <Text style={{ color : '#228B22', fontSize: 13, }}>{p.prix}F</Text>
                        
                      </View>
                    ))}
                    <View 
                      style={{ 
                        fontWeight: "normal", 
                        marginHorizontal: 20, 
                        marginVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ color : '#000', fontSize: 13, fontWeight: "bold" }}>total</Text>
                      <Text style={{ color : '#228B22', fontSize: 13, fontWeight: "bold" }}>{item.total}F</Text>
                      
                    </View>
                    </>
                    : false
                  }
                </View>
                
              ))
            }
          <View style={{height:100}} />
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  item: {
    width: "90%",
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#EEE",
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,  
    alignSelf: "center"
  },
  activityIndicator: {
      padding: 4,
      height: 12,
      width: 12,
      borderRadius: 6,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(CommandeComponent);