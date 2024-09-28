import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';  // Your Firebase config file

export default function MyCalendar() {
  const [items, setItems] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      const eventsList = eventSnapshot.docs.map(doc => ({
        name: doc.data().title,
        date: doc.data().start.toDate(),
      }));

      let newItems = {};
      eventsList.forEach(event => {
        const strTime = event.date.toISOString().split('T')[0];  // Format date to YYYY-MM-DD
        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }
        newItems[strTime].push({
          name: event.name,
        });
      });

      setItems(newItems);
    };

    fetchEvents();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        renderItem={(item) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
        selected={new Date().toISOString().split('T')[0]}  // Sets today's date as selected
      />
    </View>
  );
}

