import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import TrafficMap from '../components/Traffic/TrafficMap';
import TrafficFilters from '../components/Traffic/TrafficFilters';

const Stack = createStackNavigator();

const TrafficPage = () => {
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
          }}
          >
            <Stack.Screen 
                name="TrafficFilters" 
                component={TrafficFilters} 
                options={{title:'Filters'}}
            />
            <Stack.Screen 
                name="TrafficMap" 
                component={TrafficMap} 
                options={{title:'Map'}}
            />
           
        </Stack.Navigator>
    )
}

export default TrafficPage;
