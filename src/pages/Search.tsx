import React, { useState, useEffect } from 'react';
import { firestore, where, query, getDocs, collection } from '../firebase'; // Import firestore and necessary functions from your firebase file

interface Film {
    name: string;
    
}

const Search = () => {
    const [searchName, setSearchName] = useState('');
    const [films, setFilms] = useState<Film[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const q = query(
                collection(firestore, 'films'),
                where('lowerCaseName', '>=', searchName.toLowerCase()),
                where('lowerCaseName', '<', searchName.toLowerCase() + 'z')
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data() as Film);
            setFilms(data);
        };

        fetchData();
    }, [searchName]);

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
