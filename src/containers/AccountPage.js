import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Authentification/Login'
import Register from '../components/Authentification/Register'

const Stack = createStackNavigator();

export default function AccountPage() {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}