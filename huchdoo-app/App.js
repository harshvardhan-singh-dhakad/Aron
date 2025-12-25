import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import PostAdScreen from './screens/PostAdScreen';
import InboxScreen from './screens/InboxScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoryListingsScreen from './screens/CategoryListingsScreen';
import ListingDetailScreen from './screens/ListingDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CategoryListings" component={CategoryListingsScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Search" component={SearchStack} />
          <Tab.Screen name="Post Ad" component={PostAdScreen} />
          <Tab.Screen name="Inbox" component={InboxScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
