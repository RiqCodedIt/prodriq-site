import React from 'react';

interface SpotifyTrackProps {
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
    role: string;
    id: string;
}

const SpotifyTrack: React.FC<SpotifyTrackProps> = ({ 
    title, 
    artist, 
    albumArt, 
    id,
    role 
}) => {
    // Create the embed URL from the track ID
    const embedUrl = `https://open.spotify.com/embed/track/${id}?utm_source=generator`;

    return (
        <div className="track-card" id={`track-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            <div className="track-header">
                <div className="track-title">{title}</div>
                <div className="track-artist">{artist}</div>
                <div className="track-role">{role}</div>
            </div>
            
            <div className="spotify-embed-container">
                <iframe 
                    style={{ borderRadius: '12px' }} 
                    src={embedUrl}
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    title={`Spotify - ${title} by ${artist}`}
                />
            </div>
        </div>
    );
};

export default SpotifyTrack; 