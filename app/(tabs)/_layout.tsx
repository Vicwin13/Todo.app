import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
      <Tabs screenOptions={{
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          headerShown: false,
      }}>
          <Tabs.Screen
              name='index'
              options={{
                  title: 'Todo',
                  tabBarIcon: ({ color, size }) => (
                      <Ionicons name="list" size={size} color={color} />
                  ),
              }}
          />
      </Tabs>
  )
}

export default TabsLayout