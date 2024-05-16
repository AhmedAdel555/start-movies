import React, { useState, useEffect } from 'react';
import { 
  firestore, 
  collection, 
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from '../firebase'; 

const GetAndSetData = () => {
  
  const [filmsData, setFilmsData] = useState<{ 
    id: string, 
    name: string, 
    likesNumber: number, 
    dislikesNumber: number, 
    viewersNumber: number, 
    savedToWatchLaterNumber: number,
    ratings: { [userId: string]: number },
    rateNumber: number // Average rating
  }[]>([]);

  const getAllFilms = async () => {
    try {
      const filmsCollection = collection(firestore, 'films');
      const q = query(filmsCollection, orderBy('publishDate', 'desc'));
      const filmsSnapshot = await getDocs(q);
      const filmsData = filmsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        likesNumber: doc.data().likesNumber,
        dislikesNumber: doc.data().dislikesNumber,
        viewersNumber: doc.data().viewersNumber,
        savedToWatchLaterNumber: doc.data().savedToWatchLaterNumber,
        ratings: doc.data().ratings,
        rateNumber: calculateRate(doc.data().ratings) // Calculate average rating
      }));
      setFilmsData(filmsData);
    } catch (error) {
      console.error("Error getting films:", error);
    }
  };

  const calculateRate = (ratings: { [userId: string]: number }) => {
    const ratingValues = Object.values(ratings);
    if (ratingValues.length === 0) return 0;
    const sum = ratingValues.reduce((acc, curr) => acc + curr, 0);
    return sum / ratingValues.length;
  };

  const getFilmById = async (filmId: string) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      const filmSnapshot = await getDoc(filmRef);
      if (filmSnapshot.exists()) {
        console.log("Film data:", filmSnapshot.data());
      } else {
        console.log("No such film!");
      }
    } catch (error) {
      console.error("Error getting film by ID:", error);
    }
  };

  const removeFilmById = async (filmId: string) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      await deleteDoc(filmRef);
      setFilmsData(prevState => prevState.filter(film => film.id !== filmId));
    } catch (error) {
      console.error("Error removing film:", error);
    }
  };

  const toggleLike = async (filmId: string, userId: string) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      const filmSnapshot = await getDoc(filmRef);
      if (filmSnapshot.exists()) {
        const { likes, likesNumber } = filmSnapshot.data();
        if (likes.includes(userId)) {
          await updateDoc(filmRef, {
            likes: arrayRemove(userId),
            likesNumber: likesNumber - 1
          });
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, likesNumber: film.likesNumber - 1 };
            }
            return film;
          }));
        } else {
          await updateDoc(filmRef, {
            likes: arrayUnion(userId),
            likesNumber: likesNumber + 1
          });
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, likesNumber: film.likesNumber + 1 };
            }
            return film;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleDislike = async (filmId: string, userId: string) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      const filmSnapshot = await getDoc(filmRef);
      if (filmSnapshot.exists()) {
        const { dislikes, dislikesNumber } = filmSnapshot.data();
        if (dislikes.includes(userId)) {
          await updateDoc(filmRef, {
            dislikes: arrayRemove(userId),
            dislikesNumber: dislikesNumber - 1
          });
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, dislikesNumber: film.dislikesNumber - 1 };
            }
            return film;
          }));
        } else {
          await updateDoc(filmRef, {
            dislikes: arrayUnion(userId),
            dislikesNumber: dislikesNumber + 1
          });
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, dislikesNumber: film.dislikesNumber + 1 };
            }
            return film;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };


  
  const toggleSaveToWatchLater = async (filmId: string, userId: string) => {
    try {
      // References to the film and user documents
      const filmRef = doc(firestore, 'films', filmId);
      const userRef = doc(firestore, 'users', userId);
      
      // Fetch the film document
      const filmSnapshot = await getDoc(filmRef);
      // Fetch the user document
      const userSnapshot = await getDoc(userRef);
      
      if (filmSnapshot.exists() && userSnapshot.exists()) {
        const filmData = filmSnapshot.data();
        const userData = userSnapshot.data();
        const { savedToWatchLater, savedToWatchLaterNumber } = filmData;
        
  
        if (savedToWatchLater.includes(userId)) {
          // If the film is already saved by the user, remove it from both lists
          await updateDoc(filmRef, {
            savedToWatchLater: arrayRemove(userId),
            savedToWatchLaterNumber: savedToWatchLaterNumber - 1
          });
          await updateDoc(userRef, {
            savedToWatchLater: arrayRemove(filmId)
          });
  
          // Update local state
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, savedToWatchLaterNumber: film.savedToWatchLaterNumber - 1 };
            }
            return film;
          }));
        } else {
          // If the film is not saved by the user, add it to both lists
          await updateDoc(filmRef, {
            savedToWatchLater: arrayUnion(userId),
            savedToWatchLaterNumber: savedToWatchLaterNumber + 1
          });
          await updateDoc(userRef, {
            savedToWatchLater: arrayUnion(filmId)
          });
  
          // Update local state
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, savedToWatchLaterNumber: film.savedToWatchLaterNumber + 1 };
            }
            return film;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling save to watch later:", error);
    }
  };
  

  const toggleViewer = async (filmId: string, userId: string) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      const filmSnapshot = await getDoc(filmRef);
      if (filmSnapshot.exists()) {
        const { viewers, viewersNumber } = filmSnapshot.data();
        if (!viewers.includes(userId)) {
          await updateDoc(filmRef, {
            viewers: arrayUnion(userId),
            viewersNumber: viewersNumber + 1
          });
          setFilmsData(prevState => prevState.map(film => {
            if (film.id === filmId) {
              return { ...film, viewersNumber: film.viewersNumber + 1 };
            }
            return film;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling viewer:", error);
    }
  };

  const rateFilm = async (filmId: string, userId: string, rating: number) => {
    try {
      const filmRef = doc(firestore, 'films', filmId);
      const filmSnapshot = await getDoc(filmRef);
      if (filmSnapshot.exists()) {
        const { ratings } = filmSnapshot.data();
        ratings[userId] = rating; // Add or update user's rating
        const newRating = calculateRate(ratings); // Calculate new average rating
        await updateDoc(filmRef, {
          [`ratings.${userId}`]: rating, // Update specific user rating
          rateNumber: newRating // Update average rating
        });
        setFilmsData(prevState => prevState.map(film => {
          if (film.id === filmId) {
            return { ...film, rateNumber: newRating, ratings }; // Update film data with new rating and ratings object
          }
          return film;
        }));
      }
    } catch (error) {
      console.error("Error rating film:", error);
    }
  };
  
  

  useEffect(() => {
    getAllFilms();
  }, []);

  return (
    <>
      <div className="data">
        <h1>Films</h1>
        <ul>
          {filmsData.map(film => (
            <li key={film.id}>
              {film.name}
              <div>
                <button style={{marginRight: '10px'}} onClick={() => removeFilmById(film.id)}>Remove</button>
                <button style={{marginRight: '10px'}} onClick={() => toggleLike(film.id, 'yc2LyI6UcBhGjO3qgbPeDEm8CLY2')}>Like</button>
                <span style={{marginRight: '10px'}}>{film.likesNumber}</span>
                <button style={{marginRight: '10px'}} onClick={() => toggleDislike(film.id, 'yc2LyI6UcBhGjO3qgbPeDEm8CLY2')}>Dislike</button>
                <span style={{marginRight: '10px'}}>{film.dislikesNumber}</span>
                <button style={{marginRight: '10px'}} onClick={() => toggleSaveToWatchLater(film.id, 'yc2LyI6UcBhGjO3qgbPeDEm8CLY2')}>Save to Watch Later</button>
                <span style={{marginRight: '10px'}}>{film.savedToWatchLaterNumber}</span>
                <button style={{marginRight: '10px'}} onClick={() => toggleViewer(film.id, 'yc2LyI6UcBhGjO3qgbPeDEm8CLY2')}>Add to Viewers</button>
                <span style={{marginRight: '10px'}}>{film.viewersNumber}</span>
                <button style={{marginRight: '10px'}} onClick={() => rateFilm(film.id, 'yc2LyI6UcBhGjO3qgbPeDEm8CLY2', 5)}>Rate 5 stars</button>
                <span style={{marginRight: '10px'}}>Average Rating: {film.rateNumber || 0}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GetAndSetData;
