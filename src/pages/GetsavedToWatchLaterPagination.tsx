import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs, query, where, doc, getDoc } from '../firebase';

const GetAndSetData4 = () => {
  const [films, setFilms] = useState<any[]>([]);
  const [lastFilmIndex, setLastFilmIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Fetch user document to get the list of savedToWatchLater film IDs
  const getUserSavedFilms = async (userId: string) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().savedToWatchLater || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const getFilmsByIds = async (savedToWatchLater: string[], lastFilmIndex: number | null) => {
    try {
      if (savedToWatchLater.length === 0) {
        setFilms([]);
        return;
      }

      const filmsCollection = collection(firestore, 'films');
      const batchSize = 1; 
      const filmIdsToFetch = savedToWatchLater.slice(lastFilmIndex ?? 0, (lastFilmIndex ?? 0) + batchSize);

      const q = query(
        filmsCollection,
        where('id', 'in', filmIdsToFetch)
      );

      const filmsSnapshot = await getDocs(q);

      const newFilms = filmsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate.toDate()
      }));

      setFilms(prevFilms => lastFilmIndex !== null ? [...prevFilms, ...newFilms] : newFilms);
      setLastFilmIndex((lastFilmIndex ?? 0) + batchSize);
    } catch (error) {
      console.error("Error getting films:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== "") {
        console.log(`Fetching films for user: ${userId}`);
        const savedToWatchLater = await getUserSavedFilms(userId);
        console.log(`Saved films IDs: ${savedToWatchLater}`);
        getFilmsByIds(savedToWatchLater, null);
      }
    };
    fetchData();
  }, [userId]);

  const loadMoreFilms = async () => {
    const savedToWatchLater = await getUserSavedFilms(userId);
    getFilmsByIds(savedToWatchLater, lastFilmIndex);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setFilms([]); // Reset films when user ID changes
    setLastFilmIndex(null); // Reset lastFilmIndex when user ID changes
  };

  return (
    <>
      <div className="data">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={handleUserIdChange}
        />
        {films.map(film => (
          <div key={film.id}>
            <p>{film.name}</p>
          </div>
        ))}
        <button onClick={loadMoreFilms}>Load More</button>
      </div>
    </>
  );
};

export default GetAndSetData4;
