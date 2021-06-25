import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import FavoriteList from '../components/Favorites/FavoriteList';
import FavoriteDetails from '../components/Favorites/FavoriteDetails';
import firebase from './../Firebase/firebase';
import '@firebase/firestore';
import AccountPage from './AccountPage';

const Stack = createStackNavigator();

const FavoritePage = ({navigation}) => {

    const user = firebase.auth().currentUser   
    
    if (!user) {
        navigation.navigate('AccountPage')
        return <Text></Text>; 
    }   
    else {
        return(
            <Stack.Navigator screenOptions={{
                headerShown: false
                }}>
                <Stack.Screen name="FavoriteList" component={FavoriteList}/>
                <Stack.Screen name="FavoriteDetails" component={FavoriteDetails}/> 
            </Stack.Navigator>
        )
    }
}

export default FavoritePage;