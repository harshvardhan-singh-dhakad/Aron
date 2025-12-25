import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useCollection = (collectionName, ...queryConstraints) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName, ...queryConstraints]);

  return { data, loading };
};