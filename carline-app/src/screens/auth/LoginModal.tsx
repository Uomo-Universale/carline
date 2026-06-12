import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, Pressable,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Screen = 'login' | 'reset' | 'reset-sent';

export function LoginModal({ visible, onClose }: Props) {
  const { signIn } = useAuthStore();
  const [screen, setScreen]     = useState<Screen>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const reset = () => {
    setScreen('login');
    setError('');
    setPassword('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      setEmail('');
      setPassword('');
      handleClose();
    } catch (e: any) {
      setError(e.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: 'https://uomo-universale.github.io/carline/' },
      );
      if (err) throw err;
      setScreen('reset-sent');
    } catch (e: any) {
      setError(e.message ?? 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        {/* ── Sign in ── */}
        {screen === 'login' && (
          <View style={styles.card}>
            <Text style={styles.title}>Sign in to CarLine</Text>
            <Text style={styles.sub}>Use the email address registered with the school</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#B0BAC9"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />

            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => { setError(''); setScreen('reset'); }}>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#B0BAC9"
              secureTextEntry
              onSubmitEditing={handleSignIn}
              returnKeyType="go"
            />

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, (!email.trim() || !password || loading) && styles.btnDisabled]}
              onPress={handleSignIn}
              disabled={!email.trim() || !password || loading}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.btnText}>Sign in</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Continue in demo mode</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Request password reset ── */}
        {screen === 'reset' && (
          <View style={styles.card}>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.sub}>
              Enter your email and we'll send a link to set a new password.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#B0BAC9"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              autoFocus
            />

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, (!email.trim() || loading) && styles.btnDisabled]}
              onPress={handleResetRequest}
              disabled={!email.trim() || loading}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.btnText}>Send reset link</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setError(''); setScreen('login'); }}>
              <Text style={styles.cancelText}>← Back to sign in</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Reset email sent ── */}
        {screen === 'reset-sent' && (
          <View style={styles.card}>
            <Text style={styles.sentIcon}>📬</Text>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.sub}>
              A password reset link was sent to{'\n'}
              <Text style={styles.sentEmail}>{email}</Text>
              {'\n\n'}Click the link in that email to set your new password.
            </Text>

            <TouchableOpacity style={styles.btn} onPress={handleClose}>
              <Text style={styles.btnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
  card: {
    width: 320, backgroundColor: '#FFFFFF',
    borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#15233A', marginBottom: 4 },
  sub: { fontSize: 13, color: '#7A8699', marginBottom: 20, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 6 },
  forgotLink: { fontSize: 12, fontWeight: '600', color: '#2A6FA3' },
  input: {
    backgroundColor: '#F7F3EB', borderWidth: 1, borderColor: '#D8C9A8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#15233A',
  },
  errorBox: {
    marginTop: 12, backgroundColor: '#FDE8E8',
    borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#F5C6C6',
  },
  errorText: { fontSize: 13, color: '#A83228', fontWeight: '500' },
  btn: {
    marginTop: 20, backgroundColor: '#15233A',
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#B0BAC9' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  cancelBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 13, color: '#7A8699', fontWeight: '500' },
  sentIcon: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  sentEmail: { fontWeight: '700', color: '#15233A' },
});
