import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Contact = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contactCard}>
        <View style={styles.helloContainer}>
          <Text style={styles.title}>SAY HELLO!</Text>
          <Text style={styles.subTitle}>We would love to hear from you!</Text>
          <View style={styles.separator}></View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              required
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              required
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your message"
              multiline={true}
              numberOfLines={5}
              required
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>SEND MESSAGE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  contactCard: {
    width: '90%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f8f4e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  helloContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#ADD8E6',
  },
  separator: {
    width: 60,
    height: 2,
    backgroundColor: 'orange',
    marginVertical: 10,
  },
  form: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderColor: '#ADD8E6',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#002749',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Contact;
