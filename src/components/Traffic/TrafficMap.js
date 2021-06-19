import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';


const TrafficMap = ({ route }) => {
    const { props } = route.params;

    const [coords, setCoords] = useState([]);
    const [linePoints, setLinePoints] = useState([]);

    const formatLines = (item) => {
        return {
            coord: item.coord,
            id: item.id,
            label: item.label
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines/" + props.id + "/stop_areas?", {
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
            const stop_areas = response.data.stop_areas;

            for (var i = 0; i < stop_areas.length; i++) {
                line.push(formatLines(stop_areas[i]));
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

    }

    const createPolyline = () =>{
        let points = [];
        let latLong = [];
        let c = coords.map(({latitude,longitude}) => {
            //latLong.push({latitude:latitude,longitude:longitude});
            //points.push(latLong);
            ({latitude:latitude,longitude:longitude})
            
        })
        
        setLinePoints(c);
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
                    coords.map(({ latitude, longitude, label }) =>
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            pinColor='red'
                        //image={require("../../assets/map_marker.png")}
                        >
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.calloutText}>{props.code} - </Text>
                                        <Text style={styles.calloutText}>{props.name}</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                }
                <Polyline
                    coordinates={linePoints}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={3}
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
        width:450,
        height:300
    },
    calloutText:{
        color:'#000000',
        fontFamily:'NunitoBold',
        fontSize:13
    }
})

export default TrafficMap;