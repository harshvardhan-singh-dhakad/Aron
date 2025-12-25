import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useDoc = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;

    const unsubscribe = onSnapshot(doc(db, collectionName, docId), (doc) => {
      if (doc.exists()) {
        setData({ id: doc.id, ...doc.data() });
      } else {
        setData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName, docId]);

  return { data, loading };
};