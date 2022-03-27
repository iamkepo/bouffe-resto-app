import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, } from 'react-native';
import { AntDesign, Octicons, FontAwesome, MaterialIcons } from 'react-native-vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import * as Contacts from 'expo-contacts';
import NetInfo from '@react-native-community/netinfo';

import * as Location from 'expo-location';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseAction, _panierAction, addcommandeAction, userAction, setState } from '../Store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    parseAction,
    _panierAction,
    addcommandeAction,
    userAction,
    setState,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};


const screen = Dimensions.get("screen")

function PanierButtonComponent(props) {
  const [click, setclick] = useState(false);
  const [showlist, setshowlist] = useState(0);
  const [comfor, setcomfor] = useState({ name: props.data.user.name, numero: props.data.user.numero });
  const [mescontacts, setmescontacts] = useState([]);
  const [loc, setloc] = useState(null);
  useEffect(() => {
    (async () => {
      const unsubscribe = NetInfo.addEventListener(state => {
        props.setState({index:'isConnected', value: state.isConnected});
      });
      
      // To unsubscribe to these update, just use:
      unsubscribe();
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          var contacts = [];
          data.forEach(c => {
            if (c.phoneNumbers) {
              contacts = contacts.concat({ name:c.name, numero: c.phoneNumbers[0].number })              
            }
          });
          //console.log(contacts);
          setmescontacts(contacts)
        }
      }
      if (props.data.user.lieu.length > 0) {
        setloc(props.data.user.lieu[0])
      }
    })();
  }, []);

  const addLocation=async ()=>{
    let location = await Location.getCurrentPositionAsync({});
    let identify = await Location.reverseGeocodeAsync({longitude: location.coords.longitude, latitude: location.coords.latitude})
    var tab = [ {location: location, identify: identify[0]} ];
    if (props.data.user.lieu != undefined) {
      tab = tab.concat( props.data.user.lieu.map( item => item ) );
    }
    props.userAction({index: "lieu", value: tab})
    setloc({location: location, identify: identify[0]})
  }

  const commande = ()=> {
    if (props.data.myState.isConnected) {
      if (props.data.panier.length > 0) {
        if (loc != null) {
          if (props.data.user.solde > props.data.total) {
            var com = {
              lieu: loc,
              destinataire: comfor,
              date: new Date(),
              total: props.data.total,
              plat: props.data.panier,etat: 0
            };
            props.userAction({index: "solde", value: (props.data.user.solde - props.data.total)})
            props.addcommandeAction(com);
            setcomfor({ name: props.data.user.name, numero: props.data.user.numero });
            setclick(!click)
          } else {
            alert("votre solde est insuffisant")
          }
        } else {
          alert("Ajouter au moin un lieu de livraison")
        }
      } else {
        alert("Ajouter au moin un plat à votre panier")
      }
    } else {
      alert("Vous n'ètes pas connecter actuellement")
    }
  }
  const tab_trie = (index) =>{
    var tab = [];
    for (let i = 0; i < props.data.user.lieu.length; i++) {
      if (i != index) {
        tab.push(props.data.user.lieu[i]);
      }
    }
    //console.log(tab);
    setloc(null);
    props.userAction({index: "lieu", value: tab});
  }

  return (
    <>
      {
        click ? 
        <View style={{position: "absolute",top: 0,zIndex:4,width: "100%",height: screen.height,backgroundColor: showlist == 0 ? '#000000AA' : "#EEE",shadowColor: '#000',shadowRadius: 5,shadowOffset: {height: 10,width: 10},shadowOpacity: 0.5,elevation : 10, }}>
          <ScrollView style={{width: "100%",}}>
          { showlist == 0 ? <TouchableOpacity onPress={()=> setclick(false)} style={{width: "100%",height: screen.height/2}}></TouchableOpacity> : false}
          {
            showlist == 1 ?
            <View style={{width: "100%",height: screen.height,justifyContent: "center",alignSelf: "center",backgroundColor: '#FFF',borderRadius: 5, paddingTop: 50,}}>

              <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                <Text style={{height: 50,paddingTop: 15,color: "#000",fontSize: 20,fontWeight: "bold",paddingHorizontal: "5%",}}>Mes contacts ({mescontacts.length})</Text>
                <TouchableOpacity onPress={()=>setshowlist(0)} style={{height: 50,paddingTop: 15,color: "#000",fontSize: 20,fontWeight: "bold",paddingHorizontal: "5%",}}>
                  <AntDesign name='close' size={25} style={{color: "#000",}} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{width: "100%",paddingHorizontal: "5%",backgroundColor: "#EEE"}}>

                <TouchableOpacity onPress={()=>{setcomfor({ name: props.data.user.name, numero: props.data.user.numero });setshowlist(0)}} style={styles.contact}>
                  <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                    <Text style={{ color : '#000', fontSize: 13, fontWeight: "normal" }}>
                      {props.data.user.name}
                    </Text>
                    <Text style={{ color : '#000', fontSize: 13, fontWeight: "normal" }}>
                      {props.data.user.numero}
                    </Text>
                  </View>
                </TouchableOpacity>

                {
                  mescontacts.map((contact, i)=>(<TouchableOpacity key={i} onPress={()=>{setcomfor(contact);setshowlist(0)}}
                      style={styles.contact}
                    >
                      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                        <Text style={{ color : '#000', fontSize: 13, fontWeight: "bold" }}>
                          {contact.name} 
                        </Text>
                        <Text style={{ color : '#000', fontSize: 13, fontWeight: "normal" }}>
                          {contact.numero}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                }

                <View style={{height: screen.height/2}} />

              </ScrollView>

            </View>
            : false
          }
          {
            showlist == 2 ?
            <View style={{width: "100%",height: screen.height,justifyContent: "center",alignSelf: "center",backgroundColor: '#FFF',borderRadius: 5, paddingTop: 50,}}>

              <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                <Text style={{height: 50,paddingTop: 15,color: "#000",fontSize: 20,fontWeight: "bold",paddingHorizontal: "5%",}}>Mes lieux de livraisons</Text>
                <TouchableOpacity onPress={addLocation} style={{height: 50,paddingTop: 15,color: "#000",fontSize: 20,fontWeight: "bold",paddingHorizontal: "5%",}}>
                  <Octicons name='diff-added' size={25} style={{color: "#FFD700",}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> setshowlist(0)} style={{height: 50,paddingTop: 15,color: "#000",fontSize: 20,fontWeight: "bold",paddingHorizontal: "5%",}}>
                  <AntDesign name='close' size={25} style={{color: "#000",}} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{width: "100%",paddingHorizontal: "5%",backgroundColor: "#EEE"}}>

                {
                  props.data.user.lieu.length > 0 ?
                  props.data.user.lieu.map((lieu, j)=>(
                    <View key={j} style={styles.contact}>
                      <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                        <TouchableOpacity onPress={()=>{ setloc(lieu); setshowlist(0)}} style={{width: "80%"}}>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>city: {lieu.identify.city}</Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>country: {lieu.identify.country} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>district: {lieu.identify.district} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>isoCountryCode: {lieu.identify.isoCountryCode} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>name: {lieu.identify.name} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>postalCode: {lieu.identify.postalCode} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>region: {lieu.identify.region} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>street: {lieu.identify.street} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>subregion: {lieu.identify.subregion} </Text>
                          <Text style={{color : '#000', fontSize: 13, fontWeight: "bold" }}>timezone: {lieu.identify.timezone} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> tab_trie(j)}>
                          <MaterialIcons name='delete' size={25} style={{color: "#F00",}} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )) : 
                  <TouchableOpacity onPress={addLocation} style={{width: "100%", height:  screen.height/2.5, alignItems: "center", justifyContent: "center" }}>
                    <Octicons name='diff-added' size={100} style={{color: "#FFD700",}} />
                  </TouchableOpacity>
                }

                <View style={{height: screen.height/2}} />

              </ScrollView>

            </View>
            : false
          }
           {showlist != 0 ? false : 
           <View style={{width: "95%",minHeight: screen.height/4, justifyContent: "center",alignSelf: "center",backgroundColor: '#FFF',borderRadius: 5,}}>

            <View style={{width: "90%",height: 50,alignSelf: "center",flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>

              <TouchableOpacity onPress={()=> setshowlist(showlist == 1 ? 0 : 1)} style={{width: "35%",height: 15,overflow: "hidden",flexDirection: "row",}}>
                <FontAwesome name='edit' size={15} style={{color: "#FFD700",}} />
                <Text style={{ color: "#000",fontSize: 15,fontWeight: "bold"}}>Pour: </Text>
                <Text style={{ color: "#000",fontSize: 15,}}>{comfor.name == props.data.user.name ? "vous" : comfor.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> setshowlist(showlist == 2 ? 0 : 2 )} style={{flexDirection: "row",width: "60%",height: 15,overflow: "hidden",}}>
                <FontAwesome name='edit' size={15} style={{color: "#FFD700",}}/>
                <Text style={{color: "#000",fontSize: 14,fontWeight: "bold"}}>Lieu: </Text>
                <Text style={{color: "#000",fontSize: 14,}}>
                  {loc != null ? loc.identify.city+"/"+loc.identify.subregion+"/"+loc.identify.district : false}
                </Text>
              </TouchableOpacity>

            </View>

            <ScrollView style={{width: "100%",paddingHorizontal: "5%",paddingBottom: 10,backgroundColor: "#FFF"}}>
              {
                props.data.panier.map((item, i)=>(

                  <TouchableOpacity key={i} onPress={()=>{ props.parseAction({i: i, item: item}); setclick(false); props.navigation.navigate('Restaurant'); }} style={styles.item}>

                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>

                      <Text style={{ color : '#000', fontSize: 13, fontWeight: "normal" }}>
                        {item.name}
                        <Text style={{ color: "#228B22" }} > {item.prix} F </Text>
                      </Text>

                      <TouchableScale onPress={()=> props._panierAction(i)} style={{position: "absolute",top: -20,right: -20,zIndex: 2,width: 50,height: 50,alignItems: "center",justifyContent: "center"}}>
                        <Octicons name='diff-removed' size={20} style={{color: "#FFD700",}}/>
                      </TouchableScale>

                    </View>

                  </TouchableOpacity>

                ))
              }
            </ScrollView>

            <View style={{width: "95%",height: 55,flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginVertical: 20,marginLeft: 10,}}>
              <Text style={{color: "#000",fontSize: 15,fontWeight: "bold"}}>Nombre: </Text>
              <Text style={{color: "#000",fontSize: 15,}}>{props.data.panier.length} </Text>
              <Text style={{width: 150,height: 55,color: "#000",textAlign: "center",justifyContent: "center",paddingVertical: 16,backgroundColor: "#FFF", borderRadius: 50,fontSize: 15,fontWeight: "bold",borderWidth: 1,borderColor: "#FFD700"}}>
                Total: {props.data.total} F
              </Text>
              <TouchableOpacity
                onPress={commande}
                style={{width: 60,height: 60,alignItems: "center",justifyContent: "center",backgroundColor: "#FFD700",borderRadius: 50}}
              > 
                <AntDesign name='check' size={25} style={{color: "#FFF",}}/>
              </TouchableOpacity>
            </View>

          </View>}
          {showlist != 0 ? false : <View style={{width: "95%",maxHeight: screen.height/2,justifyContent: "center",alignSelf: "center",backgroundColor: '#FFF',borderRadius: 5,}}>

            <View style={{width: "90%",height: 50,alignSelf: "center",flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>

              <TouchableOpacity onPress={()=> setshowlist(showlist == 1 ? 0 : 1)} style={{width: "35%",height: 15,overflow: "hidden",flexDirection: "row",}}>
                <FontAwesome name='edit' size={15} style={{color: "#FFD700",}} />
                <Text style={{ color: "#000",fontSize: 15,fontWeight: "bold"}}>Pour: </Text>
                <Text style={{ color: "#000",fontSize: 15,}}>{comfor.name == props.data.user.name ? "vous" : comfor.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> setshowlist(showlist == 2 ? 0 : 2 )} style={{flexDirection: "row",width: "60%",height: 15,overflow: "hidden",}}>
                <FontAwesome name='edit' size={15} style={{color: "#FFD700",}}/>
                <Text style={{color: "#000",fontSize: 14,fontWeight: "bold"}}>Lieu: </Text>
                <Text style={{color: "#000",fontSize: 14,}}>
                  {loc != null ? loc.identify.city+"/"+loc.identify.subregion+"/"+loc.identify.district : false}
                </Text>
              </TouchableOpacity>

            </View>

            <ScrollView style={{width: "100%",paddingHorizontal: "5%",paddingBottom: 10,backgroundColor: "#FFF"}}>
              {
                props.data.panier.map((item, i)=>(

                  <TouchableOpacity key={i} onPress={()=>{ props.parseAction({i: i, item: item}); setclick(false); props.navigation.navigate('Restaurant'); }} style={styles.item}>

                    <View style={{width: "100%", justifyContent: "space-between", flexDirection: "row"}}>

                      <Text style={{ color : '#000', fontSize: 13, fontWeight: "normal" }}>
                        {item.name}
                        <Text style={{ color: "#228B22" }} > {item.prix} F </Text>
                      </Text>

                      <TouchableScale onPress={()=> props._panierAction(i)} style={{position: "absolute",top: -20,right: -20,zIndex: 2,width: 50,height: 50,alignItems: "center",justifyContent: "center"}}>
                        <Octicons name='diff-removed' size={20} style={{color: "#FFD700",}}/>
                      </TouchableScale>

                    </View>

                  </TouchableOpacity>

                ))
              }
            </ScrollView>

            <View style={{width: "95%",height: 55,flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginVertical: 20,marginLeft: 10,}}>
              <Text style={{color: "#000",fontSize: 15,fontWeight: "bold"}}>Nombre: </Text>
              <Text style={{color: "#000",fontSize: 15,}}>{props.data.panier.length} </Text>
              <Text style={{width: 150,height: 55,color: "#000",textAlign: "center",justifyContent: "center",paddingVertical: 16,backgroundColor: "#FFF", borderRadius: 50,fontSize: 15,fontWeight: "bold",borderWidth: 1,borderColor: "#FFD700"}}>
                Total: {props.data.total} F
              </Text>
              <TouchableOpacity
                onPress={commande}
                style={{width: 60,height: 60,alignItems: "center",justifyContent: "center",backgroundColor: "#FFD700",borderRadius: 50}}
              > 
                <AntDesign name='check' size={25} style={{color: "#FFF",}}/>
              </TouchableOpacity>
            </View>

          </View>}
          </ScrollView>
        </View>
        
        : false
      }
      {
        !click ? 
        <TouchableOpacity 
          disabled={false} 
          onPress={()=> setclick(true)} 
          style={{width: 60,height: 60,alignItems: "center",justifyContent: "center",position: "absolute",backgroundColor: click ? "#FFF" : "#FFD700DD",borderRadius: 50,bottom: click ? 20 : 60,right: 20,zIndex: 5,shadowColor: '#000',shadowRadius: 5,shadowOffset: {height: 10,width: 10},shadowOpacity: 0.5,elevation : 10,}}
        >
          {
            props.data.panier.length > 0 ?
            <Text style={{color: "#FFF",fontSize: 25}}>{props.data.panier.length}</Text> 
            : 
            <AntDesign name='shoppingcart' size={25} style={{color: "#FFF",}} />
          }
        </TouchableOpacity> 
        :false
      }
    </>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderTopColor: "#FFD700",
    borderTopWidth: 1
  },
  contact: {
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderBottomColor: "#FFF",
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PanierButtonComponent);