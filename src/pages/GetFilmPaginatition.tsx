import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs, query, orderBy, startAfter, limit } from '../firebase'; 

const GetAndSetData2 = () => {
  const [films, setFilms] = useState<any[]>([]); 
  const [lastFilm, setLastFilm] = useState<any | null>(null); 

  const getFilms = async () => {
    try {
      const filmsCollection = collection(firestore, 'films');
      let q = query(filmsCollection, orderBy('publishDate', 'desc'));

      if (lastFilm) {
        q = query(filmsCollection, orderBy('publishDate', 'desc'), startAfter(lastFilm), limit(2));
      } else {
        q = query(filmsCollection, orderBy('publishDate', 'desc'), limit(2));
      }

      const filmsSnapshot = await getDocs(q);
      const newFilms = filmsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate.toDate() 
      }));

      setFilms(prevFilms => lastFilm ? [...prevFilms, ...newFilms] : newFilms); 
      setLastFilm(filmsSnapshot.docs[filmsSnapshot.docs.length - 1] || null); 
    } catch (error) {
      console.error("Error getting films:", error);
    }
  };

  useEffect(() => {
    getFilms();
  }, []);

  const loadMoreFilms = () => {
    getFilms();
  };

  return (
    <>
      <div className="data">
        <h1>lol</h1>
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

export default GetAndSetData2;
