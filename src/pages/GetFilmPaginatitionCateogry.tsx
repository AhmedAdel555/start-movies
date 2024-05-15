import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs, query, orderBy, startAfter, limit, where } from '../firebase'; 

const GetAndSetData3 = () => {
  const [films, setFilms] = useState<any[]>([]); 
  const [lastFilm, setLastFilm] = useState<any | null>(null); 
  const [category, setCategory] = useState<string>("");

  const getFilmsByCategory = async (category: string, lastFilm: any | null) => {
    try {
      const filmsCollection = collection(firestore, 'films');
      let q;

      if (lastFilm) {
        q = query(
          filmsCollection,
          where('categories', 'array-contains', category),
          orderBy('publishDate', 'desc'),
          startAfter(lastFilm.publishDate),
          limit(1)
        );
      } else {
        q = query(
          filmsCollection,
          where('categories', 'array-contains', category),
          orderBy('publishDate', 'desc'),
          limit(1)
        );
      }

      const filmsSnapshot = await getDocs(q);

      const newFilms = filmsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate.toDate() 
      }));

      setFilms(prevFilms => lastFilm ? [...prevFilms, ...newFilms] : newFilms); 
      setLastFilm(newFilms[0] || null); 
    } catch (error) {
      console.error("Error getting films:", error);
    }
  };

  useEffect(() => {
    if (category !== "") {
      getFilmsByCategory(category, lastFilm);
    }
  }, [category]);

  const loadMoreFilms = () => {
    getFilmsByCategory(category, lastFilm);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setFilms([]); // Reset films when category changes
    setLastFilm(null); // Reset lastFilm when category changes
  };

  return (
    <>
      <div className="data">
        <select value={category} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          <option value="action">Action</option>
          <option value="drama">Drama</option>
          <option value="comedy">Comedy</option>
          <option value="romance">Romance</option>
          {/* Add more categories as needed */}
        </select>
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

export default GetAndSetData3;
