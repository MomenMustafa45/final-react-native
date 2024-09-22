import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import {db} from '../config/firebase'
// import { toast } from 'react-toastify';
export const addContact = async (data) => {
    console.log(data)
    try{
        const contactData = {
            ...data,  
            isRead: false 
        };

        const contactCol = collection(db,'contact')
        const contact = await addDoc (contactCol,contactData)
        // toast.success('We recieved your message , we will get in touch soon')
        return contact
    }
    catch(error) {
        console.log(`contact error: ${error}`)
    }
}

export const displayContact = async() => {
try {
    const contactCol = collection(db,'contact') 
    const getContact = await getDocs(contactCol)
    const contactList = getContact.docs.map(doc => ({
        id: doc.id,  
        ...doc.data() 
      }));
    return contactList
} catch (error) {
    console.log(`display contact error: ${error}`)
}
}

export const getUnreadContact = async() => {
    try {
        const contactCol = collection(db,'contact') 
        const Query = query(contactCol,where('isRead','==','false'))
        const getUnread = await getDocs(Query)
        const listUnread = getUnread.docs.map(doc => ({
        id: doc.id,  
        ...doc.data() 
      }));
    return listUnread
    } catch (error) {
        console.log(`display unread error: ${error}`)
    }
}


export const markAsRead = async (id) => {
    try {
        const contactDoc = doc(db, 'contact', id);
        await updateDoc(contactDoc, { isRead: 'true' });
        return true;
    } catch (error) {
        console.log(`mark as read error: ${error}`);
        return false;
    }
};