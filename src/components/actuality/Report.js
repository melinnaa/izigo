import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Report = () => {
    const [number, onChangeNumber] = useState(null);
    return (
        <View style={styles.container}>
            <Ionicons name={'triangle'} size={100} color={"#FE596F"} style={styles.icon} />
            <Text style={styles.title}>Signalement</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Qui de neuf sur la ligne ?"
                keyboardType="numeric"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 1
    },
    icon: {
        position: 'absolute',
        top: 100,
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
        borderColor: 'grey',
        opacity : 1,      
        top: 300,
        height: 150,
        width: 350,
        margin: 1,
        borderWidth: 1,
        borderRadius: 20
    },
})

export default Report;
