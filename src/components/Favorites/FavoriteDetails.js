import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const FavoriteDetails = ({ route, navigation }) => {
    const { props } = route.params;
    const [transportName, setTransportName] = useState("");
    //cconsole.log(props.sections); 
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={25} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.titleText}>{props.departure.name} - {props.arrival.name}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="hourglass-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Temps moyen du parcours</Text>
                <Text style={styles.dataText}>{props.timeOfCourse} min</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="time-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Horaires habituels</Text>
                <Text style={styles.dataText}>{props.timeOfDeparture} - {props.timeOfArrival}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="navigate-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Parcours préférés</Text>
                <Text></Text>
            </View>

            {
                JSON.parse(props.sections).map((section) =>
                    <View style={styles.connectionContainer}>
                        <Text>
                            {section.display_informations && section.display_informations.commercial_mode == "RER" ? <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/rer/RER' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20, alignSelf: 'baseline', }} /> : " "}
                            {section.display_informations && section.display_informations.commercial_mode === "Bus" ?
                                <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color }]}> {section.display_informations.label} </Text>
                                : " "}
                            {section.display_informations && section.display_informations.commercial_mode === "Métro" ?
                                <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/metro/Metro' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20 }} />
                                : " "}
                            {section.display_informations && section.display_informations.commercial_mode === "Train" ?
                                <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, width: 20, height: 20 }]}> {section.display_informations.label} </Text>
                                : " "}
                        </Text>
                        <Text style={styles.connectionsText}>{section.from.name}</Text>

                        <View style={styles.step_separator}>
                            <Ionicons name="radio-button-on" size={5} color="grey" />
                        </View>
                        <Text style={styles.connectionsText}>{section.to.name}</Text>
                    </View>


                )
            }
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonItinerary}>
                    <Text style={styles.buttonText}>Voir l'itinéraire</Text>
                </TouchableOpacity>
            </View>

            {/*
            <View style={styles.itemsContainer}>
                <Ionicons name="people-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Affluence</Text>
                <Text style={styles.dataText}>{props.crowd}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <Ionicons name="calendar-outline" size={30} color="#000000" />
                <Text style={styles.itemsText}>Utilisation moyenne dans la semaine</Text>
                <Text style={styles.dataText}>{props.usage}</Text>
            </View>
            */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        //fontFamily: 'NunitoBold',
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
        //fontFamily: 'NunitoBold',
        fontSize: 14,
        //alignSelf:'flex-start'
        justifyContent: "center",
        alignItems: "center"
    },
    dataText: {
        //fontFamily: 'NunitoBold',
        fontSize: 18,
        paddingRight: 5
    },
    connectionContainer: {
        paddingTop: 40,
        paddingBottom: 10,
        paddingLeft: 30,
        textAlign: "center",
        flexDirection: "row",
        width: 200,

    },
    connectionsText: {
        //fontFamily: "NunitoBold",
        fontSize: 14
    },
    lineText: {
        paddingRight: 10,
        //fontFamily: 'NunitoBold',
        fontSize: 14,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor:"#FE596F",
        marginVertical: 15
    },
    buttonItinerary: {
        backgroundColor: "#FE596F",
        width: 140,
        height: 60,
        borderRadius: 6,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    buttonText: {
        //fontFamily: 'NunitoBold',
        fontSize: 14,
        color: "white"
    },
    step_separator: {
        marginHorizontal: 7,
        alignSelf: 'center'
    }
});

export default FavoriteDetails;