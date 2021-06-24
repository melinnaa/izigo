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
    const [coords, setCoords] = useState();
    const [linePoints, setLinePoints] = useState();
    const [disruptions, setDisruptions] = useState([]);
    const [color] = useState("#" + props.color);
    const [currentPosition, setCurrentPosition] = useState([]);
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

    const formatLines = (item) => {
        return {
            sections: item.sections,
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
        }
    }

    const fetchStopSchedules = async (stop_point_id) => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/stop_points/"+stop_point_id+"/stop_schedules?count=10&items_per_schedule=2&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            });

            return resp.data.stop_schedules;

        } catch (err) {
            console.log(err)
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
        }
    }

    const showResults = () => {
        const data = fetchData();
        Promise.resolve(data).then((resp1) => {
            const line = new Array;
            const journeys = resp1.data.journeys;
            for (var i = 0; i < journeys.length; i++) {
                line.push(formatLines(journeys[i]));
            }

            var coordinates = [];
            var linePoints = [];

            line.forEach((d) => {
                for (var i = 0; i < d.stop_date_times.length; i++) {
                    const stop_point = d.stop_date_times[i].stop_point
                    const stop_schedules = fetchStopSchedules(stop_point.id);
                    Promise.resolve(stop_schedules).then((sc) => {
                        var stopSchedulesByDirection = [];
                        //Usually 2 directions in one stop point but maybe more for RER
                        for (var j = 0; j < sc.length; j++){
                            stopSchedulesByDirection = [...stopSchedulesByDirection, {direction: sc[j].route.direction.name , nextArrival: sc[j].date_times[0].date_time, nextArrival2: sc[j].date_times[1].date_time}]
                        }

                        var coord = { latitude: parseFloat(stop_point.coord.lat), longitude: parseFloat(stop_point.coord.lon), name: stop_point.name, stopSchedulesByDirection: stopSchedulesByDirection, nb_transfers: d.nb_transferts }
                        coordinates = [...coordinates, coord];

                        var linePoint = { latitude: parseFloat(stop_point.coord.lat), longitude: parseFloat(stop_point.coord.lon) }
                        linePoints = [...linePoints, linePoint];

                        setCoords(coordinates);
                        setLinePoints(linePoints)
                    })
                }
            })
        })

    }

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
        const data = fetchPosition();
        Promise.resolve(data).then((response) => {
            const position = new Array;
            const pos = response.data.departures;

            for (var i = 0; i < pos.length; i++) {
                position.push(formatPosition(pos[i]));
            }

            position.forEach((d) => {
                setCurrentPosition([...currentPosition, { latitude: parseFloat(d.latitude), longitude: parseFloat(d.longitude), direction: d.direction }]);
            })
        })
    }

    const renderItem = ({item}) => {
        return <View style={[{ paddingLeft: 15, marginBottom: 15 }]}>
            <Text style={styles.reportsText}>{serviceStatus[item.severity.effect]}</Text>
            <Text style={styles.reportDetails}>{item.messages[0].text}</Text>
        </View>
    }

    useEffect(() => {
        if (!coords){
            showResults();
            showDisruptions();
        }
    }, []);

    const getData = () => {
        return disruptions;
    }

    const dateFormat = (date) => {
        const year = date.substring(0,4);
        const month = date.substring(4,6);
        const day = date.substring(6,8)
        const hours = date.substring(9,11)
        const minutes = date.substring(11,13)

        return year+'-'+month+'-'+day+'T'+hours+':'+minutes+':00'
    }

    const diffMinutesNow = (stringDate) => {
        const date = new Date(dateFormat(stringDate));
        const diff = Math.round(Math.abs(date - new Date())/60000);
        return diff.toString();
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.inputsBoxContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={35} color="white" style={{marginLeft:10}}/>
                </TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.title}>Trafic ligne {line}</Text>
                </View>
                <TouchableOpacity onPress={onOpen}>
                    <Ionicons name="information-circle-outline" size={40} color="white" />
                </TouchableOpacity>
            </View>
            {coords &&
            <MapView
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 48.8534,
                    longitude: 2.3488,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.02
                }}
            >
                {
                   coords.map(({ latitude, longitude, name, stopSchedulesByDirection }) =>
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            image={require("../../assets/map_marker2.png")}
                        >
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <View style={styles.calloutTitle}>
                                        <Text style={styles.calloutTitleText}>{props.code} - </Text>
                                        <Text style={styles.calloutTitleText}>{name}</Text>
                                    </View>
                                    <View style={styles.calloutContent}>
                                    {stopSchedulesByDirection.map((direction) => {
                                        return (
                                        <View style={styles.calloutContentLine}>
                                            <Text style={[styles.calloutContentText]}>{direction.direction}</Text>
                                            <View style={{flexDirection: "row", alignItems: 'center'}}>
                                                <Ionicons name={"cellular-outline"} color={"#128A60"} size={20} style={{marginRight: 10}}/>
                                                <Text style={[styles.calloutContentText, {fontWeight: "500", color: "#128A60"}]}>{diffMinutesNow(direction.nextArrival)} mn, {diffMinutesNow(direction.nextArrival2)} mn</Text>
                                            </View>
                                        </View>);   
                                    })}
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                }
                
                {linePoints &&
                <Polyline
                    coordinates={linePoints}
                    strokeColor={color} // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={4}
                />
                }
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
            }
            <Modalize
                HeaderComponent={
                    <View style={styles.headerModalContainer}>
                      <Text style={styles.headerModal}>Perturbations</Text>
                    </View>
                }
                ref={modalizeRef}
                flatListProps={{
                    data: getData(),
                    renderItem: renderItem,
                    keyExtractor: item => item.id,
                    showsVerticalScrollIndicator: false,
                }}
            >
            </Modalize>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
    },
    inputsBoxContainer: {
        paddingHorizontal: 10,
        paddingTop: 45,
        paddingBottom: 10,
        backgroundColor: "#FE596F",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily:"NunitoBold",
        fontWeight:"bold",
        textAlign: "center",
        padding: 2
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
        height: Dimensions.get('window').height,
    },
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 300,
        flexDirection: 'column',
    },
    calloutTitle: {
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calloutTitleText: {
        color: 'black',
        fontFamily: 'NunitoBold',
        fontSize: 14,
        fontWeight: "400",
    },
    calloutContent: {
        alignItems: 'flex-start'
    },
    calloutContentLine: {
        flexDirection: 'column',
        marginVertical:7,
    },
    calloutContentText: {
        flexWrap: 'wrap',
        width: 260,
        fontSize: 14,
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
    headerModalContainer:{
        paddingVertical: 15,
        borderBottomColor:'lightgrey',
        borderBottomWidth:1
    },
    headerModal:{
        fontFamily:'NunitoBold',
        fontSize:20,
        color:'black',
        paddingLeft:15
    }
})

export default TrafficMap;