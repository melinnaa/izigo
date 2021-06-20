import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";


const TrafficMap = ({ route }) => {
    const { props } = route.params;

    const [coords, setCoords] = useState([]);
    const [linePoints, setLinePoints] = useState([]);

    const formatLines = (item) => {
        return {
            /*coord: item.coord,
            id: item.id,
            label: item.label*/
            sections:item.sections,
            departure_date_time:item.departure_date_time,
            arrival_date_time:item.arrival_date_time,
            stop_date_times:item.sections[1].stop_date_times
        }
    }

    //const formatLineReports = (item) =>{}

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from="+props.fromLon+";"+props.fromLat+"&to="+props.toLon+";"+props.toLat+"&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    /*const fetchLineReports = async() =>{
        console.log("showing")
        const data = fetchData();
        Promise.resolve(data).then((response) => {
            const line = new Array;
            const stop_areas = response.data.stop_areas;

            for (var i = 0; i < stop_areas.length; i++) {
                line.push(formatLines(stop_areas[i]));
            }

            line.forEach((d) => {
                try {
                    const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/stop_areas/"+d.id+"/physical_modes/physical_mode%3AMetro/line_reports?", {
                        headers: {
                            'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                        }
                    })
                    return resp
        
                } catch (err) {
                    console.log(err.response);
                }
            })
        })
    }*/

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
                for(i=0;i<d.stop_date_times.length;i++){
                    var coord = {latitude: parseFloat(d.stop_date_times[i].stop_point.coord.lat), longitude:parseFloat(d.stop_date_times[i].stop_point.coord.lon), name:d.stop_date_times[i].stop_point.name}
                    coordinates = [...coordinates, coord];
                }
                //var coord = { latitude: parseFloat(d.coord.lat), longitude: parseFloat(d.coord.lon), label:d.label }
                //coordinates = [...coordinates, coord];
                //console.log(coordinates);
                //setCoords([...coords,coord]);
            })
            setCoords(coordinates);
        })

    }

    /*const showReports = () =>{
        console.log("showing")
        const data = fetchLineReports();
        Promise.resolve(data).then((response) => {
            const line = new Array;
            const line_reports = response.data.line_reports;

            for (var i = 0; i < line_reports.length; i++) {
                line.push(formatLines(line_reports[i]));
            }

            var coordinates = [];
            line.forEach((d) => {
                var coord = { latitude: parseFloat(d.coord.lat), longitude: parseFloat(d.coord.lon), label:d.label }
                coordinates = [...coordinates, coord];
                console.log(coordinates);
                //setCoords([...coords,coord]);
            })
            setCoords(coordinates);
        })
    }*/

    const createPolyline = () =>{
        let latLong = [];
        coords.map(({latitude,longitude}) => {
            latLong.push({latitude:latitude,longitude:longitude});
        })
        
        setLinePoints(latLong);
    }

    //use Polyline and Callout from react-native-maps
    //https://github.com/react-native-maps/react-native-maps
    //chercher par lines/line: id recup dans l'autre page

    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        createPolyline();
        return () => {
            clearTimeout(timeout);
        };
    }, [coords]);
    //console.log(coords);
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
                    coords.map(({ latitude, longitude, name }) =>
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            //pinColor='red'
                            image={require("../../assets/map_marker.png")}
                        >
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <View style={{flexDirection:'row', marginBottom:5}}>
                                        <Text style={styles.calloutText}>{props.code} - </Text>
                                        <Text style={styles.calloutText}>{name}</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="subway-outline" size={20} color="#70d8a2" />
                                            <Text style={styles.timeText}>3 min</Text>
                                        </View>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="subway-outline" size={20} color="#70d8a2" />
                                            <Text>8 min</Text>
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
    calloutContainer:{
        backgroundColor:'white',
        borderRadius:4,
        paddingVertical:10,
        paddingHorizontal:15,
        width:250,
        height:150,
        alignItems:'center',
        justifyContent:'center'
    },
    calloutText:{
        color:'#000000',
        fontFamily:'NunitoBold',
        fontSize:13
    },
    timeContainer:{
        paddingHorizontal:10,
        paddingVertical:5,
        flexDirection:'row'
    },
    timeText:{
        fontFamily:'NunitoRegular',
        fontSize:14
    },
    reportsContainer:{
        paddingVertical:5,
        flexDirection:'row'
    },
    reportsText:{
        fontSize:16,
        fontFamily:'NunitoBold'
    }
})

export default TrafficMap;