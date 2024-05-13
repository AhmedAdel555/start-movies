import React, { useState, useEffect } from 'react';


// Static object for testing
interface Cast {
    id: number;
    name: string;
    profile_path: string;
}

const castData: Cast[] = [
    {
        id: 1,
        name: "Leonardo DiCaprio",
        profile_path: "https://cdn.britannica.com/65/227665-050-D74A477E/American-actor-Leonardo-DiCaprio-2016.jpg"
    },
    {
        id: 2,
        name: "Joseph Gordon-Levitt",
        profile_path: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/z2FA8js799xqtfiFjBTicFYdfk.jpg "
    },
    {
        id: 3,
        name: "Ellen Page",
        profile_path: "https://cdn.britannica.com/41/249341-050-E5F7039C/Actor-Elliot-Page-2022.jpg"
    },
    {
        id: 4,
        name: "Tom Hardy",
        profile_path: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg"
    },
    {
        id: 5,
        name: "Ken Watanabe",
        profile_path: "https://www.japantimes.co.jp/uploads/imported_images/uploads/2018/06/p10-curran-watanabe-a-20180617.jpg"
    }
];

interface CastListProps {
    itemId: number;
}

const CastList: React.FC<CastListProps> = ({ itemId }) => {
    const [casts, setCasts] = useState<Cast[]>([]);

    useEffect(() => {
        // Simulating API call delay
        setTimeout(() => {
            setCasts(castData.slice(0, 5));
        }, 1000);
    }, [itemId]);

    return (
        <div className="casts">
            {casts.map((item, i) => (
                <div key={i} className="casts__item">
                    <div
                        className="casts__item__img"
                        style={{ backgroundImage: `url(${item.profile_path})` }}
                    ></div>
                    <p className="casts__item__name">{item.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CastList;

