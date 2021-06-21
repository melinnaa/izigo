import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";


const TrafficMap = ({ route, navigation }) => {
    const { props } = route.params;

    const [line, setLine] = useState(route.params.line);
    const [station, setStation] = useState("");
    const [coords, setCoords] = useState([]);
    const [linePoints, setLinePoints] = useState([]);
    const [lineReports, setLineReports] = useState([]);
    const [disruptions, setDisruptions] = useState([]);
    const [color] = useState("#" + props.color);

    const formatLines = (item) => {
        return {
            /*coord: item.coord,
            id: item.id,
            label: item.label*/
            sections: item.sections,
            departure_date_time: item.departure_date_time,
            arrival_date_time: item.arrival_date_time,
            stop_date_times: item.sections[1].stop_date_times
        }
    }

    const formatLineReports = (item) => {
        return {
            pt_objects: item.pt_objects,
            id: item.line.id
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + props.fromLon + ";" + props.fromLat + "&to=" + props.toLon + ";" + props.toLat + "&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

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
                for (i = 0; i < d.stop_date_times.length; i++) {
                    var coord = { latitude: parseFloat(d.stop_date_times[i].stop_point.coord.lat), longitude: parseFloat(d.stop_date_times[i].stop_point.coord.lon), name: d.stop_date_times[i].stop_point.name, departure_time: d.stop_date_times[i].departure_date_time, arrival_time: d.stop_date_times[i].arrival_date_time }
                    coordinates = [...coordinates, coord];
                }
            })
            setCoords(coordinates);
        })

    }

    //Voir comment transformer dates pour avoir temps d'arrivee

    const showDisruptions = () => {
        console.log("showing");
        const data = fetchLineReports();
        Promise.resolve(data).then((response) => {
            const line = new Array;
            const report = response.data.line_reports;


            for (var i = 0; i < report.length; i++) {
                line.push(formatLineReports(report[i]));
            }

            var disruption = [];

            line.forEach((d) => {

                for (let i = 0; i < d.pt_objects.length; i++) {
                    var rep = { report: d.pt_objects[i].stop_area.name }
                    disruption = [...disruption, rep]
                }

            })
            setLineReports(disruption);
        })
    }

    const createPolyline = () => {
        let latLong = [];
        coords.map(({ latitude, longitude }) => {
            latLong.push({ latitude: latitude, longitude: longitude });
        })

        setLinePoints(latLong);
    }

    const takeReports = () => {
        var pert = [];
        coords.map(({ name }) => {
            lineReports.map(({ report }) => {
                if (name == report) {
                    pert = [...pert, { pert: '1 perturbation' }]
                }
                else {
                    pert = [...pert, { pert: '0 perturbation' }];
                }
            })
        })
        setDisruptions(pert);
    }

    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        //showDisruptions();
        //takeReports();
        createPolyline();
        return () => {
            clearTimeout(timeout);
        };
    }, [coords]);

    return (
        <View style={styles.container}>
            <View style={styles.inputsBoxContainer}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
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
                                    <View style={styles.reportsContainer}>
                                       <Text style={styles.reportsText}>perturbation(s)</Text>
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
            </MapView>
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
        //fontFamily:"Nunito",
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
        height: Dimensions.get('window').height,
    },
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 200,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    calloutText: {
        color: '#000000',
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
    reportsContainer: {
        paddingVertical: 5,
        flexDirection: 'row'
    },
    reportsText: {
        fontSize: 16,
        fontFamily: 'NunitoBold'
    },
    goBack: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "white",
        opacity: 0.4
    }
})

export default TrafficMap;