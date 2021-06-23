import React, { useState, useEffect } from 'react'
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Button, FlatList, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Search = ({ navigation }) => {

    const [isShowingResults, setIsShowingResults] = useState(false)
    const [departureIsCurrent, setDepartureIsCurrent] = useState(false);
    const [arrivalIsCurrent, setArrivalIsCurrent] = useState(false);
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

    const getCurrentPosition = async (field) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});

        Promise.resolve(getAddress([location.coords.latitude, location.coords.longitude]))
            .then((resp) => {
                const address = resp.data.results[0].formatted_address;
                if (field == "departure") {
                    setDeparture({
                        name: resp.data.results[0].formatted_address,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.04
                    });
                    setDepartureIsCurrent(true)
                }
                else if (field == "arrival") {
                    setArrival({
                        name: resp.data.results[0].formatted_address,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.04
                    });
                    setArrivalIsCurrent(true)
                }
            })
    }

    const getAddress = async (coords) => {
        try {
            const resp = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords[0] + ',' + coords[1] + '&key=AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY')
            return resp

        } catch (err) {
            console.log(err.response);

        }
    }

    const removeCurrentPosition = (field) => {
        if (field == "departure") {
            setDeparture({
                name: "",
                latitude: 48.8534,
                longitude: 2.3488,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04
            });
            setDepartureIsCurrent(false)
        }
        else if (field == "arrival") {
            setArrival({
                name: "",
                latitude: 48.8534,
                longitude: 2.3488,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04
            });
            setArrivalIsCurrent(false)
        }
    }

    const showResults = () => {
        if (!arrival.name || !departure.name) {
            Alert.alert(
                "Remplir tous les champs",
                "Veuillez remplir tous les champs",
                [
                    {
                        text: "OK"
                    }
                ]
            );
        }
        else {
            const data = fetchData();
            Promise.resolve(data).then((response) => {
                const itineraries = new Array;
                const journeys = response.data.journeys
                for (var i = 0; i < journeys.length; i++) {
                    itineraries.push(formatItinerary(journeys[i]));
                }
                setItineraries(itineraries);
                setIsShowingResults(true);
            })
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + departure.longitude + "%3B" + departure.latitude + "&to=" + arrival.longitude + "%3B" + arrival.latitude + "&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
            Alert.alert(
                "Pas d'itinéraire",
                "Aucun itinéraire n'a été trouvé",
                [
                    {
                        text: "OK"
                    }
                ]
            );
        }
    }

    const formatItinerary = (itinerary) => {

        return {
            id: guidGenerator(),
            departure: departure,
            arrival: arrival,
            duration: Math.round(itinerary.duration / 60), //in minutes
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
        var itineraryCopy = {};
        for (var elmt in itinerary) {
            itineraryCopy[elmt] = itinerary[elmt];
        }
        itineraryCopy.sections = JSON.stringify(itinerary.sections)

        navigation.dispatch(StackActions.push('Itinerary', { itinerary: itineraryCopy }))
    }

    const guidGenerator = () => {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputsBoxContainer}>
                <View style={styles.closeIcon}>
                    <Ionicons name="close" size={28} color="white" onPress={() => navigation.navigate("Main")} />
                </View>
                <Text style={styles.title}>Où allons-nous ?</Text>

                {departureIsCurrent == true &&
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.locationIcon} onPress={() => removeCurrentPosition("departure")}>
                            <Ionicons name="locate" size={28} color="black" />
                        </TouchableOpacity>
                        <View style={styles.currentLocationText}>
                            <Text> {departure.name} </Text>
                        </View>
                    </View>
                }
                {departureIsCurrent == false &&
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.locationIcon} onPress={() => getCurrentPosition("departure")}>
                            <Ionicons name="locate-outline" size={28} color="white" />
                        </TouchableOpacity>
                        <GooglePlacesAutocomplete
                            placeholder='Départ'
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                setDeparture({
                                    name: details.address_components[0].short_name + " " + details.address_components[1].short_name,
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
                                location: '48.8534, 2.3488',
                                radius: '60000',
                                strictbounds: true,

                            }}
                            styles={{
                                container: {
                                    flex: 0,
                                    width: '80%',
                                    alignSelf: 'center',
                                    marginBottom: 10,
                                    marginTop: 10
                                },
                                textInput: {
                                    borderRadius: 30,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 20,
                                    paddingRight: 0,
                                    width: 370,
                                    height: 50,
                                },
                                listView: {
                                    borderRadius: 20
                                }
                            }}
                            nearbyPlacesAPI='GooglePlacesSearch'
                        />
                    </View>
                }
                {arrivalIsCurrent == true &&
                    <View style={[styles.inputContainer, { marginHorizontal: 20 }]}>
                        <TouchableOpacity style={styles.locationIcon} onPress={() => removeCurrentPosition("arrival")}>
                            <Ionicons name="locate" size={28} color="black" />
                        </TouchableOpacity>
                        <View style={styles.currentLocationText}>
                            <Text> {arrival.name} </Text>
                        </View>
                    </View>
                }
                {arrivalIsCurrent == false &&
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.locationIcon} onPress={() => getCurrentPosition("arrival")}>
                            <Ionicons name="locate-outline" size={28} color="white" />
                        </TouchableOpacity>
                        <GooglePlacesAutocomplete
                            placeholder='Destination'
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                setArrival({
                                    name: details.address_components[0].short_name + " " + details.address_components[1].short_name,
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
                                location: '48.8534, 2.3488',
                                radius: '60000',
                                strictbounds: true,

                            }}
                            styles={{
                                container: {
                                    flex: 0,
                                    width: '80%',
                                    alignSelf: 'center',
                                },
                                textInput: {
                                    borderRadius: 30,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 20,
                                    paddingRight: 0,
                                    width: 370,
                                    height: 50,
                                },
                                listView: {
                                    borderRadius: 20
                                }
                            }}
                        />
                    </View>
                }
                <View>
                    <TouchableOpacity onPress={() => showResults()}>
                        <View style={styles.submitBtn}>
                            <Text>Go</Text>
                        </View>
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
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => showItinerary(item)} >
                            <View style={styles.line}>
                                <View style={styles.details_line}>
                                    <View style={styles.schema}>
                                        {item.sections.map((section) => {
                                            if (section.type === "public_transport") {
                                                return (
                                                    <View style={styles.step}>
                                                        <Text style={styles.borderLeft}>
                                                            {section.display_informations.commercial_mode == "RER" &&
                                                                <View>
                                                                    <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/rer/RER' + section.display_informations.label + '.png?raw=true' }} style={{ width: 40, height: 40, top: 15 }} />
                                                                </View>
                                                            }
                                                            {section.display_informations.commercial_mode === "Bus" &&
                                                                <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, top: 15 }]}> {section.display_informations.label} </Text>
                                                            }
                                                            {section.display_informations.commercial_mode === "Métro" &&
                                                                <View>
                                                                    <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/metro/Metro' + section.display_informations.label + '.png?raw=true' }} style={{ width: 40, height: 40, top: 15 }} />
                                                                </View>
                                                            }
                                                            {section.display_informations.commercial_mode === "Train" &&
                                                                <View>
                                                                    <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, width: 40, height: 40, top: 15 }]}> {section.display_informations.label} </Text>
                                                                </View>
                                                            }
                                                        </Text>
                                                        <View style={styles.step_separator}>
                                                            <Ionicons style={styles.icon} name="radio-button-on" size={5} color="grey" />
                                                        </View>
                                                    </View>
                                                )
                                            }

                                            else if (section.type === "street_network") {
                                                return (
                                                    <View style={styles.step}>
                                                        <Ionicons name={"walk"} size={25} />
                                                        <Text>
                                                            {/* afficher le petit bonhomme + durée en secondes */}
                                                            {Math.round(section.duration / 60)} mn
                                                        </Text>
                                                        <View style={styles.step_separator}>
                                                            <Ionicons style={styles.icon} name="radio-button-on" size={5} color="grey" />
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

                    keyExtractor={item => item.id}
                />}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
    },
    inputsBoxContainer: {
        paddingHorizontal: 10,
        paddingVertical: 23,
        paddingTop: 70,
        backgroundColor: "#FE596F",
        borderRadius: 10
    },
    title: {
        color: "#ffffff",
        fontSize: 16,
        //fontFamily:"Nunito",
        //fontWeight:"bold",
        textAlign: "center",
        padding: 5
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    currentLocationText: {
        flex: 1,
        borderRadius: 50,
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 0,
        width: 370,
        height: 50,
        backgroundColor: "white",
        color: "#000000",
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 15
    },

    icon: {
        position: 'absolute',
        display: "flex",
        right: 5
    },

    locationIcon: {
        marginRight: 5
    },

    closeIcon: {
        position: 'absolute',
        display: "flex",
        top: 60,
        left: 15,
        zIndex: 5
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

    submitBtnDisabled: {
        backgroundColor: 'lightgrey',
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
        paddingTop: 20,
        paddingLeft: 10
    },
    busLabel: {
		fontSize: 20
	},
    schema: {
        width: 300,
        flexDirection: "row",
        alignItems: 'baseline',
        flexWrap: 'wrap'
    },

    step: {
        flexDirection: "row",
        alignItems: 'baseline'
    },
    step_separator: {
        marginBottom: 10,
        marginHorizontal: 10
    },
    icon: {
        paddingBottom: 2
    },
    duration: {
        paddingRight: 20,
        flexDirection: "row",
        alignItems: 'baseline'
    },
    duration_number: {
        fontSize: 30
    },
    duration_text: {
        fontSize: 15
    },
    transportLabel: {
    }
})

export default Search;