import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from 'react-native-maps';

const formatResponse = (item) =>{
    return{
        //lines:item.lines,
        name: item.name,
        commercial_mode:item.commercial_mode,
        id:item.id.toString()
    }
}

const searchLine = async (query) =>{
    if(query=="") return;
    const response = await fetch("https://7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972@api.navitia.io/v1/coverage/sandbox/lines")
    const json = await response.json();
    console.log(json);

    return json.results.map(formatResponse);
}
const TrafficPage = () => {
    const [line, setLine] = useState("");
    const [station,setStation] = useState("");
    const [listResults, setListResults] = useState([]);

    const handleSubmit = () => {
        searchLine(line).then((result) => {
            console.log(result);
          setListResults(result);
        });
    };

    /**
     * Wait to display the list of results
     */
    useEffect(() => {
        const timeout = setTimeout(handleSubmit, 1000);
        return () => {
          clearTimeout(timeout);
        };
    }, [line]);


    return (
        <View style={styles.container}>
            <View style={styles.inputsBoxContainer}>
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
            <View>
                <MapView 
                    style={styles.map}
                    provider={MapView.PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 48.8534,
                        longitude:2.3488,
                        latitudeDelta: 0.09,
                        longitudeDelta:0.04
                      }}
                />
            </View>
        
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
    inputsBoxContainer:{
        paddingHorizontal:10,
        paddingVertical:30,
        backgroundColor:"#FE596F",
        borderRadius:10
    },
    title:{
        color:"#ffffff",
        fontSize:18,
        //fontFamily:"Nunito",
        //fontWeight:"bold",
        textAlign:"center",
        padding:5
    },
    inputContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        margin:35
    },
    input:{
        flex:1,
        borderRadius:30,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:0,
        width: 370,
        height: 50,
        backgroundColor:"white",
        color:"#959595",
        display:"flex",
        alignItems:"center",
        position: "absolute",
        //fontFamily:"Nunito-Bold"
    },
    icon:{
        //padding:2,
        position:'absolute',
        display:"flex",
        justifyContent:"flex-end",
        display:"none"
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})

export default TrafficPage;
