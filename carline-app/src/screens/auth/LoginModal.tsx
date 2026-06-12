import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, Pressable,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LoginModal({ visible, onClose }: Props) {
  const { signIn } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
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

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
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

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Continue in demo mode</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  card: {
    width: 320, backgroundColor: '#FFFFFF',
    borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#15233A', marginBottom: 4 },
  sub: { fontSize: 13, color: '#7A8699', marginBottom: 20, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: '#F7F3EB', borderWidth: 1, borderColor: '#D8C9A8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#15233A',
  },
  errorBox: {
    marginTop: 12, backgroundColor: '#FDE8E8',
    borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#F5C6C6',
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
});
