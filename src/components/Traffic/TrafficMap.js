import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";


const TrafficMap = ({ route }) => {
    const { props } = route.params;

    const [coords, setCoords] = useState([]);
    const [linePoints, setLinePoints] = useState([]);
    const [lineReports, setLineReports] = useState([]);

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

    //const formatLineReports = (item) =>{}

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
                    var coord = { latitude: parseFloat(d.stop_date_times[i].stop_point.coord.lat), longitude: parseFloat(d.stop_date_times[i].stop_point.coord.lon), name: d.stop_date_times[i].stop_point.name, departure_time: d.stop_date_times[i].departure_date_time, arrival_time: d.stop_date_times[i].arrival_date_time, color:d.display_informations.color }
                    coordinates = [...coordinates, coord];
                }
            })
            setCoords(coordinates);
        })

    }

    //Voir comment transformer dates pour avoir temps d'arrivee

    const showReports = () => {
        console.log("showing")
        const journey = fetchData();
        const data = fetchLineReports();
        Promise.resolve(journey).then((response) => {
            Promise.resolve(data).then((response2) => {
                const line = new Array;
                const report = new Array;
                const line_stop_areas = response.data.journeys;
                const line_reports = response2.data.line_reports;
                
                
                for (var i = 0; i < line_stop_areas.length; i++) {
                    line.push(formatLines(line_stop_areas[i]));
                }

                for (var i = 0; i < line_reports.length; i++) {
                    report.push(formatLines(line_reports[i]));
                }

                
                line.forEach((d) => {
                    report.forEach((rep) => {
                        console.log(rep);
                        for (i = 0; i < d.stop_date_times.length; i++) {
                            if(d.stop_date_times[i].stop_point.name== rep.pt_objects.name){
                                var disruption = '1 perturbation(s)';
                                setLineReports([...lineReports,disruption])
                            }
                            else{
                                disruption = '0 perturbation(s)';
                                setLineReports([...lineReports,disruption])
                            }
                        }
                    })
                    
                })
    
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

    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        showReports();
        //const timeout2 = setTimeout(showReports,1000);
        createPolyline();
        return () => {
            clearTimeout(timeout);
            //clearTimeout(timeout2);
        };
    }, [coords]);

    return (
        <View>
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
                    coords.map(({ latitude, longitude, name, departure_time, arrival_time,color }) =>
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
                                            <Ionicons name="subway-outline" size={20} color="#70d8a2" />
                                            <Text style={styles.timeText}>D: {departure_time.substr(-6).substr(0, 2) + ":" + departure_time.substr(-6).substr(2, 2)}</Text>
                                        </View>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="subway-outline" size={20} color={color} />
                                            <Text style={styles.timeText}>A: {arrival_time.substr(-6).substr(0, 2) + ":" + arrival_time.substr(-6).substr(2, 2)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.reportsContainer}>
                                        <Text style={styles.reportsText}>3 perturbations</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                }
                <Polyline
                    coordinates={linePoints}
                    strokeColor="#000000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={4}
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    }
})

export default TrafficMap;