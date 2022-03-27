import React from 'react';
import {ScrollView, Dimensions, SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as FirebaseRecaptcha from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction } from '../Store/ActivityActions';


import { Ionicons, MaterialIcons, AntDesign, FontAwesome, FontAwesome5, Fontisto, Zocial, Entypo, MaterialCommunityIcons } from 'react-native-vector-icons';
import ButtonComponent from './ButtonComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");


// PROVIDE VALID FIREBASE CONFIG HERE
// https://firebase.google.com/docs/web/setup
const FIREBASE_CONFIG= {
  apiKey: "AIzaSyCH4MS7iKTm3nBaZvTYf4IViwOgsEtthj4",
  authDomain: "bouffe-96290.firebaseapp.com",
  databaseURL: "https://bouffe-96290.firebaseio.com",
  projectId: "bouffe-96290",
  storageBucket: "bouffe-96290.appspot.com",
  messagingSenderId: "783705614951",
  appId: "1:783705614951:android:77200bddd2e3b88f2c82c2",
  measurementId: "G-measurement-id",
};

try {
  if (FIREBASE_CONFIG.apiKey) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
} catch (err) {
  // ignore app already initialized error on snack
}


function LoginComponent(props) {
  const recaptchaVerifier = React.useRef(null);
  const verificationCodeTextInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [name, setName] = React.useState('');
  const [verificationId, setVerificationId] = React.useState('');
  const [verifyError, setVerifyError] = React.useState();
  const [verifyInProgress, setVerifyInProgress] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);
  const [showLogoutCodeConfirmationView, setShowLogoutCodeConfirmationView] = React.useState(false);
  
  const isConfigValid = !!FIREBASE_CONFIG.apiKey;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: "100%", height: "100%" }} >
        <View style={styles.sous}>
          {/* <View style={styles.userIconContainer}>
            <FontAwesome5
              name="user-alt"
              size={40}
              color="#353D40"
              style={styles.userIcon}
            />
          </View> */}

          <View style={styles.LoginPopupTextContainer}>
            <Text style={styles.LoginPopupTitle}>
              Inscrivez-vous
            </Text>
          </View>
          <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={FIREBASE_CONFIG}
          />
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Votre prénom</Text>
            <TextInput
              style={styles.Input}
              autoFocus={false}
              autoCompleteType="name"
              keyboardType="default"
              textContentType="nickname"
              placeholder="Exemple : Fifamè"
              editable={true}
              onChangeText={(name) => setName(name)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Votre numéro de téléphone</Text>
            <TextInput
              style={styles.Input}
              autoFocus={false}
              autoCompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              placeholder="+22900094929"
              editable={true}
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />
          </View>
          <View style={styles.subTitleBottomContainer}>
            <Text style={styles.subTitleBottom}>
              Vous recevrez un code vérification par sms
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ButtonComponent
              ButtonText="Créer un compte"
              TextColor="#fff"
              TextSize={13}
              TextBold="normal"
              Background="#FFD700"
              Height={50}
              onPress={async () => 
              {
                if( phoneNumber != '' && name != '' ){
                    const phoneProvider = new firebase.auth.PhoneAuthProvider();
                    try {
                      setVerifyError(undefined);
                      setVerifyInProgress(true);
                      setVerificationId('');
                      const verificationId = await phoneProvider.verifyPhoneNumber(
                        phoneNumber,
                        // @ts-ignore
                        recaptchaVerifier.current
                      );
                      setVerifyInProgress(false);
                      setVerificationId(verificationId);
                      setShowLogoutCodeConfirmationView( true );
                    } catch (err) {
                      setVerifyError(err);
                      setVerifyInProgress(false);
                    }
                }
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <ButtonComponent
              ButtonText="Se conmnecter"
              TextColor="#353D40"
              TextSize={13}
              TextBold="normal"
              Background="#073A6A00"
              Height={50}
              onPress={async () => 
              {
                false;
              }}
            />
          </View>

        {confirmError && <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>}
        {confirmInProgress && <ActivityIndicator style={styles.loader} />}
      </View>

      {
        showLogoutCodeConfirmationView ?
        <View style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          flex: 1,
          backgroundColor: "#fff",
        }}>
          <View style={{flex: 1, zIndex: 3, position: 'relative'}}>
          <View style={styles.sous}>
                <View style={styles.userIconContainer}>
                  <MaterialCommunityIcons
                    name="cellphone-iphone"
                    size={60}
                    color="#353D40"
                    style={styles.userIcon}
                  />
                </View>

                <View style={styles.LoginPopupTextContainer}>
                  <Text style={styles.LoginPopupTitle}>
                    Vérification
                  </Text>
                  <Text style={styles.LoginPopupTitle}>
                    du code
                  </Text>
                </View>
                <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={FIREBASE_CONFIG}
                />
                
                <View style={[styles.inputContainer, {marginBottom: 20}]}>
                  <Text style={styles.inputLabel}>Code de vérification</Text>
                  <TextInput
                    style={styles.Input}
                    autoFocus={false}
                    keyboardType="phone-pad"
                    placeholder="Code à 06 chiffres"
                    editable={true}
                    onChangeText={(verificationCode) => setVerificationCode(verificationCode)}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <ButtonComponent
                    ButtonText="Vérifier le code"
                    TextColor="#fff"
                    TextSize={13}
                    TextBold="normal"
                    Background="#FFD700"
                    Height={50}
                    onPress={async () => 
                    {
                      if( verificationCode != '' ){
                        try {
                          setConfirmError(undefined);
                          setConfirmInProgress(true);
                          const credential = firebase.auth.PhoneAuthProvider.credential(
                            verificationId,
                            verificationCode
                          );
                          const authResult = await firebase.auth().signInWithCredential(credential);
                          setConfirmInProgress(false);
                          setVerificationId('');
                          setVerificationCode('');
                          verificationCodeTextInput.current?.clear();
                          Alert.alert('Phone authentication successful!');
                          props.userAction({name: name, numero: phoneNumber});
                          props.cancel();
                        } catch (err) {
                          setConfirmError(err);
                          setConfirmInProgress(false);
                        }
                      }
                    }}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <ButtonComponent
                    ButtonText="Renvoyer le code"
                    TextColor="#353D40"
                    TextSize={13}
                    TextBold="normal"
                    Background="#073A6A00"
                    Height={50}
                    onPress={async () => 
                    {
                      if( phoneNumber != '' && name != '' ){
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        try {
                          setVerifyError(undefined);
                          setVerifyInProgress(true);
                          setVerificationId('');
                          const verificationId = await phoneProvider.verifyPhoneNumber(
                            phoneNumber,
                            // @ts-ignore
                            recaptchaVerifier.current
                          );
                          setVerifyInProgress(false);
                          setVerificationId(verificationId);
                          setShowLogoutCodeConfirmationView( true );
                        } catch (err) {
                          setVerifyError(err);
                          setVerifyInProgress(false);
                        }
                      }
                    }}
                  />
                </View>
              {confirmError && <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>}
              {confirmInProgress && <ActivityIndicator style={styles.loader} />}
            </View>
            {!isConfigValid && (
              <View style={styles.overlay} pointerEvents="none">
                <Text style={styles.overlayText}>
                  To get started, set a valid FIREBASE_CONFIG in App.tsx.
                </Text>
              </View>
            )}
          </View>
        </View>
        : null
      }
      {!isConfigValid && (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.overlayText}>
            To get started, set a valid FIREBASE_CONFIG in App.tsx.
          </Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFFAA', 
    width: "100%", 
    height: "100%",
  },
  sous: {
    width: "90%",
    height: screen.height/1.5,
    marginHorizontal: "5%",
    marginVertical: screen.height/6,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 2,
    fontSize: 29,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 10,
    opacity: 0.35,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 30,
    marginBottom: 4,
  },
  textInput: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'red',
  },
  success: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'blue',
  },
  loader: {
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFFC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontWeight: 'bold',
  },
  Input: {
    backgroundColor: "#ffff",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#000",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 4,
  },

  LoginPopupCross: {
    position: "relative",
    width: "100%",
    padding: 15,
    paddingTop: 40,
    paddingLeft: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  LoginPopupCrossButton: {
    backgroundColor:"#3C3C3B80",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },

  userIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "red",
    marginBottom: 5,
  },

  userIcon: {
    backgroundColor:"#56565600",
    padding: 20,
    borderRadius: 100,
    borderColor: "#353D40",
    borderWidth: 2,
  },

  LoginPopupTextContainer: {
    marginTop: 0,
    paddingHorizontal: "10%",
    marginBottom: "3%"
  },

  LoginPopupTitle: {
    color: "#353D40",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: 'center',
  },

  LoginPopupSubTitle: {
    color: "#353D40",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    paddingHorizontal: 30,
  },

  LoginPopupButtonContainer: {
    paddingHorizontal: "8%",
    marginTop: 20,
  },

  loginContainer: {
    paddingHorizontal: "8%",
    marginTop: 10,
  },

  inputLabel: {
    color: "#353D40",
    marginTop: "5%",
    marginBottom: 5,
    fontSize: 12,
  },

  inputLabel2: {
    color: "#353D40",
    marginTop: "8%",
    marginBottom: 5,
  },

  inputContainer: {
    paddingHorizontal: "0%",
    width: "85%",
  },

  input2Container: {
    paddingHorizontal: "8%",
    marginTop: 0,
  },

  input: {
    backgroundColor: "#5F5F5F87",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#ffff",
    borderColor: "#949494",
    borderWidth: 1,
    borderRadius: 2,
  },

  input2: {
    backgroundColor: "#5F5F5F87",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#ffff",
    borderColor: "#949494",
    borderWidth: 0,
    borderRadius: 2,
  },

  subTitleBottomContainer: {
    width: "85%",
  },

  subTitleBottom: {
    color: "#353D40",
    marginTop: "1%",
    marginBottom: "10%",
    fontSize: 12,
  },

  buttonContainer: {
    width: "85%",
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);