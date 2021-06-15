import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import InfoTwitter from '../../components/actuality/InfoTwitter'

const images = [
    { id: 2, src: require('../../assets/img/transports/tram/T1.png'), title: 'T1', description: 't1' },
    { id: 3, src: require('../../assets/img/transports/tram/T2.png'), title: 'T2', description: 'T2' },
    { id: 4, src: require('../../assets/img/transports/tram/T3A.png'), title: 'T3A', description: 'T3A' },
    { id: 5, src: require('../../assets/img/transports/tram/T3B.png'), title: 'T3B', description: 'T3B' },
    { id: 6, src: require('../../assets/img/transports/tram/T4.png'), title: 'T4', description: 'T4' },
    { id: 7, src: require('../../assets/img/transports/tram/T5.png'), title: 'T5', description: 'T5' },
    { id: 8, src: require('../../assets/img/transports/tram/T6.png'), title: 'T6', description: 'T6' },
    { id: 9, src: require('../../assets/img/transports/tram/T7.png'), title: 'T7', description: 'T7' },
    { id: 10, src: require('../../assets/img/transports/tram/T8.png'), title: 'T8', description: 'T8' },
    { id: 11, src: require('../../assets/img/transports/tram/T9.png'), title: 'T9', description: 'T9' },
    { id: 12, src: require('../../assets/img/transports/tram/T11.png'), title: 'T11', description: 'T11' },
];

const Filtre = ({navigation}) => {    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>
            <Text style={styles.text}>Un oeil sur l’actualité twitter</Text>
            <View style={styles.containerTram}>
                <Image style={styles.imageT} source={require('../../assets/img/transports/tram/tram.png')} />
                {images.map(({ id, src, title, description }) =>
                    <TouchableOpacity onPress = {() => navigation.navigate('InfoTwitter')}>
                        <Image style={styles.imageTram} key={id} source={src} title={title} alt={description} />
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
    }

})

export default Filtre;
