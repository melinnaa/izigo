import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import FavoriteList from '../components/Favorites/FavoriteList';
import FavoriteDetails from '../components/Favorites/FavoriteDetails';

const Stack = createStackNavigator();

const FavoritePage = () => {
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
          }}
          >
            <Stack.Screen 
                name="FavoriteList" 
                component={FavoriteList} 
                options={{title:'List'}}
            />
            <Stack.Screen 
                name="FavoriteDetails" 
                component={FavoriteDetails} 
                options={{title:'Details'}}
            />
           
        </Stack.Navigator>
    )
}

export default FavoritePage;
