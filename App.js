import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import Font, { useFonts } from "expo-font";
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomePage from "./src/containers/HomePage";
import FavoritePage from './src/containers/FavoritePage';
import ActualityPage from "./src/containers/ActualityPage";
import AccountPage from './src/containers/AccountPage';
import TrafficPage from './src/containers/TrafficPage'; 
import * as firebase from "firebase";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);


const Tabs = createBottomTabNavigator();

const App = () =>{

  var firebaseConfig = {
    apiKey: 'AIzaSyAKlKfsLPKsDGkGYqv9jIq6rbChAxebaF4 ',
    authDomain: 'izigo-82ed2.firebaseapp.com',
    databaseURL: "https://izigo-82ed2.firebaseio.com",
    storageBucket: "izigo-82ed2.appspot.com",
    projectId: 'izigo-82ed2'
  }
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const [loaded] = useFonts({
    NunitoBlack: require("./src/assets/fonts/Nunito/Nunito-Black.ttf"),
    NunitoBlackItalic: require("./src/assets/fonts/Nunito/Nunito-BlackItalic.ttf"),
    NunitoBold: require("./src/assets/fonts/Nunito/Nunito-Bold.ttf"),
    NunitoBoldItalic: require("./src/assets/fonts/Nunito/Nunito-BoldItalic.ttf"),
    NunitoExtraBold: require("./src/assets/fonts/Nunito/Nunito-ExtraBold.ttf"),
    NunitoExtraBoldItalic: require("./src/assets/fonts/Nunito/Nunito-ExtraBoldItalic.ttf"),
    NunitoExtraLight: require("./src/assets/fonts/Nunito/Nunito-ExtraLight.ttf"),
    NunitoExtraLightItalic: require("./src/assets/fonts/Nunito/Nunito-ExtraLightItalic.ttf"),
    NunitoItalic: require("./src/assets/fonts/Nunito/Nunito-Italic.ttf"),
    NunitoLight: require("./src/assets/fonts/Nunito/Nunito-Light.ttf"),
    NunitoLightItalic: require("./src/assets/fonts/Nunito/Nunito-LightItalic.ttf"),
    NunitoRegular: require("./src/assets/fonts/Nunito/Nunito-Regular.ttf"),
    NunitoSemiBold: require("./src/assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    NunitoSemiBoldItalic: require("./src/assets/fonts/Nunito/Nunito-SemiBoldItalic.ttf")
  });

  if (!loaded) {
    return null;
  }

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

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
  },
});

export default App;
