// CarLine — Push notifications
// Uses Expo Notifications. In this mock build, triggers are fired locally.
// Production: call your backend to send push via Expo's push service with
// the token registered here, rather than scheduling locally.

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import type { PickupStatus } from '../models';

// Show heads-up banners while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    // Simulators can't receive push — return null silently
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    // TODO: send `token` to your backend to associate with the guardian's account
    return token;
  } catch {
    return null;
  }
}

const STATUS_NOTIFICATIONS: Partial<Record<PickupStatus, { title: string; body: string }>> = {
  arrived: {
    title: "You're in the queue",
    body: "Staff has you — your child's teacher has been notified.",
  },
  called: {
    title: 'Your child is on the way out',
    body: 'Walk toward the curb — staff is bringing them now.',
  },
  released: {
    title: 'Pickup complete',
    body: "Your child is in your car. Drive safe!",
  },
};

export async function notifyStatusChange(status: PickupStatus, studentName: string) {
  const template = STATUS_NOTIFICATIONS[status];
  if (!template) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: template.title,
      body: `${studentName}: ${template.body}`,
      sound: 'default',
    },
    trigger: null, // fire immediately (mock; production fires from server)
  });
}

export async function notifyEarlyPickupApproved(studentName: string, time: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Early pickup approved',
      body: `${studentName}'s ${time} pickup has been approved by the office.`,
      sound: 'default',
    },
    trigger: null,
  });
}

export async function notifyEarlyPickupDenied(studentName: string, note?: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Early pickup request denied',
      body: note
        ? `${studentName}: ${note}`
        : `${studentName}'s early pickup request was not approved. Please call the office.`,
      sound: 'default',
    },
    trigger: null,
  });
}

// ── Supabase push token registration ─────────────────────────────────────────

export async function registerPushTokenWithSupabase(
  guardianId: string,
  token: string,
): Promise<void> {
  // Lazy import to avoid requiring Supabase when running on MockDataSource
  const { supabase } = await import('../lib/supabase');
  const { error } = await supabase
    .from('guardians')
    .update({ expo_push_token: token })
    .eq('id', guardianId);
  if (error) console.warn('[CarLine] Failed to store push token:', error.message);
}

export async function registerAndStorePushToken(guardianId: string): Promise<string | null> {
  const token = await registerForPushNotifications();
  if (token) {
    await registerPushTokenWithSupabase(guardianId, token);
  }
  return token;
}
