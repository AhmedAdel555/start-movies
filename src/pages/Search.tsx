import React, { useState, useEffect } from 'react';
import { firestore, where, query, getDocs, collection } from '../firebase';

interface Film {
    name: string;
}

const Search = () => {
    const [searchName, setSearchName] = useState('');
    const [films, setFilms] = useState<Film[]>([]);
    const [debouncedSearchName, setDebouncedSearchName] = useState(searchName);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchName]);

    useEffect(() => {
        const fetchData = async () => {
            if (debouncedSearchName) {
                const q = query(
                    collection(firestore, 'films'),
                    where('lowerCaseName', '>=', debouncedSearchName.toLowerCase()),
                    where('lowerCaseName', '<', debouncedSearchName.toLowerCase() + 'z')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => {
                    console.log(doc.data());
                    return doc.data() as Film;
                });
                setFilms(data);
            } else {
                setFilms([]);
            }
        };

        fetchData();
    }, [debouncedSearchName]);

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Search..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <ul>
                {films.map((film, index) => (
                    <li key={index}>{film.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
