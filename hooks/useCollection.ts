import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useCollection(collectionName: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: any[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName, ...queryConstraints]);

  return { data, loading, error };
}