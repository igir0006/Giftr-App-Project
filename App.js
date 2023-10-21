import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import PeopleScreen from './Screens/PeopleScreen';
import AddPersonScreen from './Screens/AddPersonScreen';
import IdeasScreen from './Screens/IdeasScreen';
import AddIdeaScreen from './Screens/AddIdeaScreen';
import { GiftIdeasProvider } from './Context/GiftIdeasContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GiftIdeasProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="People">
      <Stack.Screen name="People" 
      component={PeopleScreen}
      options={({navigation, route}) => ({
        headerRight: () => <Button onPress={() => navigation.navigate('Add Person')} 
        title='Add Person' color='black' />
        })} />
      <Stack.Screen name="Add Person" component={AddPersonScreen} />
      <Stack.Screen name="Ideas" 
      component={IdeasScreen} 
      options={({ navigation, route }) => ({
        headerRight: () => (
            <Button 
                onPress={() => {
                    const personId = route.params?.personId; 
                    if (personId) {
                        navigation.navigate('Add Idea', { personId });
                    } else {
                        console.error("personId is not available");
                    }
                }}
                title="Add Idea" 
                color="black" 
            />
        )
    })} />
      <Stack.Screen name="Add Idea" component={AddIdeaScreen} />
    </Stack.Navigator>
    </NavigationContainer>
      </GiftIdeasProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
