

    import $ from 'jquery';
    import React from 'react'
    import { StyleSheet, Text, View } from 'react-native';
const text = () => {
    var trafic = 'https://api.navitia.io/v1/coverage/fr-idf/disruptions?count=10';

    // Call Navitia API
    $.ajax({
      type: 'GET',
      url: trafic,
      dataType: 'json',
      headers: {
        Authorization: 'Basic ' + btoa('fe15dc43-d76a-4788-897f-100247da13df')
      },
      success: displayIncident,
      error: function(xhr, textStatus, errorThrown) {
        alert('Error: ' + textStatus + ' ' + errorThrown);
      }
    });


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Traffic</Text>
            <View style={styles.rectangle}></View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
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
})

export default text;