import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator }  from '@react-navigation/stack';
import Main from '../components/home/Main'
import Search from '../components/home/Search'
import Itinerary from '../components/home/Itinerary'

const Stack = createStackNavigator();

const HomePage = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Main" component={Main}/>
            <Stack.Screen name="Search" component={Search}/>
            <Stack.Screen name="Itinerary" component={Itinerary}/>
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
