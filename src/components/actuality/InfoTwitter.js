import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableHighlight, Button } from 'react-native';
import axios from "axios";

const InfoTwitter = ({navigation}) => {
    const getData = async () => {
        try {
            const resp = await axios.get("https://api.twitter.com/1.1/search/tweets.json?q=RATP", {
                headers: {
                    'Authorization':`epG1qsM44KiHkrRd6WsPoaY5sh2wQD0bVjIhjw984sdlAHtJjB`,
                }
            })
            return resp
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Trafic normal</Text>
            <Text style={styles.text2}>Tout roule sur la ligne ..</Text>

            <View style={styles.screenButton}>
                <TouchableHighlight
                    style={styles.submit}>
                    <Text style={styles.submitText}>Vois plus de tweets</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => navigation.navigate('Report')}>
                    <Text style={styles.submitText}>Tweeter</Text>
                </TouchableHighlight>
            </View>
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
    text2: {
        position: 'absolute',
        left: '19.73%',
        right: '5.6%',
        top: '22%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 25,
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
    },
    screenButton:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submit:{
        marginRight:50,
        marginLeft:40,
        marginTop:10,
        padding: 20,
        backgroundColor:'#FE596F',
        borderRadius:40,
        borderWidth: 1,
        borderColor: '#fff'
      },
      submitText:{
          color:'#fff',
          textAlign:'center',
      }
})

export default InfoTwitter;
