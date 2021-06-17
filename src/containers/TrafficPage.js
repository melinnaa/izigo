import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, FlatList, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from 'react-native-maps';
import axios from 'axios';


const TrafficPage = () => {
    const [line, setLine] = useState("");
    const [station, setStation] = useState("");
    const [listResults, setListResults] = useState([]);
    const [isShowingResults, setIsShowingResults] = useState(false);

    const formatLines = (item) => {
        return {
            name: item.name,
            id: item.id,
            code: item.code
        }
    }

    const showResults = () => {
        console.log("showing")
        const data = fetchData();
        Promise.resolve(data).then((response) => {
            const transport = new Array;
            const lignes = response.data.lines;
            for (var i = 0; i < lignes.length; i++) {
                transport.push(formatLines(lignes[i]));
                console.log(transport)
            }
            setIsShowingResults(true);
            setListResults(transport);
            console.log(transport.filter(t => transport[0].code == line))
        })
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchDataBus = async () =>{
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const handleSubmit = () => {
        searchLine(line).then((result) => {
            setListResults(result);
            console.log(formatResponse(result).lines);
        });

    };
    console.log(listResults);
    /**
     * Wait to display the list of results
     */
    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [line]);

    if (line == "") {
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
                            longitude: 2.3488,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.04
                        }}
                    />
                </View>
                <StatusBar style="auto" />
            </View>
        )
    }
    else {
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
                <SafeAreaView style={{flex:1}}>
                    <FlatList
                        data={listResults}
                        renderItem={({item}) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.items}>{item.code}</Text>
                                <Text style={[styles.items,{paddingLeft:5}]}>{item.name}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </SafeAreaView>
                <View style={{margin:20, padding:30}}></View>
                <StatusBar style="auto" />
            </View>
        )

    }
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
        //fontFamily:"Nunito-Bold"
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
    flatList:{
        flex:1
    },
    itemContainer:{
        flexDirection:'row',
        paddingVertical:20,
        paddingLeft:5
    },
    items:{
        color:"black",
        fontSize:14,
        fontWeight:"bold"
    }
})

export default TrafficPage;
