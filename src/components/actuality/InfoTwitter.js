import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import axios from "axios";

const InfoTwitter = ({ navigation, route }) => {

    const [data, setdata] = useState("")

    const handleSubmit = () => {
        getTransportIdFromApi(search).then((result) => {
            console.log(result);
            setSearch(result);
        });
    }

    useEffect(() => {
        const timeout = setTimeout(handleSubmit, 800)
        return () => {
            clearTimeout(timeout)
        }
    }, [search])

    const title = route.params;
    console.log(title)
    const getTransportIdFromApi = async () => {
        try {
            const resp = await axios.get(`https://api.twitter.com/2/users/by/username/${title}`, {
                headers: {
                    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL'}`,
                    "Access-Control-Allow-Origin": "http://localhost:19006/",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                }
            })
            console.log(resp)
            return resp
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getTransportIdFromApi();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Trafic normal</Text>
            <Text style={styles.text2}>Tout roule sur la ligne {title}</Text>

            <View style={styles.screenButton}>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => navigation.navigate('LineInfo')}>
                    <Text style={styles.submitText}>Voir plus de tweets</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => navigation.navigate('Report')}>
                    <Text style={styles.submitText}>Tweeter</Text>
                </TouchableHighlight>
            </View>

            <TouchableOpacity style={styles.touchableTwo}
				onPress={() => handleSubmit(item.id)}>
				<Ionicons
					name="plus"
					color="white"
					size={20}
				/>
			</TouchableOpacity>
            
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
        height: 80,
        left: -20,
        top: "15%",
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
        top: '16%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
    },
    text2: {
        position: 'absolute',
        left: '19.73%',
        right: '5.6%',
        top: '18%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        color: 'white',
    },
    screenButton: {
        top: "50%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    submit: {
        marginRight: 50,
        marginLeft: 40,
        marginTop: 10,
        padding: 20,
        backgroundColor: '#FE596F',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff'
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20
    }
})

export default InfoTwitter;
