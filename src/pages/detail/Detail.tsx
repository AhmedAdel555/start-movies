

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

// Static object for testing
const item = {
    id: 1,
    title: "Inception",
    name: "Inception",
    backdrop_path: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7825626_p_v8_ae.jpg",
    poster_path: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7825626_p_v8_ae.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }, { id: 18, name: "Drama" }, { id: 9648, name: "Mystery" }, { id: 53, name: "Thriller" }],
    overview: "A troubled thief who extracts secrets from people's dreams takes one last job: leading a dangerous mission to plant an idea in a target's subconscious.",
};

const Detail = () => {

    const { category, id } = useParams();

    const [loadedItem, setLoadedItem] = useState<typeof item | null>(null);

    useEffect(() => {
        const getDetail = async () => {
            // Simulating API call delay
            setTimeout(() => {
                setLoadedItem(item);
                window.scrollTo(0,0);
            }, 1000);
        }
        getDetail();
    }, [category, id]);

    return (
        <>
            {
                loadedItem && (
                    <>
                        <div className="banner" style={{backgroundImage: `url(${loadedItem.backdrop_path || loadedItem.poster_path})`}}></div>
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <div className="movie-content__poster__img" style={{backgroundImage: `url(${loadedItem.poster_path || loadedItem.backdrop_path})`}}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">
                                    {loadedItem.title || loadedItem.name}
                                </h1>
                                <div className="genres">
                                    {
                                        loadedItem.genres && loadedItem.genres.slice(0, 5).map((genre, i) => (
                                            <span key={i} className="genres__item">{genre.name}</span>
                                        ))
                                    }
                                </div>
                                <p className="overview">{loadedItem.overview}</p>
                                <div className="cast">
                                    <div className="section__header">
                                        <h2>Casts</h2>
                                    </div>
                                    <CastList itemId={loadedItem.id}/>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="section mb-3">
                                <VideoList itemId={loadedItem.id}/>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Detail;
