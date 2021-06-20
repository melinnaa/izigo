import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Search = ({navigation}) => {
    const [isShowingResults, setIsShowingResults] = useState(false)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [departure, setDeparture] = useState({
        name: "",
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    });

    const [arrival, setArrival] = useState({
        name: "",
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    });

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
            console.log("wep")
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setDeparture(location);
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
            setIsShowingResults(true);
        })
    }

    const fetchData = async() => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from="+departure.longitude+"%3B"+departure.latitude+"&to="+arrival.longitude+"%3B"+arrival.latitude+"&", {
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
            id: guidGenerator(),
            departure: departure,
            arrival: arrival,
            duration: Math.round(itinerary.duration/60), //in minutes
            sections: itinerary.sections,
            timeOfDeparture: getHoursMinutes(itinerary.departure_date_time), //format: HH:MM
            timeOfArrival: getHoursMinutes(itinerary.arrival_date_time), //format: HH:MM
        }
    }

    //convert YYYYMMDDTHHMMSS to HH:MM
    const getHoursMinutes = (dateTime) => {
        return dateTime.substr(-6).substr(0, 2) + ":" + dateTime.substr(-6).substr(2, 2);
    }

    const showItinerary = (itinerary) => {
        navigation.navigate("Itinerary", {itinerary: itinerary});
    }

    const guidGenerator = () => {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
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
                    currentLocation={true}
                    currentLocationLabel={"Ma position"}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    onPress={(data, details = null) => {
                        setDeparture({
                            name: details.address_components[0].short_name +" "+ details.address_components[1].short_name,
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
                            name: details.address_components[0].short_name +" "+ details.address_components[1].short_name,
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
            {isShowingResults === false &&
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
            }
            {isShowingResults === true &&
            <FlatList
            data={itineraries}
            renderItem={({item}) => 
                <TouchableOpacity onPress={() => showItinerary(item)} >
                    <View style={styles.line}>
                        <View style={styles.details_line}>
                            <View style={styles.schema}>
                                {item.sections.map((section) => {
                                    if (section.type === "public_transport") {
                                        return (
                                            <View style={styles.step}>
                                                <Text>
                                                    {/* REMPLACER PAR DES ICONES */}
                                                    {section.display_informations.commercial_mode}
                                                    {section.display_informations.label}
                                                </Text>
                                                <View>
                                                    <Text style={styles.step_separator}>
                                                        {'>'}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }

                                    else if (section.type === "street_network"){
                                        return (
                                            <View style={styles.step}>
                                                <Ionicons name={"walk"} size={25} />
                                                <Text>
                                                    {/* afficher le petit bonhomme + durée en secondes */}
                                                    {Math.round(section.duration/60)} mn
                                                    
                                                </Text>
                                                <View>
                                                    <Text style={styles.step_separator}>
                                                        {'>'}
                                                    </Text>
                                                </View>
                                            </View>       
                                        )
                                    }
                                    
                                })}

                            </View>
                            
                            <View style={styles.departures_time}>
                                <Text></Text>
                            </View>
                        </View>
                    
                        <View style={styles.duration}>
                            <Text style={styles.duration_number}>
                                {Math.round(item.duration)}
                            </Text>
                            <Text style={styles.duration_text}>
                                min
                            </Text>
                        </View>
                
                    </View>
                </TouchableOpacity>
            }

            keyExtractor= {item => item.id} 
            />}
                    
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
        paddingTop: 70,
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
        top: 60,
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
    },

    //CSS for resultsView

    line: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: 15
    },

    schema: {
        flexDirection: "row",
        alignItems: 'baseline'
    },

    step: {
        flexDirection: "row",
        alignItems: 'baseline'
    },
    step_separator: {
        marginHorizontal: 10
    },
    duration: {
        flexDirection: "row",
        alignItems: 'baseline'
    },
    duration_number: {
        fontSize: 30
    },
    duration_text: {
        fontSize: 15
    }
})

export default Search;