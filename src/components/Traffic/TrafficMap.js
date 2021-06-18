import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';


const TrafficMap = ({route}) => {
    const {props} = route.params;

    const [coords,setCoords] = useState([]);

    const formatLines = (item) => {
        return {
            coord: item.coord,
            id: item.id,
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines/"+props.id+"/stop_areas?", {
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
                console.log(line)
            }
            
            line.forEach((d) =>{
                coord = {coord: d.coord}
                setCoords([...coords,coord]);
            })
        })
    }
   
    console.log(coords);
    //use Polyline and Callout from react-native-maps
    //https://github.com/react-native-maps/react-native-maps
    //chercher par lines/line: id recup dans l'autre page
    
    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        return () => {
            clearTimeout(timeout);
            //setListLines([]);
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
            />
            {
                coords.map(({coord}) => 
                    <Marker
                        pinColor='blue'
                        coordinate={{latitude:coord.lat,longitude:coord.long}}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})

export default TrafficMap;