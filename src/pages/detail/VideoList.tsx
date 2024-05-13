import React, { useState, useEffect, useRef } from 'react';


// Static object for testing
const videoData = [
    {
        id: 1,
        name: "Trailer 1",
        key: "wSeprzQM6gk"
    },
    {
        id: 2,
        name: "movie",
        key: "wSeprzQM6gk"
    },
    
    
];

interface VideoListProps {
    itemId: number;
}

const VideoList: React.FC<VideoListProps> = ({ itemId }) => {
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        // Simulating API call delay
        setTimeout(() => {
            setVideos(videoData.slice(0, 5));
        }, 1000);
    }, [itemId]);

    return (
        <>
            {videos.map((item, i) => (
                <Video key={i} item={item}/>
            ))}
        </>
    );
}

interface VideoProps {
    item: {
        id: number;
        name: string;
        key: string;
    }
}

const Video: React.FC<VideoProps> = ({ item }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const resizeIframe = () => {
            if (iframeRef.current) {
                const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
                iframeRef.current.setAttribute('height', height);
            }
        };

        resizeIframe();

        window.addEventListener('resize', resizeIframe);

        return () => {
            window.removeEventListener('resize', resizeIframe);
        };
    }, []);

    return (
        <div className="video" style={{ padding: '40px' }}>
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>
            <iframe
                src={`https://www.youtube.com/embed/${item.key}`}
                ref={iframeRef}
                width="100%"
                title="video"
            ></iframe>
        </div>
    );
}


export default VideoList;
