import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";
import "firebase/auth";

const FavoriteList = ({ navigation }) => {
    const user = firebase.auth().currentUser;

    const [myData, setMyData] = useState([])

    const db = firebase.firestore();

    if (user) {
        db.collection("Course")
            .get()
            .then((querySnapshot) => {
                let d = querySnapshot.docs.map((doc) => {
                    console.log(querySnapshot)
                });
                setMyData(d);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    else {
        navigation.navigate('Login');
    }

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
            const user = firebase.auth().currentUser;
            console.log(user)
            alert("Vous êtes bien déconnecter !");
        } catch (e) {
            alert("Erreur")
        }
        navigation.navigate('Login');

    }
    /*
    firebase.auth().onAuthStateChanged(user => {
        if (user){
            console.log('user is logged in ' , user)
        }
        else{
            console.log('user is logged out ')
        }
    })*/
    return (
        <View style={styles.container}>
            <Text style={styles.bonjourText}>Bonjour</Text>
            <Text style={styles.nameText}>Ana, </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.signOutButton}
                onPress={() => signOut()}
            >
                <Text style={styles.submitText}>Se déconnecter</Text>
            </TouchableOpacity>
            <View style={styles.favorisContainer}>
                <Text style={styles.favorisText}>Mes Favoris</Text>
                <Ionicons name="heart" size={35} color="#FE596F" />
            </View>
            <FlatList
                data={myData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.courseContainer}>
                            <Ionicons name="navigate-outline" size={35} color="#000000" />
                            <Text style={styles.item}>{item.departure} - {item.arrival}</Text>
                        </View>
                        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("FavoriteDetails", { props: item })}>
                            <Ionicons name="chevron-forward-outline" size={35} color="#000000" />
                        </TouchableOpacity>
                    </View>
                )}

            />
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
    bonjourText: {
        fontFamily: "NunitoLight",
        fontSize: 36,
        //fontWeight:"normal",
        paddingTop: "15%",
        paddingLeft: 20
    },
    nameText: {
        fontSize: 36,
        fontFamily: "NunitoBold",
        //fontWeight:"bold",
        paddingBottom: 45,
        paddingLeft: 20
    },
    favorisContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.2)"
    },
    courseContainer: {
        flexDirection: 'row'
    },
    favorisText: {
        fontSize: 28,
        fontFamily: "NunitoBold",
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,

    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.2)",
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    item: {
        fontSize: 14,
        fontFamily: "NunitoBold",
        alignSelf: "center",
        paddingLeft: 10
    },
    signOutButton: {
        top: "-13%",
        left: "70%",
        color: "#A0A0A0",
        textAlign: "center"
    }
})

export default FavoriteList;