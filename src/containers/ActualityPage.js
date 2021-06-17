import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Filtre from '../components/actuality/Filtre'
import InfoTwitter from '../components/actuality/InfoTwitter'
import LineInfo from '../components/actuality/LineInfo'
import Report from '../components/actuality/Report'

const Stack = createStackNavigator();

export default function ActualityPage() {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Filtre" component={Filtre} />
      <Stack.Screen name="InfoTwitter" component={InfoTwitter} />
      <Stack.Screen name="LineInfo" component={LineInfo} />
      <Stack.Screen name="Report" component={Report} />
    </Stack.Navigator>
  );
}