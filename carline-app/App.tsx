import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen }               from './src/screens/parent/HomeScreen';
import { VehicleScreen }            from './src/screens/parent/VehicleScreen';
import { AuthorizedPersonsScreen }  from './src/screens/parent/AuthorizedPersonsScreen';
import { LiveStatusScreen }         from './src/screens/parent/LiveStatusScreen';
import { PickupPickerScreen }       from './src/screens/parent/PickupPickerScreen';
import { EarlyPickupScreen }        from './src/screens/parent/EarlyPickupScreen';
import { StaffQueueScreen }         from './src/screens/staff/StaffQueueScreen';
import { StaffApprovalsScreen }     from './src/screens/staff/StaffApprovalsScreen';
import { StaffReportingScreen }     from './src/screens/staff/StaffReportingScreen';
import { StaffBusScreen }           from './src/screens/staff/StaffBusScreen';
import { registerForPushNotifications } from './src/notifications';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Tab icons ─────────────────────────────────────────────────────────────────

function TabIcon({ label, icon, focused }: { label: string; icon: string; focused: boolean }) {
  return (
    <View style={tabStyles.wrap}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  icon: { fontSize: 22, opacity: 0.45 },
  iconFocused: { opacity: 1 },
  label: { fontSize: 10, fontWeight: '600', color: '#7A8699' },
  labelFocused: { color: '#1F3A5F' },
});

// ── Parent tabs ───────────────────────────────────────────────────────────────

function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#ECE0C8',
          borderTopWidth: 1,
          paddingTop: 6,
          height: 80,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" icon="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Vehicle" icon="🚗" focused={focused} /> }}
      />
      <Tab.Screen
        name="People"
        component={AuthorizedPersonsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="People" icon="👥" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ── Staff tabs ────────────────────────────────────────────────────────────────

function StaffTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#15233A',
          borderTopColor: '#2A3A50',
          borderTopWidth: 1,
          paddingTop: 6,
          height: 80,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Queue"
        component={StaffQueueScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Queue" icon="📋" focused={focused} /> }}
      />
      <Tab.Screen
        name="Approvals"
        component={StaffApprovalsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Early" icon="🕐" focused={focused} /> }}
      />
      <Tab.Screen
        name="Bus"
        component={StaffBusScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Bus" icon="🚌" focused={focused} /> }}
      />
      <Tab.Screen
        name="Reports"
        component={StaffReportingScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Reports" icon="📊" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ── Role switcher (dev/demo only) ─────────────────────────────────────────────

type Role = 'parent' | 'staff';

function RoleSwitcher({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <View style={switchStyles.bar}>
      <TouchableOpacity
        onPress={() => onChange('parent')}
        style={[switchStyles.btn, role === 'parent' && switchStyles.btnActive]}
      >
        <Text style={[switchStyles.btnText, role === 'parent' && switchStyles.btnTextActive]}>👨‍👩‍👧 Parent</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange('staff')}
        style={[switchStyles.btn, role === 'staff' && switchStyles.btnActiveStaff]}
      >
        <Text style={[switchStyles.btnText, role === 'staff' && switchStyles.btnTextActiveStaff]}>👩‍💼 Staff</Text>
      </TouchableOpacity>
    </View>
  );
}

const switchStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#ECE0C8',
    margin: 12,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  btn: {
    flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 9,
  },
  btnActive: { backgroundColor: '#FFFFFF', shadowColor: '#15233A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 2, elevation: 2 },
  btnActiveStaff: { backgroundColor: '#15233A' },
  btnText: { fontSize: 13, fontWeight: '700', color: '#7A8699' },
  btnTextActive: { color: '#15233A' },
  btnTextActiveStaff: { color: '#FFFFFF' },
});

// ── Root navigator ────────────────────────────────────────────────────────────

function RootNavigator({ role }: { role: Role }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'parent' ? (
        <>
          <Stack.Screen name="ParentRoot" component={ParentTabs} />
          <Stack.Screen
            name="LiveStatus"
            component={LiveStatusScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="PickupPicker"
            component={PickupPickerScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="EarlyPickup"
            component={EarlyPickupScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      ) : (
        <Stack.Screen name="StaffRoot" component={StaffTabs} />
      )}
    </Stack.Navigator>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<Role>('parent');

  useEffect(() => {
    registerForPushNotifications().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: '#FBF5EA' }}>
          <RoleSwitcher role={role} onChange={setRole} />
          <View style={{ flex: 1 }}>
            <RootNavigator role={role} />
          </View>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
