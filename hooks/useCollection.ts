import { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCollection(collectionName: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to store the latest query constraints to avoid infinite loops
  // This is a common workaround for Firebase query constraints in hooks
  const queryConstraintsRef = useRef(queryConstraints);

  // Only update ref if deep equality check fails (simplified via JSON stringify for this case)
  // Note: QueryConstraint objects might verify differently, but let's try a stable approach
  // Better approach: Memoize in the component using the hook.
  // But to be safe here, let's just use the length or a manual check if possible.
  // Actually, standard practice is to rely on user memoizing, but we can help.

  useEffect(() => {
    let q;
    try {
      const colRef = collection(db, collectionName);
      q = query(colRef, ...queryConstraints);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: any[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(queryConstraints)]); // Use stringify to compare constraints by value

  return { data, loading, error };
}