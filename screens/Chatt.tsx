import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAppSelector } from '../hooks/reduxHooks';
import { getUserNameById } from '../services/userServices';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const userInfo = useAppSelector((state) => state.user.user);
  const senderId = userInfo.id; // معرف المستخدم الحالي

  useEffect(() => {
    const q = query(collection(db, `classChats/${userInfo.class_id}/messages`), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgList = await Promise.all(snapshot.docs.map(async (doc) => {
        const messageData = { id: doc.id, ...doc.data() };
        const senderName = await getUserNameById(messageData.senderId); 
        return { ...messageData, senderName }; 
      }));
      setMessages(msgList);
    });

    return () => unsubscribe();
  }, [userInfo.class_id]);

  const sendMessage = async () => {
    if (text.trim()) {
      await addDoc(collection(db, `classChats/${userInfo.class_id}/messages`), {
        senderId: userInfo.id, 
        text,
        timestamp: new Date(),
      });
      setText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; 
  };

  return (
    <View style={styles.chatContainer}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map(message => (
          <View 
            key={message.id} 
            style={[ 
              styles.message, 
              { 
                backgroundColor: message.senderId === senderId ? '#add8e6' : '#fecaca', 
                alignSelf: message.senderId === senderId ? 'flex-end' : 'flex-start' 
              }
            ]}
          >
            <Text style={styles.sender}>
              {message.senderId === senderId ? 'You' : message.senderName}: 
            </Text>
            
            <Text>{message.text}</Text>
            <View style={styles.separator} /> 
            <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text> 
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="اكتب رسالتك هنا"
          style={styles.input}
        />
        <Button color={"#075985"} title="إرسال" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 15,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  message: {
    flexDirection: 'column', // استخدام عمود لعرض النصوص بشكل رأسي
    marginBottom: 10,
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  separator: {
    height: 10, // ارتفاع الفاصل
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
});

export default Chat;
