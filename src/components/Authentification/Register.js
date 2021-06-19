import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from '../../Firebase/firebase'

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signUp = async () => {
        await firebase.auth().createUserWithEmailAndPassword(email, password).catch(err => {
            switch (err.code) {
                case 'auth/invalid-password':
                    return Alert.alert('Le mot de passe doit comprendre au moins 6 caractères.');
                    break;

                case 'auth/invalid-email':
                    return Alert.alert('Saisissez un e-mail valide');
                    break;

                default:
                    Alert.alert("Veuillez remplir les champs");
            }
            return navigation.navigate('Login');
        })
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../../assets/splash.png')}
            />
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                placeholder={'Email'}
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
                    borderBottomWidth: 2,
                    paddingTop: "2%"
                }}
            ></View>
            <Text style={styles.submitTextRegister}>Avez vous un compte ?</Text>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.submitSignUp}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.submitTextRegister}> Se connecter </Text>
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
        top: "10%",
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
        top: "10%",
        height: "7%",
        width: "90%",
        marginTop: "2%",
        borderWidth: 1,
        borderRadius: 70,
        fontSize: 18,
        paddingLeft: 8,
    },
    submit: {
        top: "12%",
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
        top: 150,
        color: "#A0A0A0"
    }
})

export default Register;