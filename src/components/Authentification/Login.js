import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from '../../Firebase/firebase';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signIn = async () => {
        try {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                console.log(user)
            });
            navigation.navigate('FavoritePage');
        } catch (err) {
            setError(err.message);
        }
    }

    const signInAsyncGoogle = async () => {
        console.log("LoginScreen.js 6 | loggin in");
        try {
          const { type, user } = await Google.logInAsync({
            iosClientId: `509557147546-k10u0ef4hii58adpus1mp112eulqhigp.apps.googleusercontent.com`,
          });
    
          if (type === "success") {
            // Then you can use the Google REST API
            console.log("LoginScreen.js 17 | success, navigating to profile");
            navigation.navigate("Profile", { user });
          }
        } catch (error) {
          console.log("LoginScreen.js 19 | error with login", error);
        }
      };

    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../../assets/splash.png')}
            />
            <Text style={styles.title}>Se connecter</Text>
            <TextInput
                placeholder={'Email, nom d\'utilisateur'}
                onChangeText={setEmail}
                style={styles.inputName}
                keyboardType="email-address"
            />
            <TextInput
                placeholder={'Mot de passe'}
                style={styles.inputPassword}
                secureTextEntry={true}
                onChangeText={setPassword}
                returnKeyType='go'
            />
            {
                error ?
                    <Text style={{ color: 'red' }}>{error}</Text>
                    : null
            }
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.submit}
                onPress={() => signIn()}
            >
                <Text style={styles.submitText}>Se connecter</Text>
            </TouchableOpacity>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    top: "20%",
                    width: "50%"
                }}
            ></View>
            <View>
                <Text style={styles.text}>Se connecter avec</Text>
            </View>

            <View style={styles.containerLogo}>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => onFacebookButtonPress()}>
                    <Ionicons name={"logo-facebook"} size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={signInAsyncGoogle} >
                    <Ionicons name={"logo-google"} size={40}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icon}>
                    <Ionicons name={"logo-twitter"} size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icon}>
                    <Ionicons name={"logo-instagram"} size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}>
                    <Ionicons name={"logo-apple"} size={40}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.submitSignUp}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.submitTextRegister}>Pas encore de compte ?</Text>
                <Text style={styles.submitTextRegister}> Inscrivez-vous</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: "15%",
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 1
    },
    tinyLogo: {
        width: 166,
        height: 180
    },
    title: {
        position: 'absolute',
        height: "50%",
        top: "25%",
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 42,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000000',
    },
    inputName: {
        paddingVertical: 0,
        borderColor: '#D3D3D3',
        opacity: 1,
        top: "15%",
        height: "7%",
        width: "85%",
        margin: 1,
        borderWidth: 1,
        borderRadius: 70,
        fontSize: 18,
        paddingLeft: "4%"
    },
    inputPassword: {
        paddingVertical: 0,
        borderColor: '#D3D3D3',
        opacity: 1,
        top: "15%",
        height: "7%",
        width: "85%",
        marginTop: "2%",
        borderWidth: 1,
        borderRadius: 70,
        fontSize: 18,
        paddingLeft: 8,
    },
    submit: {
        top: "17%",
        width: "55%",
        marginTop: "2%",
        padding: "3%",
        backgroundColor: '#FE596F',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff'
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 25
    },
    submitTextRegister: {
        color: 'black',
        top: "580%",
        color: "#A0A0A0",
        textAlign: "center"
    },
    text: {
        top: "1100%",
    },
    containerLogo: {
        width: "100%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: "8%",
        top: "45%"
    },
    icon: {
        padding: "4%",
    }
})

export default Login;