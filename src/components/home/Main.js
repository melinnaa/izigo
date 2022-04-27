import React, { useEffect, useState } from "react";
import MapView from 'react-native-maps';
import { StyleSheet, Text, FlatList, View, Dimensions, ScrollView, Button, Image} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';

const Main = ({navigation}) => {

    const [tweets, setTweets] = useState();
    const [imageAccount, setImageAccount] = useState();

    useEffect(() => {
        if (!tweets){
            getTweets();
        }
        
    }, []);

    const getTweets = () => {
        const tweets = fetchTweets();
        Promise.resolve(tweets).then((resp) => {
            const tab = [];
            for (let i=0; i < resp.length; i++){
                tab[i] = {id: resp[i].id, text: resp[i].text}
            }
            setTweets(tab);
            const image = getImageAccount();
            Promise.resolve(image).then((resp) => {
                setImageAccount(resp);
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const fetchTweets = async() => {
        try {
            const resp = await axios.get(`https://api.twitter.com/2/users/805797645197463554/tweets?tweet.fields=context_annotations`, {
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
    }

    const getImageAccount = async () => {
        try {
            const resp = await axios.get(`https://api.twitter.com/1.1/users/show.json?user_id=805797645197463554`, {
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


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.icon}>
                    <Ionicons name="search-outline" size={19} color="white" />
                </View>
                <Text onPress={() => navigation.navigate("Search")} style={styles.input}>Où allons-nous ?</Text>
            </View>
            <MapView 
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 48.8534,
                    longitude:2.3488,
                    latitudeDelta: 0.09,
                    longitudeDelta:0.04
                    }}/>
  
            {tweets &&
                <View style={styles.actuContainer}>
                    <View style={styles.callToScroll}>
                        <Ionicons name="chevron-down" size={35} color={"#F5A9B4"} style={{marginBottom:-25}}/>
                        <Ionicons name="chevron-down" size={45} color={"#FE596F"}/>
                    </View>
                    {tweets.map((tweet) => {
                        return(
                            <View style={styles.tweetContainer} key={tweet.id}>  
                                <Image
                                    style={{width: 30, height:30, borderRadius:50}}              
                                    source={{ uri: imageAccount }}
                                />
                                <Text style={styles.tweetContent}> {tweet.text} </Text>
                                <Ionicons name="logo-twitter" size={26} color={"#1DA1F2"} style={{marginLeft: 10}}/>
                            </View>
                        )})
                    }
                </View>
            }
        </ScrollView>
         
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 1,
        flexDirection: 'column'
    },

    inputContainer:{
        position: 'absolute',
        zIndex: 1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor: "#FE596F",
        borderRadius: 50,
        width: 300,
        height: 50,
        top: 80,
        paddingLeft: 10,
        paddingRight: 0,
        marginLeft: "12%",
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
        shadowRadius: 2,
    },

    input: {
        flex: 1,
        color: "white",
        left: 15
    },

    icon:{
        //padding:2,
        display:"flex",
        left: 5,
        zIndex: 2
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*70/100
    },

    actuContainer: {
        padding: 15,
        paddingBottom: 150,
        borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
        backgroundColor: 'white',
    },

    tweetContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 30,
        padding: 30,
        marginVertical: 7,
        justifyContent: 'space-around'
    },
    tweetContent: {
        width: "80%",
        marginLeft: 15,
        fontSize: 18
    },
    callToScroll: {
        alignItems: 'center'
    }

})

export default Main;