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
import { StaffManualPickupScreen }  from './src/screens/staff/StaffManualPickupScreen';
import { LoginModal }               from './src/screens/auth/LoginModal';
import { useAuthStore }             from './src/store/authStore';
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
        <>
          <Stack.Screen name="StaffRoot" component={StaffTabs} />
          <Stack.Screen
            name="StaffManualPickup"
            component={StaffManualPickupScreen}
            options={{ presentation: 'modal', headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// ── Auth bar ──────────────────────────────────────────────────────────────────

function AuthBar({ onSignInPress }: { onSignInPress: () => void }) {
  const { user, profile, signOut } = useAuthStore();

  if (user && profile) {
    const roleLabel = profile.role === 'staff' ? '👩‍💼 Staff' : '👨‍👩‍👧 Parent';
    return (
      <View style={authStyles.bar}>
        <View style={authStyles.userInfo}>
          <Text style={authStyles.rolePill}>{roleLabel}</Text>
          <Text style={authStyles.email} numberOfLines={1}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={authStyles.signOutBtn}>
          <Text style={authStyles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={authStyles.bar}>
      <Text style={authStyles.demoLabel}>Demo mode</Text>
      <TouchableOpacity onPress={onSignInPress} style={authStyles.signInBtn}>
        <Text style={authStyles.signInText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const authStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: '#ECE0C8',
    backgroundColor: '#F7F3EB',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  rolePill: {
    fontSize: 11, fontWeight: '700', color: '#15233A',
    backgroundColor: '#ECE0C8', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  email: { fontSize: 12, color: '#7A8699', flex: 1 },
  signOutBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  signOutText: { fontSize: 12, fontWeight: '600', color: '#A83228' },
  demoLabel: { fontSize: 12, color: '#B0BAC9', fontWeight: '500' },
  signInBtn: {
    backgroundColor: '#15233A', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  signInText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole]         = useState<Role>('parent');
  const [showLogin, setShowLogin] = useState(false);
  const { profile, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    registerForPushNotifications().catch(() => {});
  }, []);

  // When a real user logs in, auto-switch to their role
  useEffect(() => {
    if (profile?.role === 'staff')    setRole('staff');
    if (profile?.role === 'guardian') setRole('parent');
  }, [profile]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: '#FBF5EA' }}>
          <RoleSwitcher role={role} onChange={setRole} />
          <AuthBar onSignInPress={() => setShowLogin(true)} />
          <View style={{ flex: 1 }}>
            <RootNavigator role={role} />
          </View>
        </View>
      </NavigationContainer>
      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
    </SafeAreaProvider>
  );
}
