import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
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
import Font, { useFonts } from "expo-font";


const Tabs = createBottomTabNavigator();

const App = () => {
  const [loaded] = useFonts({
    NunitoBlack: require("./src/assets/fonts/Nunito-Black.ttf"),
    NunitoBlackItalic: require("./src/assets/fonts/Nunito-BlackItalic.ttf"),
    NunitoBold: require("./src/assets/fonts/Nunito-Bold.ttf"),
    NunitoBoldItalic: require("./src/assets/fonts/Nunito-BoldItalic.ttf"),
    NunitoExtraBold: require("./src/assets/fonts/Nunito-ExtraBold.ttf"),
    NunitoExtraBoldItalic: require("./src/assets/fonts/Nunito-ExtraBoldItalic.ttf"),
    NunitoExtraLight: require("./src/assets/fonts/Nunito-ExtraLight.ttf"),
    NunitoExtraLightItalic: require("./src/assets/fonts/Nunito-ExtraLightItalic.ttf"),
    NunitoItalic: require("./src/assets/fonts/Nunito-Italic.ttf"),
    NunitoLight: require("./src/assets/fonts/Nunito-Light.ttf"),
    NunitoLightItalic: require("./src/assets/fonts/Nunito-LightItalic.ttf"),
    NunitoRegular: require("./src/assets/fonts/Nunito-Regular.ttf"),
    NunitoSemiBold: require("./src/assets/fonts/Nunito-SemiBold.ttf"),
    NunitoSemiBoldItalic: require("./src/assets/fonts/Nunito-SemiBoldItalic.ttf")
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
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
            activeTintColor: "white",
            inactiveTintColor: "black",
            showLabel: false,
            style: {
              backgroundColor: "#f8f8f8",
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
              ...styles.shadow

            },
            tabStyle: {
              //position: 'absolute',
              //width: 258,
              //height: 54,
              //left: "calc(50% - 258/2 - 0.5)",
              borderRadius: 160,
            }
          }}
        >
          <Tabs.Screen name="HomePage">
            {(props) => <HomePage {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="TrafficPage">
            {(props) => <TrafficPage {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="FavoritePage">
            {(props) => <FavoritePage {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="ActualityPage">
            {(props) => <ActualityPage {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="AccountPage">
            {(props) => <AccountPage {...props} />}
          </Tabs.Screen>
        </Tabs.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shadow: {
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,
    elevation: 5
  }
});
