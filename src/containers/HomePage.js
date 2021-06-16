import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator }  from '@react-navigation/stack';
import Main from '../components/home/Main'
import Search from '../components/home/Search'
import Itinerary from '../components/home/Itinerary'

const Stack = createStackNavigator();

const HomePage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={Main} options={{ title: 'IziGo' }}/>
            <Stack.Screen name="Search" component={Search} options={{ title: 'Recherche' }}/>
            <Stack.Screen name="Itinerary" component={Itinerary} options={{ title: 'Itinéraire' }}/>
        </Stack.Navigator>
         
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    }
})

export default HomePage;
