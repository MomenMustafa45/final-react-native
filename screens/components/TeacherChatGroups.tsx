import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAppSelector } from '../../hooks/reduxHooks';
import { getUserNameById } from '../../services/userServices';
import { getLevelNameById } from '../../services/levelsServices';
import { Icon } from '@rneui/themed';

const ChatTeacher = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null); 
  const userInfo = useAppSelector((state) => state.user.user);

  if (!userInfo) {
    console.error("User information is not defined");
  }

  const senderId = userInfo.id;

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const q = query(collection(db, 'teachers'), where('teacherId', '==', userInfo.id));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const levelIds = userInfo?.levels_Ids || []; 
          console.log(levelIds);
          const levelsData = await Promise.all(
            levelIds.map(async (levelId) => {
              const levelName = await getLevelNameById(levelId);
              return { id: levelId, name: levelName };
            })
          );
          setLevels(levelsData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };
    fetchLevels();
  }, [userInfo.id]);

  useEffect(() => {
    if (selectedLevel) {
      const q = query(collection(db, `classChats/${selectedLevel.id}/messages`), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const msgList = await Promise.all(snapshot.docs.map(async (doc) => {
            const messageData = { id: doc.id, ...doc.data() };
            const senderName = await getUserNameById(messageData.senderId);
            return { ...messageData, senderName };
          }));
          setMessages(msgList);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      });
      return () => unsubscribe();
    }
  }, [selectedLevel]);

  const sendMessage = async () => {
    if (text.trim() && selectedLevel) {
      try {
        await addDoc(collection(db, `classChats/${selectedLevel.id}/messages`), {
          senderId: userInfo.id,
          text,
          timestamp: new Date(),
        });
        setText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.chatContainer}>
      {!selectedLevel && (
        <FlatList
          data={levels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedLevel(item)}  style={styles.levelItem}>
                <Icon
                    name="comment"
                    size={30}
                    color="#002749"
                    style={{marginRight:20}}
                  />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedLevel && (
        <>
          <ScrollView style={styles.messagesContainer}>
            {messages.map((message) => (
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
        </>
      )}
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
  levelItem: {
    padding: 10,
    fontSize: 18,
    backgroundColor: '#fee2e2',
    marginVertical: 5,
    borderRadius: 5,
    color:"#002749",
    display:"flex",
        flexDirection: 'row',  // لجعل العناصر في صف واحد
    alignItems: 'center', 
    margin:20
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  message: {
    flexDirection: 'column',
    marginBottom: 30,
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  separator: {
    height: 10,
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

export default ChatTeacher;
