import React, { useState, useEffect, useRef } from "react";
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlatList } from "react-native-gesture-handler";
import { Modalize } from 'react-native-modalize';



const TrafficMap = ({ route, navigation }) => {
    const { props } = route.params;

    const modalizeRef = useRef(null);

    const [line, setLine] = useState(route.params.line);
    const [station, setStation] = useState("");
    const [coords, setCoords] = useState([]);
    const [linePoints, setLinePoints] = useState([]);
    const [disruptions, setDisruptions] = useState([]);
    const [color] = useState("#" + props.color);
    const [currentPosition, setCurrentPosition] = useState([]);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [currentLongitude, setCurrentLongitude] = useState(0);
    const [directionCurrentPosition, setDirectionCurrentPosition] = useState("");
    const serviceStatus = {
        NO_SERVICE: "Aucun service",
        REDUCED_SERVICE: "Service réduit",
        SIGNIFICANT_DELAYS: "Retards importants",
        DETOUR: "Déviation",
        ADDITIONAL_SERVICE: "Service supplémentaire",
        MODIFIED_SERVICE: "Service modifié",
        OTHER_EFFECT: "Autre raison",
        UNKNOWN_EFFECT: "Raison inconnue",
        STOP_MOVED: "Suspendu"
    }

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    }

    const formatLines = (item) => {
        return {
            sections: item.sections,
            departure_date_time: item.departure_date_time,
            arrival_date_time: item.arrival_date_time,
            stop_date_times: item.sections[1].stop_date_times,
            nb_transferts: item.nb_transfers
        }
    }

    const formatLineReports = (item) => {
        return {
            pt_objects: item.pt_objects,
            id: item.line.id
        }
    }

    const formatPosition = (item) => {
        return {
            latitude: item.stop_point.coord.lat,
            longitude: item.stop_point.coord.lon,
            direction: item.route.direction.stop_area.name
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + props.fromLon + ";" + props.fromLat + "&to=" + props.toLon + ";" + props.toLat + "&max_nb_transfers=0&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchDisruptions = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/lines/" + props.id + "/disruptions/?data_freshness=realtime&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp.data.disruptions

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchLineReports = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/lines/" + props.id + "/line_reports?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchPosition = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/lines/" + props.id + "/departures?data_freshness=realtime&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })

            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const showResults = () => {
        console.log("showing")
        const data = fetchData();
        Promise.resolve(data).then((response) => {
            const line = new Array;
            const journeys = response.data.journeys;

            for (var i = 0; i < journeys.length; i++) {
                line.push(formatLines(journeys[i]));
            }

            var coordinates = [];
            line.forEach((d) => {
                console.log(d);
                //if(d.nb_transfers==0){
                for (i = 0; i < d.stop_date_times.length; i++) {
                    var coord = { latitude: parseFloat(d.stop_date_times[i].stop_point.coord.lat), longitude: parseFloat(d.stop_date_times[i].stop_point.coord.lon), name: d.stop_date_times[i].stop_point.name, departure_time: d.stop_date_times[i].departure_date_time, arrival_time: d.stop_date_times[i].arrival_date_time, nb_transfers: d.nb_transferts }
                    coordinates = [...coordinates, coord];
                }
                //}
            })
            setCoords(coordinates);
        })

    }

    //Voir comment transformer dates pour avoir temps d'arrivee

    const showDisruptions = () => {
        const data = fetchDisruptions();

        Promise.resolve(data).then((response) => {
            const disruptions = new Array;
            for (var i = 0; i < response.length; i++) {
                disruptions.push(response[i]);
            }
            setDisruptions(disruptions);
        })
    }

    const showPosition = () => {
        console.log("showing")
        const data = fetchPosition();
        Promise.resolve(data).then((response) => {
            const position = new Array;
            const pos = response.data.departures;

            for (var i = 0; i < pos.length; i++) {
                position.push(formatPosition(pos[i]));
            }

            position.forEach((d) => {
                //console.log(d);
                setCurrentPosition([...currentPosition, { latitude: parseFloat(d.latitude), longitude: parseFloat(d.longitude), direction: d.direction }])
                setCurrentLatitude(parseFloat(d.latitude));
                setCurrentLongitude(parseFloat(d.longitude));
                setDirectionCurrentPosition(d.direction);

            })


        })
    }

    const createPolyline = () => {
        let latLong = [];
        coords.map(({ latitude, longitude }) => {
            latLong.push({ latitude: latitude, longitude: longitude });
        })

        setLinePoints(latLong);
    }

    const renderItem = ({item}) => {
        return <View style={[{ paddingLeft: 10, paddingTop: 5 }]}>
            <Text style={styles.reportsText}>{serviceStatus[item.severity.effect]}</Text>
            <Text style={styles.reportDetails}>{item.messages[0].text}</Text>
        </View>
    }

    useEffect(() => {
        const timeout = setTimeout(showResults, 5000);
        showDisruptions();
        createPolyline();
        showPosition();

        return () => {
            clearTimeout(timeout);
        };
    }, [coords]);

    const getData = () => {
        return disruptions;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.inputsBoxContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Voir le traffic</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={line}
                        onChangeText={setLine}
                        placeholder="Ligne"
                        underlineColorAndroid="transparent"
                    />
                    <View style={styles.icon}>
                        <Ionicons name="search-outline" size={15} color="#959595" />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={station}
                        onChangeText={setStation}
                        placeholder="Nom de la station"
                        underlineColorAndroid="transparent"
                    />
                    <View style={styles.icon}>
                        <Ionicons name="search-outline" size={15} color="#959595" />
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={20} color="white" />
                </TouchableOpacity>
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
            >
                {
                    coords.map(({ latitude, longitude, name, departure_time, arrival_time }) =>
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            image={require("../../assets/map_marker2.png")}
                        >
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <Text style={styles.calloutText}>{props.code} - </Text>
                                        <Text style={styles.calloutText}>{name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="subway-outline" size={20} color={color} />
                                            <Text style={styles.timeText}>D: {departure_time.substr(-6).substr(0, 2) + ":" + departure_time.substr(-6).substr(2, 2)}</Text>
                                        </View>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="subway-outline" size={20} color={color} />
                                            <Text style={styles.timeText}>A: {arrival_time.substr(-6).substr(0, 2) + ":" + arrival_time.substr(-6).substr(2, 2)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                }
                <Polyline
                    coordinates={linePoints}
                    strokeColor={color} // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={4}
                />
                {
                    currentPosition.map(({ latitude, longitude, direction }) => {
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            pinColor={color}
                            title={"Direction: " + direction}
                        ></Marker>
                    })
                }
            </MapView>
            <TouchableOpacity style={styles.buttonContainer} onPress={onOpen}>
                <Text style={styles.buttonText}>Infos de la ligne</Text>
            </TouchableOpacity>
            <Modalize
                ref={modalizeRef}
                flatListProps={{
                    data: getData(),
                    renderItem: renderItem,
                    keyExtractor: item => item.id,
                    showsVerticalScrollIndicator: true,
                }}
            >
                <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
                    <Text style={styles.closeModal}>X</Text>
                </TouchableOpacity>
            </Modalize>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        margin: 1
    },
    inputsBoxContainer: {
        paddingHorizontal: 10,
        paddingVertical: 30,
        backgroundColor: "#FE596F",
        borderRadius: 10
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        //fontFamily:"NunitoBold",
        //fontWeight:"bold",
        textAlign: "center",
        padding: 5
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 35
    },
    input: {
        flex: 1,
        borderRadius: 30,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 0,
        width: 370,
        height: 50,
        backgroundColor: "white",
        color: "#000000",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        fontFamily: "NunitoBold"
    },
    icon: {
        position: 'absolute',
        display: "flex",
        right: 5
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 45 / 100,
    },
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 200,
        height: 100,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    calloutText: {
        color: 'black',
        fontFamily: 'NunitoBold',
        fontSize: 13
    },
    timeContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row'
    },
    timeText: {
        fontFamily: 'NunitoRegular',
        fontSize: 14
    },
    infosContainer: {
        paddingBottom: 55,
        borderRadius: 4,
        height: 50,
        flex: 1
    },
    reportsContainer: {
        paddingVertical: 5,
        flexDirection: 'row'
    },
    reportsText: {
        fontSize: 16,
        fontFamily: 'NunitoBold',
        color: 'black'
    },
    reportDetails: {
        fontSize: 16,
        fontFamily: 'NunitoLight',
        color: 'black'
    },
    goBack: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "white",
        opacity: 0.4
    }, 
    buttonContainer:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#FE596F",
        borderRadius:3,
        width:150,
        height:60,
        marginBottom:3
    },
    buttonText:{
        fontSize:18,
        fontFamily:'NunitoBold'
    },
    closeContainer:{
        justifyContent:"flex-end",
        alignItems:"flex-start"
    },
    closeModal:{
        color:'lightgrey'
    }
})

export default TrafficMap;