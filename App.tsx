import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

import { AppProvider } from './src/context/AppContext';
import { Theme } from './src/constants/theme';

import { HomeScreen } from './src/screens/HomeScreen';
import { QuestionCardsScreen } from './src/screens/QuestionCardsScreen';
import { TestsScreen } from './src/screens/TestsScreen';
import { QuizActiveScreen } from './src/screens/QuizActiveScreen';
import { QuizResultScreen } from './src/screens/QuizResultScreen';
import { SavedQuestionsScreen } from './src/screens/SavedQuestionsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AdminPanelScreen } from './src/screens/AdminPanelScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: Theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'QuestionCards') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'Tests') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Ana Sayfa' }}
      />
      <Tab.Screen
        name="QuestionCards"
        component={QuestionCardsScreen}
        options={{ tabBarLabel: 'Soru Kartları' }}
      />
      <Tab.Screen
        name="Tests"
        component={TestsScreen}
        options={{ tabBarLabel: 'Testler' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedQuestionsScreen}
        options={{ tabBarLabel: 'Kütüphanem' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profilim' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE' }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="QuizActive" component={QuizActiveScreen} />
          <Stack.Screen name="QuizResult" component={QuizResultScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
