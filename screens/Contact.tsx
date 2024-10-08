import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { addContact } from "../services/contactServices";
import Headero from "./components/Header";
import { ScrollView } from "react-native-gesture-handler";

const Contact = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const sendContact = () => {
    const currentDate = new Date().toISOString();
    const contactData = {
      ...data,
      date: currentDate,
    };
    addContact(contactData);
    setData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const isFormValid = () => {
    return data.name && data.email && data.message;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Headero />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
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
                value={data.name}
                onChangeText={(text) => handleChange("name", text)}
                required
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={data.email}
                onChangeText={(text) => handleChange("email", text)}
                required
              />
            </View>

         
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Your message"
                multiline={true}
                numberOfLines={5}
                value={data.message}
                onChangeText={(text) => handleChange("message", text)}
                required
              />
            </View>

            <TouchableOpacity
              onPress={sendContact}
              style={styles.button}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>SEND MESSAGE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  contactCard: {
    flex: 1, // يأخذ المساحة المتاحة بالكامل
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  helloContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002749",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#f97316",
  },
  separator: {
    width: 60,
    height: 2,
    backgroundColor: "#002749",
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
    fontWeight: "600",
    color: "#ea580c",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderColor: "#002749",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#002749",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Contact;
