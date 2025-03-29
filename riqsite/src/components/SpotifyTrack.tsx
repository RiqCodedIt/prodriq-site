import React, { useState, useRef, useEffect } from 'react';

interface SpotifyTrackProps {
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
    role: string;
}

const SpotifyTrack: React.FC<SpotifyTrackProps> = ({ 
    title, 
    artist, 
    albumArt, 
    previewUrl, 
    role 
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!previewUrl) {
            console.warn(`No preview URL available for track: ${title}`);
            setError('Preview not available');
        }
    }, [previewUrl, title]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // Pause all other audio elements
                document.querySelectorAll('audio').forEach(audio => {
                    if (audio !== audioRef.current) {
                        audio.pause();
                        // Find the parent track and update its state
                        const trackEl = audio.closest('.track-card');
                        if (trackEl) {
                            const trackId = trackEl.id;
                            const playButton = trackEl.querySelector('.play-button');
                            if (playButton) {
                                playButton.innerHTML = '▶';
                            }
                        }
                    }
                });
                
                // Try to play the audio
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
            }
            setIsPlaying(!isPlaying);
            setError(null);
        } catch (err) {
            console.error('Error playing audio:', err);
            setError('Failed to play audio');
        }
    };

    // Handle audio ending
    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div className="track-card" id={`track-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            <img src={albumArt} alt={`${title} album art`} className="album-art" />
            <div className="track-info">
                <div className="track-title">{title}</div>
                <div className="track-artist">{artist}</div>
                <div className="track-role">{role}</div>
                
                <div className="audio-controls">
                    <button 
                        className="play-button" 
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        disabled={!previewUrl}
                    >
                        {isPlaying ? '❚❚' : '▶'}
                    </button>
                    
                    {isPlaying && (
                        <div className="wave-animation">
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="error-message" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        {error}
                    </div>
                )}
                
                <audio 
                    ref={audioRef} 
                    src={previewUrl} 
                    onEnded={handleAudioEnd}
                    onError={(e) => {
                        console.error('Audio error:', e);
                        setError('Failed to load audio');
                    }}
                    hidden
                />
            </div>
        </div>
    );
};

export default SpotifyTrack; 