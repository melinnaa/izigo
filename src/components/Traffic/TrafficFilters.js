import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from 'react-native-maps';
import axios from 'axios';

const TrafficFilters = ({ navigation }) => {
    const [line, setLine] = useState("");
    const [station, setStation] = useState("");
    const [listResults, setListResults] = useState([]);
    const [listLines, setListLines] = useState([]);
    const [listTram, setListTram] = useState([]);
    const [listStation, setListStation] = useState([]);
    const [listStopAreas, setListStopAreas] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [stopArea, setStopArea] = useState("");

    const formatLines = (item) => {
        return {
            fromLon: item.routes[0].direction.stop_area.coord.lon,
            fromLat: item.routes[0].direction.stop_area.coord.lat,
            toLon: item.routes[1].direction.stop_area.coord.lon,
            toLat: item.routes[1].direction.stop_area.coord.lat,
            name: item.name,
            id: item.id,
            code: item.code,
            color: item.color
        }
    }

    const formatRER = (item) => {
        return {
            id: item.id,
            code: item.network.name + " " + item.code,
            name: item.routes[0].name,
            color: item.color,
            routes: item.routes,
            fromLon: item.routes[0].direction.stop_area.coord.lon,
            fromLat: item.routes[0].direction.stop_area.coord.lat,
            toLon: item.routes[1].direction.stop_area.coord.lon,
            toLat: item.routes[1].direction.stop_area.coord.lat,
        }
    }

    const formatStations = (item) => {
        return {
            label: item.label,
            id: item.stop_point.id,
            name: item.stop_point.name,
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
            }

            transport.forEach((d) => {
                if (d.code == line) {
                    search = { id: d.id, name: d.name, code: d.code, fromLon: d.fromLon, fromLat: d.fromLat, toLon: d.toLon, toLat: d.toLat, color: d.color }
                    setListLines([...listLines, search]);
                    setListResults([...listResults, search]);
                }
            })
        })

    }
    const showResultsTram = () => {
        console.log("showing");
        const dataTram = fetchDataTram();
        Promise.resolve(dataTram).then((response) => {
            const transport = new Array;
            const lignes = response.data.lines;

            for (var i = 0; i < lignes.length; i++) {
                transport.push(formatLines(lignes[i]));
            }

            transport.forEach((d) => {
                if (d.code == line) {
                    var search = { id: d.id, name: d.name, code: d.code, fromLon: d.fromLon, fromLat: d.fromLat, toLon: d.toLon, toLat: d.toLat, color: d.color }
                    setListResults([...listResults, search]);
                }
            })
        })
    }

    const showResultsRER = () => {
        console.log("showing");
        const dataRER = fetchDataRER();
        Promise.resolve(dataRER).then((response) => {
            const transport = new Array;
            const lignes = response.data.lines;

            for (var i = 0; i < lignes.length; i++) {
                transport.push(formatRER(lignes[i]));
            }
            
            transport.forEach((d) => {
                console.log(d.toLat);
                if (d.code == line) {
                    var search = { id: d.id, name: d.name, code: d.code, color: d.color, routes: d.routes, fromLat: d.fromLat, toLon: d.toLon, toLat: d.toLat }
                    setListTram([...listTram, search]);
                    setListResults([...listResults, search]);
                }
            })
        })

    }

    const showResultsStation = () => {
        console.log("showing")
        const data = fetchLinesForStation();
        Promise.resolve(data).then((response) => {
            //ça passe
            const transport = new Array;
            const lines = response.data.lines;

            for (var i = 0; i < lines.length; i++) {
                transport.push(formatLines(lines[i]));
            }
            transport.forEach((d) => {
                var search = { id: d.id, name: d.name, code: d.code, physical_modes: d.physical_modes }
                setListStation([...listStation, search]);
            })
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


    const fetchDataTram = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3ATramway/lines?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchDataRER = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3ARapidTransit/lines?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchDataStation = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines/" + listResults[listResults.length - 1].id + "/stop_areas?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
        }
    }

    const fetchStopAreas = async () => {
        console.log("showing")
        const data = fetchDataStation();
        Promise.resolve(data).then((response) => {
            const transport = new Array;
            const stop_areas = response.data.stop_areas;
            
            for (var i = 0; i < stop_areas.length; i++) {
                transport.push(formatStations(stop_areas[i]));
            }
            console.log(transport);
            transport.forEach(async (d) => {
                if (d.name == station) {
                    setStopArea(d.id);
                }
                //setListStopAreas([...listStopAreas,{id:d.id, name:d.name}]);
            })
        })
    }

    const fetchLinesForStation = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/physical_modes/physical_mode%3AMetro/lines/"+listResults[listResults.length-1].id+"/stop_areas/"+stopArea+"/stop_schedules?", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })

            return resp

        } catch (err) {
            console.log(err.response);
        }

    }

    const onRefresh = () => {
        setIsFetching(true);
        showResults();
        showResultsTram();
        showResultsRER();
        fetchStopAreas();
    }

    /**
     * Wait to display the list of results
     */
    useEffect(() => {
        const timeout = setTimeout(showResults, 1000);
        showResultsTram();
        showResultsRER();
        fetchDataStation();
        fetchStopAreas();
        fetchLinesForStation();

        const timeout2 = setTimeout(showResultsStation, 1000);
        return () => {
            clearTimeout(timeout);
            clearTimeout(timeout2);
        };
    }, [line, station]);
    
    if (line == "") {
        return (
            <View style={styles.container}>
                <View style={styles.inputsBoxContainer}>
                    <Text style={styles.title}>Voir le trafic</Text>
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
                    <Text style={styles.title}>Voir le trafic</Text>
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
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={listResults}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("TrafficMap", { props: item, line: line })}>
                                <TouchableOpacity style={{ backgroundColor: "#" + item.color, paddingHorizontal: 5, borderRadius: 80 }}>
                                    <Text style={styles.items}>{item.code}</Text>
                                </TouchableOpacity>
                                <Text style={styles.itemName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                        onRefresh={onRefresh}
                        refreshing={isFetching}
                    />
                </SafeAreaView>
                <View style={{ margin: 20, padding: 30 }}></View>
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
    flatList: {
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingLeft: 5
    },
    items: {
        color: "black",
        fontSize: 14,
        fontFamily: 'NunitoBold',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemName: {
        color: "black",
        fontSize: 14,
        fontFamily: 'NunitoBold',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5
    }
})

export default TrafficFilters;
