import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableHighlight, Linking, Image, FlatList } from 'react-native';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

const InfoTwitter = ({ navigation, route }) => {
    const [idTransport, setidTransport] = useState([]);
    const [dataTransport, setdataTransport] = useState([]);
    const title = route.params;  
    var monthNames = [ 
        "Janvier", "Février", "Mars",
        "Avril", "Mai", "Juin", "Juillet",
        "Août", "Septembre", "Octobre",
        "Novembre", "Decembre"
      ];
    let date = new Date().getDate(); 
    let MonthName = new Date().getMonth();
    let Month = monthNames[MonthName];

    const getDataTransport = async () => {
        try {
            const resp = await axios.get("https://api.twitter.com/2/users/" + idTransport + "/tweets?tweet.fields=context_annotations", {
                headers: {
                    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL'}`,
                    "Access-Control-Allow-Origin": "http://localhost:19006/",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                }
            })
            return resp;

        } catch (err) {
            console.log(err);
        }
    };

    const getTransportId = async () => {
        try {
            const resp = await axios.get(`https://api.twitter.com/2/users/by/username/${title}`, {
                headers: {
                    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL'}`,
                    "Access-Control-Allow-Origin": "http://localhost:19006/",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                }
            })
            return resp;

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchIdTransport();
        fetchDataTransport();
    }, []); 

    const fetchIdTransport = () => {
        const data = getTransportId();
        Promise.resolve(data).then((response) => {
            setidTransport(response.data.data.id);
        })
    }

    const fetchDataTransport = () => {
        const data = getDataTransport();
        Promise.resolve(data).then((response) => {
            const mydata = response.data.data;
            const tab = []; 
            for (var i = 0; i < 3; i++) {
                tab.push(mydata[i].text)
            }  
            setdataTransport(tab);
        }) 
    }
    console.log(dataTransport)
    return (
        <View style={styles.container}>
            <Ionicons
                    name={'arrow-back'} size={35}
                    title=""
                    style={styles.returnButton}
                    onPress={() => {
                        navigation.goBack();
                    }} 
                />
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Trafic sur {title}</Text>
            <FlatList
                style={styles.flatlist}
                data={dataTransport}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.titleLigne}>{title}     <Image style={styles.imageCheck} source={require('../../assets/img/transports/check.png')} />   <Text style={{color:"#D0D0D0", fontSize: 13}}>@{title} - </Text><Text style={{color:"#D0D0D0", fontSize: 13}}>{date} {Month}</Text></Text>  
                        <Text style={styles.textDetail}>{item}</Text> 
                        <View     
                            style={{ 
                                borderBottomColor: '#D0D0D0', 
                                borderBottomWidth: 1,
                                width: "97%"
                            }} 
                        ></View>
                        </View>
                )}
                keyExtractor={item => item}
            />
            <View style={styles.screenButton}>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => Linking.openURL(`https://twitter.com/${title}?ref_src=twsrc%5Etfw`)}>
                    <Text style={styles.submitText}>Voir plus de tweets</Text>
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
    }, 
    returnButton:{
        top: "5%",
        zIndex: 2, 
        left: "5%",
    },
    title: {
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
        zIndex: 1,
    },
    rectangle: {
        position: 'absolute',
        width: 500,
        height: 80,
        left: -20,
        zIndex: 2, 
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
        top: '17%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        zIndex: 3,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
    },
    flatlist: {
        marginLeft: 10,
        paddingTop: "50%"
    },
    textDetail:{
        padding: 10,
    },
    titleLigne:{
        fontSize: 15,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10
    },
    imageCheck:{
        width: 20,
        height: 20,
    },
    screenButton: {
        justifyContent: 'center',
        alignItems: 'center',
        top: "3%"
    },
    submit: { 
        marginRight: 50,
        marginLeft: 40,
        marginTop: 10,
        top: "-110%",
        padding: 15,
        backgroundColor: '#FE596F',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff'
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20
    },
})

export default InfoTwitter;
