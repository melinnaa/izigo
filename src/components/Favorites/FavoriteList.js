import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";

const FavoriteList = ({ navigation }) => {

    const [myData, setMyData] = useState([])

    const db = firebase.firestore();

    db.collection("Course")
        .get()
        .then((querySnapshot) => {
            let d = querySnapshot.docs.map((doc) => {
                const id = doc.id;
                const donnees = doc.data();

                return { id, ...donnees };
            });
            setMyData(d);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


    return (
        <View style={styles.container}>
            <Text style={styles.bonjourText}>Bonjour</Text>
            <Text style={styles.nameText}>Ana,</Text>
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
        paddingTop: 30,
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
    }
})

export default FavoriteList;