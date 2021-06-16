import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const FavoriteDetails = ({ route, navigation }) => {
    const { props } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={25} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.titleText}>{props.course}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="hourglass-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Temps moyen du parcours</Text>
                <Text style={styles.dataText}>{props.tempsMoyen} min</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="time-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Horaires habituels</Text>
                <Text style={styles.dataText}>{props.horaires}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="navigate-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Parcours préférés</Text>
                <Text></Text>
            </View>
            {
                props.correspondances.map(({ ligne, depart, arrivee }) =>
                    <View style={styles.connectionContainer}>
                        <Text style={styles.lineText}>{ligne}</Text>
                        <Text style={styles.connectionsText}>{depart}</Text>
                        <Text style={styles.connectionsText}> {">"} </Text>
                        <Text style={styles.connectionsText}>{arrivee}</Text>
                    </View>

                )
            }
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonItinerary}>
                    <Text style={styles.buttonText}>Voir l'itinéraire</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="people-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Affluence</Text>
                <Text style={styles.dataText}>{props.affluence}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="calendar-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Utilisation moyenne dans la semaine</Text>
                <Text style={styles.dataText}>{props.utilisation}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        paddingVertical: 30,
        marginBottom: 15,
        backgroundColor: "#FE596F",
        borderRadius: 30,
        flexDirection: "row",
        //justifyContent:"space-between"
    },
    buttonBack: {
        paddingLeft: 10
    },
    titleText: {
        color: '#ffffff',
        fontFamily: 'NunitoBold',
        fontSize: 18,
        //alignSelf:"center",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 60
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.2)",
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    itemsText: {
        fontFamily: 'NunitoBold',
        fontSize: 14,
        //alignSelf:'flex-start'
        justifyContent: "center",
        alignItems: "center"
    },
    dataText: {
        fontFamily: 'NunitoBold',
        fontSize: 18,
        paddingRight: 5
    },
    connectionContainer: {
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    connectionsText: {
        fontFamily:"NunitoBold",
        fontSize:14
    },
    lineText:{
        paddingRight:10,
        fontFamily: 'NunitoBold',
        fontSize: 14,
    }, 
    buttonContainer:{
        justifyContent:"center",
        alignItems:"center",
        //backgroundColor:"#FE596F",
        marginVertical:15
    },
    buttonItinerary:{
        backgroundColor:"#FE596F",
        width:140,
        height:60,
        borderRadius:6,
        paddingVertical:20,
        paddingHorizontal:20
    },
    buttonText:{
        fontFamily:'NunitoBold',
        fontSize:14,
        color:"white"
    }
});

export default FavoriteDetails;