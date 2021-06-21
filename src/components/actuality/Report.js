import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Linking,
    TouchableHighlight
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Report = () => {
    const [twitterViaAccount, settwitterViaAccount] = useState(
        '#RATP #ligne_1',
    );
    const [tweetContent, setTweetContent] = useState(
        'Il ya un bagage perdu dans la ligne 1 ! un retard ca cest sur!',
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
                <Ionicons name={'triangle'} size={100} color={"#FE596F"} style={styles.iconTriangle} />
                <Ionicons name={'alert'} size={60} color={"white"} style={styles.iconAlert} />

                <Text style={styles.title}>Signalement</Text>
                <TextInput
                    value={tweetContent}
                    onChangeText={
                        (tweetContent) => setTweetContent(tweetContent)
                    }
                    placeholder={'Qui de neuf sur la ligne ?'}
                    style={styles.input}
                    multiline={true}
                />

                <TextInput
                    value={twitterViaAccount}
                    onChangeText={(twitterViaAccount) =>
                        settwitterViaAccount(twitterViaAccount)
                    }
                    placeholder={'#RATP #ligne13'}
                    style={styles.inputHashtag}
                    multiline={true}
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

/*import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Report = () => {
    const [number, onChangeNumber] = useState(null);
    return (
        <View style={styles.container}>
            <Ionicons name={'triangle'} size={100} color={"#FE596F"} style={styles.iconTriangle} />
            <Ionicons name={'alert'} size={60} color={"white"} style={styles.iconAlert} />

            <Text style={styles.title}>Signalement</Text>
            <TextInput
                style={styles.input}
                value={tweetContent}
          onChangeText={
            (tweetContent) => setTweetContent(tweetContent)
          }
                placeholder="Qui de neuf sur la ligne ?"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.inputHashtag}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="#RATP #ligne13"
                keyboardType="numeric"
            />

            <TouchableHighlight
                style={styles.submit}
                onPress={() => navigation.navigate('Report')}>
                <Text style={styles.submitText}>Tweeter</Text>
            </TouchableHighlight>
        </View>
    )
}*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 1
    },
    iconTriangle: {
        position: 'absolute',
        top: 100,
    },
    iconAlert: {
        position: 'absolute',
        top: 125,
    },
    title: {
        position: 'absolute',
        top: 220,
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
        top: 300,
        height: 150,
        width: 350,
        margin: 1,
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 18

    },
    inputHashtag: {
        borderColor: '#D3D3D3',
        opacity: 1,
        top: 310,
        height: 70,
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

export default Report;
