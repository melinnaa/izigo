import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";

const FavoriteList = ({ navigation }) => {
    const [data, setData] = useState([
        { id: 1, course: "Pont de Sèvres - Jussieu", tempsMoyen: "50", horaires: "17h-19h", correspondances: [{ transport: "metro", ligne: "9", depart: "Pont de Sèvres", arrivee: "Michel-Ange Moltor" }, { tranport: "metro", ligne: "10", depart: "Michel-Ange Moltor", arrivee: "Jussieu" }], affluence: "moyenne", utilisation: "5" },
        { id: 2, course: "Chatillon-Montrouge - Balard", tempsMoyen: "23", horaires: "8h-10h", correspondances: [{ transport: "metro", ligne: "13", depart: "Chatillon-Montrouge", arrivee: "Portes de Vanves" }, { transport: "tramway", ligne: "3a", depart: "Portes de Vanves", arrivee: "Balard" }], affluence: "elevée", utilisation: "3" },
        { id: 3, course: "Mairie d'Issy - Bir Hakeim", tempsMoyen: "34", horaires: "14h-16h", correspondances: [{ transport: "metro", ligne: "12", depart: "Mairie d'Issy", arrivee: "Pasteur" }, { transport: "metro", ligne: "6", depart: "Pasteur", arrivee: "Bir-Hakeim" }], affluence: "Faible", utilisation: "1" },
        { id: 4, course: "Pigalle - Stade Charlety", tempsMoyen: "34", horaires: "20h-22h", correspondances: [{ transport: "metro", ligne: "2", depart: "Pigalle", arrivee: "La Chapelle" }, { transport: "rer", ligne: "B", depart: "Gare du Nord", arrivee: "Cité-Universitaire" }], affluence: "moyenne", utilisation: "2" }
    ]);

    const [myData, setMyData] = useState([])

    const db = firebase.firestore();

    /*db.collection("Course")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            id = doc.id;
            data = [];
            data.push(doc.data());
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });*/

    //const getData = () => {
        db.collection("Course")
            .get()
            .then((querySnapshot) => {
                let d = querySnapshot.docs.map((doc) => {
                    const id = doc.id;
                    const donnees = doc.data();
                   
                    return {id, ...donnees };
                });
                setMyData(d);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    //}

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
                        <TouchableOpacity onPress={() => navigation.navigate("FavoriteDetails", { props: item })}>
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
