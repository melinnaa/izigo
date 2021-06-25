import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableHighlight, Linking, Image, FlatList, Button } from 'react-native';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

const InfoTwitter = ({ navigation, route }) => {
    const [idTransport, setidTransport] = useState();
    const [dataTransport, setdataTransport] = useState();
    const [ImageTransport, setImageTransport] = useState();

    const title = route.params;
 
    const getImageTransport = async (idTransport) => {
        try {
            const resp = await axios.get(`https://api.twitter.com/1.1/users/show.json?user_id=${idTransport}`, {
                headers: {
                    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL'}`,
                    "Access-Control-Allow-Origin": "http://localhost:19006/",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                }
            })
            return resp.data.profile_image_url;
        } catch (err) {
            console.log(err);
        }
    };

    const getDataTransport = async (idTransport) => {
        try {
            const resp = await axios.get("https://api.twitter.com/2/users/" + idTransport + "/tweets?tweet.fields=context_annotations", {
                headers: {
                    Authorization: `Bearer ${'AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL'}`,
                    "Access-Control-Allow-Origin": "http://localhost:19006/",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                }
            })
            return resp.data.data;

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
            return resp.data.data.id;

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!dataTransport){
            fetchAllData();
        }
        
    }, []);

    const fetchAllData = () => {
        //get transport id 
        const data1 = getTransportId();
        Promise.resolve(data1).then((id) => {
            setidTransport(id);
            //get image url of the transport 
            const data2 = getImageTransport(id);
            Promise.resolve(data2).then((image_url) => {
                setImageTransport(image_url);
                //get all data of the transport
                const data3 = getDataTransport(id);
                Promise.resolve(data3).then((mydata) => {    
                    const tab = [];
                    for (var i = 0; i < 3; i++) {
                        tab.push(mydata[i].text)
                    }
                    setdataTransport(tab);
                })
            })
        })
    }
    return (
        <View style={[styles.container]}>
            <Ionicons
                name={'arrow-back'} size={35}
                title=""
                style={styles.returnButton}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <Ionicons
                name={'refresh'} size={35}
                title=""
                style={styles.refreshButton}
                //onPress={refreshPage}
            />
            <Text style={styles.title}>Info Traffic</Text>
            <Image
                style={styles.ImageBigTransport}
                source={{ uri: ImageTransport }}
            />
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Trafic sur {title}</Text>
            <FlatList
                style={[styles.flatlist]}
                data={dataTransport}
                renderItem={({ item }) => (
                    <View>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{ uri: ImageTransport }}
                        />
                        <View style={styles.tweet}>
                            <View style={styles.descriptionTweet}>
                                <Text style={styles.titleLigne}>{title}   <Image style={styles.imageCheck} source={require('../../assets/img/transports/check.png')} /><Text style={{ color: "#D0D0D0", fontSize: 13 }}>@{title}</Text></Text>
                                <Text style={styles.textDetail}>{item}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#D0D0D0',
                                borderBottomWidth: 1,
                                width: "97%",
                                top: "-20%"
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
                    onPress={() => navigation.push('Report')}>
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
    returnButton: {
        top: "5%",
        zIndex: 2,
        left: "5%",
    },
    refreshButton: {
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
    ImageBigTransport: {
        width: 60,
        height: 60,
        left: "80%",
        top: "-2%"
    },
    text: {
        fontFamily: 'NunitoBold',
        position: 'absolute',
        left: '27%',
        right: '5.6%',
        top: '18%',
        bottom: '79.56%',
        fontStyle: 'normal',
        fontWeight: 'bold',
        zIndex: 3,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
    },
    tweet: {
        paddingLeft: "10%",
        top: "-25%",
    },
    flatlist: {
        marginLeft: 0,
        top: "12%",
    },
    textDetail: {
        padding: 10,
    },
    titleLigne: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10
    },
    imageCheck: {
        width: 20,
        height: 20,
    },
    screenButton: {
        justifyContent: 'center',
        alignItems: 'center',
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
        fontFamily: 'NunitoBold',
        color: '#fff',
        textAlign: 'center',
        fontSize: 20
    },
})

export default InfoTwitter;
