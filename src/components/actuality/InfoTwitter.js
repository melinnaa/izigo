import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import axios from "axios";

const InfoTwitter = () => {
    const token = "Bearer AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL"; // Replace BEARER_TOKEN with your token
    const method = "GET";
    const options = {
        method: method,
        mode: "cors",
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            Authorization: token,
        },
    };
    const query = "RATP";
    const getData = async () => {
        try {
            const response = await axios.get(
                `https://api.twitter.com/1.1/search/tweets.json?q=${query}`,
                options
            );
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Trafic normal{'\n'}</Text>
            <Text style={styles.text}>Tout roule sur la ligne ..</Text>
            <TouchableHighlight
                style={styles.submit}
                underlayColor='#fff'>
                <Text style={styles.submitText}>Vois plus de tweets</Text>
            </TouchableHighlight>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        margin: 1
    }, title: {
        position: 'absolute',
        height: 50,
        left: '25%',
        top: 60,
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 42,
        lineHeight: 49,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000000',
    },
    rectangle: {
        position: 'absolute',
        width: 500,
        height: 60,
        left: -20,
        top: 140,
        backgroundColor: '#FE596F',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    text: {
        position: 'absolute',
        left: '19.73%',
        right: '5.6%',
        top: '17.49%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 25,
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
    },
    submit:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
    },
    submitText:{
        top: 600,
        paddingTop:20,
        paddingBottom:20,
        color:'#fff',
        textAlign:'center',
        backgroundColor:'#FE596F',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#fff'
    },
})

export default InfoTwitter;
