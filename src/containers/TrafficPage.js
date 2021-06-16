import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from 'react-native-maps';
import { FlatList } from 'react-native-gesture-handler';

const formatResponse = (item) =>{
    return{
        lines:item.response["lines"],
        //id:item.lines[0].id
        /*name: item.name,
        commercial_mode:item.commercial_mode,
        id:item.id.toString()*/
    }
}
const API_TOKEN  = "64289681-3cbe-42ad-b6e8-d835b1fda822";
const searchLine = async (query) =>{ //metro
   if(query=="") return;
    
    const url = "https://"+API_TOKEN+"@api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode:Metro/lines?"
    //return await fetch(url)
    //.then((response) => console.log(response))
    //.catch((error) => console.log(error))
    
    //const response = await fetch("https://64289681-3cbe-42ad-b6e8-d835b1fda822@api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode:Metro/lines?");
    //const json = await response.json();
    //console.log(json);
    //return formatResponse(json);

    const resp = await fetch(url);
    const json = resp.json();

    return formatResponse(json);
}


const TrafficPage = () => {
    const [line, setLine] = useState("");
    const [station,setStation] = useState("");
    const [listResults, setListResults] = useState([]);

    const handleSubmit = () => {
        searchLine(line).then((result) => {
          setListResults(result);
          console.log(formatResponse(result).lines);
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
            <FlatList  
                data={listResults}
                keyExtractor={(item) => item.id}
                renderItem={(item)=> (
                    <View>
                        <Text>{item.s}</Text>
                    </View>
                )}
            />
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
        color:"#000000",
        display:"flex",
        alignItems:"center",
        position: "absolute",
        //fontFamily:"Nunito-Bold"
    },
    icon:{
        position:'absolute',
        display:"flex",
        right:5
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})

export default TrafficPage;
