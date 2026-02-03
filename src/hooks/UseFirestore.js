import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../../firebase/config"; // Updated path

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real-time listener with error handling
  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
    
    try {
      const q = query(
        collection(db, collectionName), 
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore timestamps to Date objects
            const processedData = Object.keys(data).reduce((acc, key) => {
              if (data[key] instanceof Timestamp) {
                acc[key] = data[key].toDate();
              } else {
                acc[key] = data[key];
              }
              return acc;
            }, {});
            
            return {
              id: doc.id,
              ...processedData
            };
          });
          setDocuments(docs);
          setLoading(false);
        }, 
        (error) => {
          console.error("Firestore error:", error);
          setError(error.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [collectionName]);

  // Add document
  const addDocument = async (data) => {
    try {
      setError(null);
      setLoading(true);
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Add document error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update document
  const updateDocument = async (id, data) => {
    try {
      setError(null);
      setLoading(true);
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Update document error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      setError(null);
      setLoading(true);
      
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      return { success: true };
    } catch (error) {
      console.error("Delete document error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get document by ID
  const getDocument = useCallback(async (id) => {
    try {
      setError(null);
      setLoading(true);
      
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert timestamps
        const processedData = Object.keys(data).reduce((acc, key) => {
          if (data[key] instanceof Timestamp) {
            acc[key] = data[key].toDate();
          } else {
            acc[key] = data[key];
          }
          return acc;
        }, {});
        
        return { 
          success: true, 
          data: { 
            id: docSnap.id, 
            ...processedData 
          } 
        };
      } else {
        return { success: false, error: "Document not found" };
      }
    } catch (error) {
      console.error("Get document error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Query documents
  const queryDocuments = useCallback(async (conditions = [], order = null, limitCount = null) => {
    try {
      setError(null);
      setLoading(true);
      
      let q = collection(db, collectionName);
      
      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Add ordering
      if (order) {
        q = query(q, orderBy(order.field, order.direction || 'asc'));
      }
      
      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamps
        const processedData = Object.keys(data).reduce((acc, key) => {
          if (data[key] instanceof Timestamp) {
            acc[key] = data[key].toDate();
          } else {
            acc[key] = data[key];
          }
          return acc;
        }, {});
        
        return {
          id: doc.id,
          ...processedData
        };
      });
      
      return { success: true, data: docs };
    } catch (error) {
      console.error("Query documents error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // For movie bookings
  const addBooking = async (bookingData, userId) => {
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    return addDocument({
      ...bookingData,
      bookingId,
      userId,
      status: 'confirmed',
      bookingDate: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  };

  // Get user bookings
  const getUserBookings = useCallback(async (userId) => {
    return queryDocuments(
      [{ field: 'userId', operator: '==', value: userId }],
      { field: 'bookingDate', direction: 'desc' }
    );
  }, [queryDocuments]);

  // Get movie showtimes
  const getMovieShowtimes = useCallback(async (movieId) => {
    return queryDocuments([
      { field: 'movieId', operator: '==', value: movieId },
      { field: 'showtime', operator: '>=', value: new Date() }
    ], { field: 'showtime', direction: 'asc' });
  }, [queryDocuments]);

  // Add movie to Firestore
  const addMovie = async (movieData) => {
    return addDocument({
      ...movieData,
      featured: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  // Get featured movies
  const getFeaturedMovies = useCallback(async () => {
    return queryDocuments(
      [{ field: 'featured', operator: '==', value: true }],
      { field: 'createdAt', direction: 'desc' },
      10
    );
  }, [queryDocuments]);

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    queryDocuments,
    addBooking,
    getUserBookings,
    getMovieShowtimes,
    addMovie,
    getFeaturedMovies
  };
};