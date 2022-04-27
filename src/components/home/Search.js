import React, { useState, useEffect, useRef } from 'react'
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Button, FlatList, Alert, Animated, TouchableNativeFeedbackBase } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker'

const Search = ({ navigation, route }) => {
    const [isShowingResults, setIsShowingResults] = useState(false)
    const [departureIsCurrent, setDepartureIsCurrent] = useState(false);
    const [arrivalIsCurrent, setArrivalIsCurrent] = useState(false);
    const [departureIsFavorite, setDepartureIsFavorite] = useState(false);
    const [arrivalIsFavorite, setArrivalIsFavorite] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [uniqueId, setUniqueId] = useState(0);
    const [departureIsNow, setDepartureIsNow] = useState(true);

    const animatePress = useRef(new Animated.Value(1)).current;

    const defaultDeparture = {
        name: "",
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    
    }

    const defaultArrival = {
        name: "",
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    }

    const [departure, setDeparture] = useState(defaultDeparture);

    const [arrival, setArrival] = useState(defaultArrival);

    const [favoriteParam, setFavoriteParam] = useState();
    
    const [itineraries, setItineraries] = useState({
        //
    })

    useEffect(() => {
        if (route.params && route.params.favorite != favoriteParam) {
            setFavoriteParam(route.params.favorite);
            setDeparture(route.params.favorite.departure);
            setArrival(route.params.favorite.arrival);
            setDepartureIsFavorite(true);
            setArrivalIsFavorite(true);
            setDepartureIsNow(true);
        }
    }, [route.params]);

    const getCurrentPosition = async (field) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, });

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

    const cleanAdressInput = (field) => {
        if (field == "departure") {
            setDepartureIsCurrent(false);
            setDepartureIsFavorite(false);
            setDeparture({
                name: "",
                latitude: 48.8534,
                longitude: 2.3488,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04
            });
        }
        else if (field == "arrival") {
            setArrivalIsCurrent(false);
            setArrivalIsFavorite(false);
            setArrival({
                name: "",
                latitude: 48.8534,
                longitude: 2.3488,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04
            });
        }
    }

    const showResults = () => {
        if (arrival.name && departure.name) {
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
            if (departureIsNow) {
                const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + departure.longitude + "%3B" + departure.latitude + "&to=" + arrival.longitude + "%3B" + arrival.latitude + "&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }})
                return resp
            }
            else {
                const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + departure.longitude + "%3B" + departure.latitude + "&to=" + arrival.longitude + "%3B" + arrival.latitude + "&datetime=" + formateDateForApi(date, time), {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }})
                return resp
            }

        } catch (err) {
            console.log(err.response);
            Alert.alert(
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

    const convertMinutesInHours = (num) => { 
        var hours = Math.floor(num / 60);  
        var minutes = num % 60;
        return hours + "h" + minutes;         
    }

    const getDateMonthYear = (date) => {
        var dateString = ('0'+new Date(date).getDate()).slice(-2)+"-"+('0'+(new Date(date).getMonth()+1)).slice(-2)+"-"+new Date(date).getFullYear();
        return dateString
    }

    const [date, setDate] = useState(getDateMonthYear(new Date()));
    const [time, setTime] = useState(('0'+new Date().getHours()).slice(-2)+":"+('0'+new Date().getMinutes()).slice(-2));
    

    const selectDate = () => {
        Animated.event(animatePress, {
            useNativeDriver: true // Add This line
        }).start();
    }

    const formateDateForApi = (dateString, timeString) => {
        var dateSplit = dateString.split("-");
        var date = dateSplit[0];
        var month = dateSplit[1];
        var year = dateSplit[2];
        var timeSplit = timeString.split(":");
        var hours = timeSplit[0];
        var minutes = timeSplit[1];
        return year+month+date+"T"+hours+minutes+'00'
    }

    useEffect(() => {
        showResults();
    }, [departure, arrival, time, date, departureIsNow]);

    return (
        <View style={styles.container} key={uniqueId}>
            <View style={styles.inputsBoxContainer}>
                <View style={styles.closeIcon}>
                    <Ionicons name="close" size={28} color="white" onPress={() => navigation.navigate("Main")} />
                </View>
                <Text style={styles.title}>Où allons-nous ?</Text>
                    <View style={[styles.inputContainer, {marginHorizontal: (departureIsCurrent || departureIsFavorite) ? 20 : 0 }]}>
                        <TouchableOpacity style={styles.locationIcon} onPress={() => getCurrentPosition("departure")}>
                            <Ionicons name="locate-outline" size={28} color={departureIsCurrent == true ? "lightblue" : "white"} />
                        </TouchableOpacity>
                        {(departureIsCurrent == true || departureIsFavorite == true) &&
                        <View style={styles.currentLocationText}>
                            <Text> {departure.name} </Text>
                            <Ionicons name="close-circle" size={17} color="lightgrey" onPress={() => cleanAdressInput("departure")}
                            style={{
                                position: 'absolute',
                                right: 4,
                                bottom: 15
                            }}/>
                        </View>
                        }
                        {(departureIsCurrent == false && departureIsFavorite == false) &&
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
                    }
                    </View>

                <View style={[styles.inputContainer, {marginHorizontal: (arrivalIsCurrent || arrivalIsFavorite) ? 20 : 0 }]}>
                    <TouchableOpacity style={styles.locationIcon} onPress={() => getCurrentPosition("arrival")}>
                        <Ionicons name="locate-outline" size={28} color={arrivalIsCurrent == true ? "lightblue" : "white"}/>
                    </TouchableOpacity>
                    {(arrivalIsCurrent == true || arrivalIsFavorite == true) &&
                    <View style={styles.currentLocationText}>
                        <Text> {arrival.name} </Text>
                        <Ionicons name="close-circle" size={17} color="lightgrey" onPress={() => cleanAdressInput("arrival")}
                        style={{
                            position: 'absolute',
                            right: 4,
                            bottom: 15
                        }}/>
                    </View>
                    }
                    {(arrivalIsCurrent == false && arrivalIsFavorite == false) &&
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
                    }
                </View>
                <View style={[{marginTop: 8, marginBottom: 20, marginLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around'}]}>
                    <View style={[{ display: 'flex', flexDirection: 'column', paddingTop: 10}]}>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: 'white', marginRight: 10}}>
                                Départ à 
                            </Text>
                            {departureIsNow &&
                            <TouchableOpacity onPress={() => setDepartureIsNow(false)}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name='caret-down-outline' color={'white'} size={15}></Ionicons>
                                    <Text style={{color: 'white', marginLeft: 2, fontWeight: 'bold'}}>
                                        maintenant
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            }
                            {!departureIsNow &&
                            <TouchableOpacity onPress={() => setDepartureIsNow(true)}>
                                <Ionicons name='caret-up-outline' color={'white'} size={15}></Ionicons>
                            </TouchableOpacity>
                            }
                        </View>
                        <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10}]}>
                                <DatePicker
                                    disabled={departureIsNow}
                                    style={{width: 50}}
                                    date={time}
                                    mode="time"
                                    placeholder="sélectionner une heure"
                                    format="HH:mm"
                                    confirmBtnText="OK"
                                    cancelBtnText="annuler"
                                    customStyles={{
                                        dateText: {
                                            color: '#FC7F90',
                                        },
                                        disabled: {
                                            backgroundColor: '#FC7F90',
                                            
                                        },
                                        dateIcon: {
                                            display: 'none'
                                        },
                                        dateInput: {
                                            borderWidth: 0,
                                            backgroundColor: 'white'
                                        },
                                        datePicker: {
                                            marginHorizontal: 170,
                                        },
                                        btnTextConfirm: {
                                            color: '#FE596F'
                                        }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(time) => {setTime(time)}}
                                />  
                                <DatePicker
                                    date={date}
                                    disabled={departureIsNow}
                                    minDate={new Date()}
                                    style={{width: 90, marginLeft: 10, backgroundColor: 'black'}}
                                    mode="date"
                                    placeholder="sélectionner une date"
                                    format="DD-MM-YYYY"
                                    confirmBtnText="OK"
                                    cancelBtnText="annuler"
                                    showIcon={false}
                                    customStyles={{
                                        dateText: {
                                            color: '#FC7F90',
                                        },
                                        disabled: {
                                            backgroundColor: '#FC7F90',
                                            
                                        },
                                        dateInput: {
                                            borderWidth: 0,
                                            backgroundColor: 'white'
                                        },
                                        datePicker: {
                                            marginHorizontal: 150,
                                        },
                                        btnTextConfirm: {
                                            color: '#FE596F'
                                        }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {setDate(date)}}
                                /> 
                        </View>
                    </View>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => showResults()}>
                            <Ionicons name={"navigate-circle-outline"} size={55} color={"white"} 
                            style={{
                                shadowOffset:{  width: 2,  height: 2,  },
                                shadowColor: 'black',
                                shadowOpacity: 0.2,
                                shadowRadius: 1}}/>
                        </TouchableOpacity>
                    </View>
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
                                                    <View style={{flexDirection: "row", alignItems: 'center'}}>
                                                        <View style={[styles.step]}>                          
                                                            {section.display_informations.commercial_mode == "RER" &&
                                                                <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/rer/RER' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20, alignSelf: 'baseline',}} />
                                                            }
                                                            {section.display_informations.commercial_mode === "Bus" &&
                                                                <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color}]}> {section.display_informations.label} </Text>
                                                            }
                                                            {section.display_informations.commercial_mode === "Métro" &&
                                                                <Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/metro/Metro' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20}} />
                                                            }
                                                            {section.display_informations.commercial_mode === "Train" &&
                                                                <Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, width: 20, height: 20}]}> {section.display_informations.label} </Text>
                                                            }
                                                        </View>
                                                        <View style={styles.step_separator}>
                                                            <Ionicons name="radio-button-on" size={5} color="grey" />
                                                        </View>
                                                    </View>   
                                                )
                                            }

                                            else if (section.type === "street_network") {
                                                return (
                                                    <View>
                                                        <View style={[styles.step]}>
                                                            <Ionicons name={"walk"} size={25} />
                                                            <Text>
                                                                {/* afficher le petit bonhomme + durée en secondes */}
                                                                {Math.round(section.duration / 60)} mn
                                                            </Text>
                                                            <View style={styles.step_separator}>
                                                                <Ionicons name="radio-button-on" size={5} color="grey" />
                                                            </View>
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
                                        {Math.round(item.duration) >= 60 ? convertMinutesInHours(Math.round(item.duration)) : Math.round(item.duration)}
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
        paddingVertical: 10,
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
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingTop: 20,
        paddingBottom: 12,
        paddingLeft: 10
    },
    busLabel: {
		fontSize: 15,
	},
    schema: {
        width: 300,
        flexDirection: "row",
        flexWrap: 'wrap'
    },

    step: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'center'
    },
    step_separator: {
        marginHorizontal: 7,
        alignSelf: 'center'
    },
    duration: {
        paddingRight: 20,
        flexDirection: "row",
        alignItems: 'baseline'
    },
    duration_number: {
        fontSize: 27
    },
    duration_text: {
        fontSize: 15
    }
})

export default Search;