import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";
import "firebase/auth";

const FavoriteList = ({ navigation }) => {
    const user = firebase.auth().currentUser;
    
    //console.log(firebase.auth().currentUser);
    const userID = firebase.auth().currentUser.email
    var nameUser = userID.substring(0, userID.lastIndexOf("@"));
    const userUID = firebase.auth().currentUser.uid

    const [myData, setMyData] = useState([])

    const db = firebase.firestore();
        useEffect(() => {
            const dataFavoris = []
            db.collection('Favorites')
                .where("idUser", "==", userUID)
                .get()
                .then(snapshot => {
                    snapshot.docs.forEach(favoris => {
                        //let currentID = favoris.id
                        //let appObj = { ...favoris.data(), ['id']: currentID }
                        //dataFavoris.push(appObj)

                        dataFavoris.push(favoris.data())
                        //console.log(dataFavoris);
                    })
                    setMyData(dataFavoris)
                })
        }, [myData])
    
    const signOut = async () => {
        try {
            await firebase.auth().signOut();
            const user = firebase.auth().currentUser;
            alert("Vous êtes bien déconnecté !");
            navigation.navigate('Login');
        } catch (e) {
            alert("Erreur")
        }
        navigation.navigate('Login');
    }


    return (
        <View style={styles.container}>
            <Text style={styles.bonjourText}>Bonjour</Text>
            <Text style={styles.nameText}>{nameUser}</Text>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => signOut()}
            >
                <View style={styles.signOutButton}>
                    <Ionicons name="log-out-outline" size={35} color={"black"}/>
                    <Text style={styles.submitText}>Se déconnecter</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.favorisContainer}>
                <Text style={styles.favorisText}>Mes Favoris</Text>
                <Ionicons name="heart" size={35} color="#FE596F" />
            </View>
            <FlatList
                data={myData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.courseContainer}>
                            <Ionicons name="navigate-outline" size={35} color="#000000" />
                            <Text style={styles.item}>{item.departure.name} - {item.arrival.name}</Text>
                        </View>
                        <View style={styles.chevronContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("Search", { favorite: item })}>
                                <Ionicons name="chevron-forward-outline" size={35} color="#000000" />
                            </TouchableOpacity>
                        </View>
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
        fontWeight:"normal",
        paddingTop: "15%",
        paddingLeft: 20
    },
    nameText: {
        fontSize: 36,
        fontFamily: "NunitoBold",
        fontWeight:"bold",
        paddingBottom: 45,
        paddingLeft: 20
    },
    favorisContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.2)"
    },
    courseContainer: {
        flexDirection: 'row',
        paddingRight: 20,
    },
    chevronContainer: {
        paddingRight: 10,
        //paddingRight: 10
        justifyContent:'flex-end'
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
        paddingRight: "20%",
        paddingLeft: "5%",
    },
    item: {
        fontSize: 14,
        fontFamily: "NunitoBold",
        alignItems: "center",
        justifyContent: 'flex-start',
        paddingLeft: 10,
        paddingRight: 20
    },
    signOutButton: {
        top: "-15%",
        right:30,
        color: "#A0A0A0",
        textAlign: "center",
        borderRadius: 6,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-end"
    }
})

export default FavoriteList;