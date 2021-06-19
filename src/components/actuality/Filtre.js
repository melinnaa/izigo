import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const imagesTram = [
    { id: 1, src: require('../../assets/img/transports/tram/T1.png'), title: 'T1_RATP', description: 't1' },
    { id: 2, src: require('../../assets/img/transports/tram/T2.png'), title: 'T2_RATP', description: 'T2' },
    { id: 3, src: require('../../assets/img/transports/tram/T3A.png'), title: 't3a_ratp', description: 'T3A' },
    { id: 4, src: require('../../assets/img/transports/tram/T3B.png'), title: 'T3b_RATP', description: 'T3B' },
    { id: 5, src: require('../../assets/img/transports/tram/T4.png'), title: 'RERE_T4_SNCF', description: 'T4' },
    { id: 6, src: require('../../assets/img/transports/tram/T5.png'), title: 'T5_RATP', description: 'T5' },
    { id: 7, src: require('../../assets/img/transports/tram/T6.png'), title: 'T6_RATP', description: 'T6' },
    { id: 8, src: require('../../assets/img/transports/tram/T7.png'), title: 'T7_RATP', description: 'T7' },
    { id: 9, src: require('../../assets/img/transports/tram/T8.png'), title: 'T8_RATP', description: 'T8' },
    { id: 10, src: require('../../assets/img/transports/tram/T9.png'), title: 'T9_RATP', description: 'T9' },
    { id: 11, src: require('../../assets/img/transports/tram/T11.png'), title: 'Tram11Express', description: 'T11' },
]; 
const imagesMetro = [
    { id: 12, src: require('../../assets/img/transports/metro/Metro1.png'), title: 'Ligne1_RATP', description: 'm1' },
    { id: 13, src: require('../../assets/img/transports/metro/Metro2.png'), title: 'Ligne2_RATP', description: 'm2' },
    { id: 14, src: require('../../assets/img/transports/metro/Metro3.png'), title: 'Ligne3_RATP', description: 'm3' },
    { id: 15, src: require('../../assets/img/transports/metro/Metro3b.png'), title: 'Ligne3_RATP', description: 'm3B' },
    { id: 16, src: require('../../assets/img/transports/metro/Metro4.png'), title: 'Ligne4_RATP', description: 'm4' },
    { id: 17, src: require('../../assets/img/transports/metro/Metro5.png'), title: 'Ligne5_RATP', description: 'm5' },
    { id: 18, src: require('../../assets/img/transports/metro/Metro6.png'), title: 'Ligne6_RATP', description: 'm6' },
    { id: 19, src: require('../../assets/img/transports/metro/Metro7.png'), title: 'Ligne7_RATP', description: 'm7' },
    { id: 20, src: require('../../assets/img/transports/metro/Metro7b.png'), title: 'Ligne7_RATP', description: 'm7b' },
    { id: 21, src: require('../../assets/img/transports/metro/Metro8.png'), title: 'Ligne8_RATP', description: 'm8' },
    { id: 22, src: require('../../assets/img/transports/metro/Metro9.png'), title: 'Ligne9_RATP', description: 'm9' },
    { id: 23, src: require('../../assets/img/transports/metro/Metro10.png'), title: 'Ligne10_RATP', description: 'm10' },
    { id: 24, src: require('../../assets/img/transports/metro/Metro11.png'), title: 'Ligne11_RATP', description: 'm11' },
    { id: 25, src: require('../../assets/img/transports/metro/Metro12.png'), title: 'Ligne12_RATP', description: 'm12' },
    { id: 26, src: require('../../assets/img/transports/metro/Metro13.png'), title: 'Ligne13_RATP', description: 'm13' },
    { id: 27, src: require('../../assets/img/transports/metro/Metro14.png'), title: 'Ligne14_RATP', description: 'm14' },
];
const imagesRER = [
    { id: 28, src: require('../../assets/img/transports/rer/RERA.png'), title: 'RER_A', description: 'RA' },
    { id: 29, src: require('../../assets/img/transports/rer/RERB.png'), title: 'RERB', description: 'RB' },
    { id: 30, src: require('../../assets/img/transports/rer/RERC.png'), title: 'RERC_SNCF', description: 'RC' },
    { id: 31, src: require('../../assets/img/transports/rer/RERD.png'), title: 'RERD_SNCF', description: 'RD' },
    { id: 32, src: require('../../assets/img/transports/rer/RERE.png'), title: 'RERE_T4_SNCF', description: 'RE' },
];

const Filtre = ({ navigation, title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Un oeil sur l’actualité twitter</Text>
            <View style={styles.containerTram}>
                <Image style={styles.imageT} source={require('../../assets/img/transports/tram/tram.png')} />
                {imagesTram.map(({ id, src, title, description }) =>
                    <TouchableOpacity key={id} onPress={() => navigation.push('InfoTwitter', title)}>
                        <Image style={styles.imageTram} key={id} source={src} title={title} alt={description} />
                    </TouchableOpacity>)}
            </View>
            <View
                style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: 1,
                    top: "31%"
                }}
            ></View>
            <View style={styles.containerRER}>
                <Image style={styles.imageR} source={require('../../assets/img/transports/rer/rer.png')} />
                {imagesRER.map(({ id, src, title, description }) =>
                    <TouchableOpacity key={id} onPress={() => navigation.navigate('InfoTwitter', title)}>
                        <Image style={styles.imageRER} key={id} source={src} title={title} alt={description} />
                    </TouchableOpacity>)}
            </View>
            <View
                style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: 1,
                    top: "35%"
                }}
            ></View>
            <View style={styles.containerMetro}>
                <Image style={styles.imageM} source={require('../../assets/img/transports/metro/metro.png')} />
                {imagesMetro.map(({ id, src, title, description }) =>
                    <TouchableOpacity key={id} onPress={() => navigation.navigate('InfoTwitter', title)}>
                        <Image style={styles.imageMetro} key={id} source={src} title={title} alt={description} />
                    </TouchableOpacity>)}
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
    containerTram: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
        top: 250,
    },
    containerMetro: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
        top: "80%",
    },
    containerRER: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
        top: "70%",
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
    imageTram: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    },
    imageT: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    },
    imageMetro: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    },
    imageM: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    },
    imageRER: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    },
    imageR: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 10,
    }

})

export default Filtre;
