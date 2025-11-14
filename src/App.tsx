import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Screens
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import ContentIdeasScreen from './screens/ContentIdeasScreen';
import SponsorshipsScreen from './screens/SponsorshipsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import AIToolsScreen from './screens/AIToolsScreen';
import CalendarScreen from './screens/CalendarScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#e5e7eb',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Dashboard',
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Expenses"
            component={ExpensesScreen}
            options={{
              title: 'Expenses',
              tabBarLabel: 'Expenses',
            }}
          />
          <Tab.Screen
            name="Ideas"
            component={ContentIdeasScreen}
            options={{
              title: 'Content Ideas',
              tabBarLabel: 'Ideas',
            }}
          />
          <Tab.Screen
            name="Sponsors"
            component={SponsorshipsScreen}
            options={{
              title: 'Sponsorships',
              tabBarLabel: 'Sponsors',
            }}
          />
          <Tab.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              title: 'Analytics',
              tabBarLabel: 'Analytics',
            }}
          />
          <Tab.Screen
            name="AI"
            component={AIToolsScreen}
            options={{
              title: 'AI Tools',
              tabBarLabel: 'AI Tools',
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
              title: 'Content Calendar',
              tabBarLabel: 'Calendar',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
