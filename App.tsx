import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Category from './screens/Category';
import Record from './screens/Record';

const Stack = createNativeStackNavigator<AppParams>();

export type AppParams = {
  Category: any;
  Record: { intentName: string };
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Category">
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Record" component={Record} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
