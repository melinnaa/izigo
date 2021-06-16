import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, TouchableOpacity, Button } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Search = ({navigation}) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [departure, setDeparture] = useState({
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    });

    const [arrival, setArrival] = useState({
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    });

    const [itinerary, setItinerary] = useState({
        //durée: "duration"
        //les différentes parties du parcours (metro, marche, etc): sections
        //heure de départ: "departure_date_time"
        //heure d'arrivée: "arrival_date_time"
    })

    const [itineraries, setItineraries] = useState({
        //
    })

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const getCurrentPosition = () => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        })();
    }

    const showResults = ()=> {
        const data = fetchData();
        Promise.resolve(data).then((response)=>{
            const itineraries = new Array;
            const journeys = response.data.journeys
            for (var i=0; i<journeys.length; i++){
                itineraries.push(formatItinerary(journeys[i]));
            }
            setItineraries(itineraries);
        })
    }

    const fetchData = async() => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=2.3488%3B48.8534&to=2.2922926%3B48.8583736&", {
                headers: {
                    'Authorization':`7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const formatItinerary = (itinerary) => {
        return {
            duration: itinerary.duration,
            sections: itinerary.sections,
            departure_date_time: itinerary.departure_date_time,
            arrival_date_time: itinerary.arrival_date_time
        }
    }

    return (
        <View style={styles.container}>
                <View style={styles.inputsBoxContainer}>
                <View style={styles.closeIcon}>
                    <Ionicons name="close" size={28} color="white" onPress={()=> navigation.navigate("Main")}/>
                </View>
                <Text style={styles.title}>Où allons-nous ?</Text>
                <GooglePlacesAutocomplete
                    placeholder='Départ'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        setDeparture({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.04
                        })
                    }}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}

                    query={{
                        key: 'AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY',
                        language: 'fr',
                        components: 'country:fr',
                        location: `${48.8534}, ${2.3488}`,
                        radius: 60000

                    }}
                    styles={{
                        container: {
                            flex: 0,
                            width: '90%',
                            alignSelf: 'center',
                            marginBottom: 10,
                            marginTop: 10
                        },
                        textInput: {
                            borderRadius:30,
                            paddingTop:10,
                            paddingBottom:10,
                            paddingLeft:20,
                            paddingRight:0,
                            width: 370,
                            height: 50,
                        },
                        listView: {
                            borderRadius: 20
                        }
                    }}
                />
                <GooglePlacesAutocomplete
                    placeholder='Destination'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        setArrival({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.04
                        })
                    }}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}

                    query={{
                        key: 'AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY',
                        language: 'fr',
                        components: 'country:fr',
                        location: `${48.8534}, ${2.3488}`,
                        radius: 60000

                    }}
                    styles={{
                        container: {
                            flex: 0,
                            width: '90%',
                            alignSelf: 'center',
                        },
                        textInput: {
                            borderRadius:30,
                            paddingTop:10,
                            paddingBottom:10,
                            paddingLeft:20,
                            paddingRight:0,
                            width: 370,
                            height: 50,
                        },
                        listView: {
                            borderRadius: 20
                        }
                    }}
                />
                <View style={styles.submitBtn}>
                    <TouchableOpacity onPress={() => showResults()}>
                        <Text>Go</Text>
                    </TouchableOpacity>
                </View>
        
            </View>
            <MapView 
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 48.8534,
                    longitude: 2.3488,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04
                }}
            />
            

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
    inputsBoxContainer:{
        paddingHorizontal:10,
        paddingVertical:23,
        backgroundColor:"#FE596F",
        borderRadius:10
    },
    title:{
        color:"#ffffff",
        fontSize:16,
        //fontFamily:"Nunito",
        //fontWeight:"bold",
        textAlign:"center",
        padding:5
    },
    inputContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        margin:35,
        zIndex: 10
    },
    input:{
        flex:1,
        borderRadius:30,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:0,
        width: 370,
        height: 50,
        backgroundColor:"white",
        color:"#000000",
        display:"flex",
        alignItems:"center",
        position: "absolute",
        //fontFamily:"Nunito-Bold"
    },
    icon:{
        position:'absolute',
        display:"flex",
        right:5
    },

    closeIcon:{
        position:'absolute',
        display:"flex",
        top: 15,
        left: 15
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    submitBtn: {
        backgroundColor: 'white',
        width: 50,
        padding: 10,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 10,
        alignItems: 'center'
    }
})

export default Search;