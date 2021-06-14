import React, { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const TrafficPage = () => {
    const [line, setLine] = useState("");
    const [station,setStation] = useState("");


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
                        value={line}
                        onChangeText={setLine}
                        placeholder="Nom de la station"
                        underlineColorAndroid="transparent"
                    />
                    <View style={styles.icon}>
                        <Ionicons name="search-outline" size={15} color="#959595" />
                    </View>
                </View>
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
        fontFamily:"Nunito",
        fontWeight:"light",
        textAlign:"center",
        padding:5
    },
    inputContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        margin:5
    },
    input:{
        flex:1,
        borderRadius:30,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:0,
        width: 350,
        backgroundColor:"white",
        color:"#959595",
        fontFamily:"Nunito"
    },
    icon:{
        padding:1,
    }
})

export default TrafficPage;
