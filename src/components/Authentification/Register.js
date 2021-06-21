import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from '../../Firebase/firebase'
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signUp = async () => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log(userCredential);

            return navigation.navigate('Login');
        }
        catch (err) {
            switch (err.code) {
                case 'auth/invalid-email':
                    return Alert.alert('Saisissez un e-mail valide');
                    break;
                case 'auth/email-already-in-use':
                    return Alert.alert('Un compte IziGo associé à cet e-mail existe déja. Veuillez recommencer.');
                    break;
                case 'auth/weak-password':
                    return Alert.alert('Le mot de passe doit comprendre au moins 6 caractères.');
                    break;
            }
            console.log(err.code);
            return navigation.navigate('Register');
        }        
    }

    async function onFacebookButtonPress() {
        try {
            await Facebook.initializeAsync({
                appId: '155973796466454',
            });
            const {
                type,
                token,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                Alert.alert('Connecté!', `Bonjour ${(await response.json()).name}!`);

                return navigation.navigate('FavoritePage');
            } else {
                return navigation.navigate('Register');
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }

    }

    const onGoogleButtonPress = async () => {
        try {
            const result = await Google.logInAsync({
                //androidClientId: YOUR_CLIENT_ID_HERE,
                iosClientId: '811011509063-chv7m4gvfug5c6vav58d6kktiobg5udg.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                return navigation.navigate('FavoritePage');

            } else {
                return navigation.navigate('Register');
            }
        } catch (e) {
            return { error: true };
        }
    };

    const onAppleButtonPress = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            return navigation.navigate('FavoritePage');
        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                return navigation.navigate('Register');
            } else {
                // handle other errors
            }
        }
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../../assets/splash.png')}
            />
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                placeholder={'Adresse e-mail'}
                onChangeText={setEmail}
                style={styles.inputName}
                keyboardType="email-address"
                returnKeyType='go'
            />
            <TextInput
                placeholder={'Mot de passe'}
                onChangeText={setPassword}
                style={styles.inputPassword}
                secureTextEntry={true}
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
                onPress={() => signUp()}
            >
                <Text style={styles.submitText}>S'inscrire</Text>
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
                    onPress={() => onGoogleButtonPress()}>
                    <Ionicons name={"logo-google"} size={40} />
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
                    onPress={() => onAppleButtonPress()}>
                    <Ionicons name={"logo-apple"} size={40} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.submitSignUp}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.submitTextLogin}>Avez vous un compte ?</Text>
                <Text style={styles.submitTextLogin}> Se connecter </Text>
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
        width: 160,
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
        width: "90%",
        marginTop: "2%",
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
        width: "90%",
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
        borderColor: '#fff',
        zIndex: 5
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 25
    },
    submitTextLogin: {
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

export default Register;