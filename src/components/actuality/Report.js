import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput, Linking, Button } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Report = ({ navigation }) => {
    const [twitterViaAccount, settwitterViaAccount] = useState(
        '#RATP#ligne_1',
    );
    const [tweetContent, setTweetContent] = useState(
        '',
    );

    const tweetNow = () => {
        let twitterParameters = [];
        if (tweetContent)
            twitterParameters.push('text=' + encodeURI(tweetContent));
        if (twitterViaAccount)
            twitterParameters.push('via=' + encodeURI(twitterViaAccount));
        const url =
            'https://twitter.com/intent/tweet?'
            + twitterParameters.join('&');
        Linking.openURL(url)
            .then((data) => {
                alert('Twitter Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Ionicons
                    name={'arrow-back'} size={35}
                    title="hier"
                    style={styles.returnButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <Ionicons name={'triangle'} size={100} color={"#FE596F"} style={styles.iconTriangle} />
                <Ionicons name={'alert'} size={60} color={"white"} style={styles.iconAlert} />

                <Text style={styles.title}>Signalement</Text>
                <TextInput
                value={tweetContent}
                    placeholder={'Qui de neuf sur la ligne ?'}
                    onChangeText={
                        (tweetContent) => setTweetContent(tweetContent)
                    }
                    style={styles.input}
                    keyboardType="text"
                    textAlignVertical={'top'}
                />

                <TextInput
                    value={twitterViaAccount}
                    onChangeText={(twitterViaAccount) =>
                        settwitterViaAccount(twitterViaAccount)
                    }
                    placeholder={'#RATP #ligne13'}
                    style={styles.inputHashtag}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.submit}
                    onPress={tweetNow}>
                    <Text style={styles.submitText}>Tweeter</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 1
    },
    returnButton: {
        right: "40%",
    },
    iconTriangle: {
        position: 'absolute',
        top: "10%",
    },
    iconAlert: {
        position: 'absolute',
        top: "13%",
    },
    title: {
        position: 'absolute',
        top: "27%",
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 50,
        lineHeight: 49,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000000',
    },
    input: {
        borderColor: '#D3D3D3',
        opacity: 1,
        top: "37%",
        height: 150,
        width: 350,
        margin: 1,
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 18,
        padding: 20,
    },
    inputHashtag: {
        borderColor: '#D3D3D3',
        opacity: 1,
        top: "40%",
        height: 70,
        padding: 20,
        width: 350,
        margin: 1,
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 18
    },
    submit: {
        top: 350,
        width: 200,
        marginRight: 50,
        marginLeft: 40,
        marginTop: 10,
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
    }

})

export default Report;
