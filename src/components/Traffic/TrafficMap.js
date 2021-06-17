import React, { useState } from "react";
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';


const TrafficMap = ({route}) => {
    const {props} = route.params;

    const [coords,setCoords] = useState([]);
    //use Polyline and Callout from react-native-maps
    //https://github.com/react-native-maps/react-native-maps
    //chercher par lines/line: id recup dans l'autre page
    
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