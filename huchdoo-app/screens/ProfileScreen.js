import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleSendCode = async () => {
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber);
      setConfirmationResult(result);
      Alert.alert('Code sent', 'Verification code sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(verificationCode);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text>Phone: {user.phoneNumber}</Text>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number (+91...)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>

      {confirmationResult && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});