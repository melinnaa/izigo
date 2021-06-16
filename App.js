import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomePage from "./src/containers/HomePage";
import FavoritePage from './src/containers/FavoritePage';
import ActualityPage from "./src/containers/ActualityPage";
import AccountPage from './src/containers/AccountPage';
import TrafficPage from './src/containers/TrafficPage';

const Tabs = createBottomTabNavigator();

const App = () =>{
  return (
    <NavigationContainer style={styles.container}>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case "HomePage":
                iconName = focused ? "home" : "home-outline";
                break;
              case "TrafficPage":
                iconName = focused ? "map" : "map-outline";
                break;
              case "FavoritePage":
                iconName = focused ? "heart" : "heart-outline";
                break;
              case "ActualityPage":
                iconName = focused ? "alert-circle" : "alert-circle-outline";
                break;
              case "AccountPage":
                iconName = focused ? "person" : "person-outline";
                break;
              default:
                iconName = "ban";
                break;
            }
            return <Ionicons name={iconName} size={40} color={color} />;
          },
        })}
        tabBarOptions={{ 
          activeBackgroundColor: "#F5A9B4", 
          inactiveBackgroundColor: "#f8f8f8", 
          activeTintColor:"white", 
          inactiveTintColor:"black",
          showLabel:false,
          style:{
            backgroundColor:"#f8f8f8",
            position: 'absolute',
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 100,
            paddingTop: 5,
            height: 70,
            left: 30, 
            right: 30,
            bottom: 40,
            ... styles.shadow
            
          },
          tabStyle:{
            borderRadius: 160, 
          } 
        }}
      >
        <Tabs.Screen name="HomePage">
          {(props)=><HomePage {...props}/>}
        </Tabs.Screen>
        <Tabs.Screen name="TrafficPage">
          {(props)=><TrafficPage {...props}/>}
        </Tabs.Screen>
        <Tabs.Screen name="FavoritePage">
          {(props)=><FavoritePage {...props}/>}
        </Tabs.Screen>
        <Tabs.Screen name="ActualityPage">
          {(props)=><ActualityPage {...props}/>}
        </Tabs.Screen>
        <Tabs.Screen name="AccountPage">
          {(props)=><AccountPage {...props}/>}
        </Tabs.Screen>
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
  },
});
