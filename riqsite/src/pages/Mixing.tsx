import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/MixingServices.css';
import SpotifyTrack from '../components/SpotifyTrack';

// Define TypeScript interfaces
interface ServiceOption {
    id: string;
    name: string;
    price: number;
    description: string;
}

interface TrackData {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
    role: string;
}

interface FormErrors {
    description?: string;
}

interface SpotifyCredentials {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Track URLs and IDs
const trackUrls = [
    'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV',
    'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX',
    'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG'
];

const trackIds = trackUrls.map(url => url.split('/track/')[1].split('?')[0]);
const session_description = '*50% Deposit Required* Half of the session time is used for recording, the other half is for mixing your song for release on all platforms. Extensions are available if you want more time.'

// Service options
const serviceOptions: ServiceOption[] = [
    { id: '2HSession', name: '2 Hour Studio Session', price: 50, description: session_description },
    { id: '4HSession', name: '4 Hour Studio Session', price: 100, description: session_description },
    { id: '8HSession', name: '8 Hour Studio Session', price: 200, description: session_description }
];

// Track roles mapping
const trackRoles: Record<string, string> = {
    '3rlbQrNDUyIpF5QPjpFCkV': 'Mixed & Mastered by RIQ',
    '2hNLyPN3fM0Ds7LASznUkX': 'Mixed & Mastered by RIQ',
    '7ngZ2kMSW18SHZ7RG3QeOG': 'Produced by RIQ'
};

// Get Spotify credentials from environment variables
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Function to get Spotify API access token
const getSpotifyToken = async (): Promise<string | null> => {
    try {
        const authOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
            },
            body: 'grant_type=client_credentials'
        };

        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        if (!response.ok) {
            throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
        }
        
        const data: SpotifyCredentials = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error obtaining Spotify token:', error);
        return null;
    }
};

// Function to fetch track details from Spotify API
const fetchTrackDetails = async (trackId: string, token: string): Promise<TrackData | null> => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch track details for ${trackId}: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const albumArt = data.album.images && data.album.images.length > 0 ? data.album.images[0].url : 'https://via.placeholder.com/300';
        const previewUrl = data.preview_url || '';
        
        return {
            id: trackId,
            title: data.name,
            artist: data.artists[0].name,
            albumArt,
            previewUrl,
            role: trackRoles[trackId] || 'Produced by RIQ'
        };
    } catch (error) {
        console.error(`Error fetching track ${trackId}:`, error);
        return null;
    }
};

const Mixing = () => {
    // State variables
    const [selectedService, setSelectedService] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [featuredTracks, setFeaturedTracks] = useState<TrackData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch track data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Get Spotify API access token
                const token = await getSpotifyToken();
                if (!token) {
                    throw new Error('Failed to obtain Spotify API token');
                }
                
                // Fetch all tracks in parallel
                const tracks = await Promise.all(
                    trackIds.map(id => fetchTrackDetails(id, token))
                );
                
                // Filter out any failed fetches
                const validTracks = tracks.filter((track): track is TrackData => track !== null);
                
                if (validTracks.length === 0) {
                    setError('Unable to load any tracks from Spotify');
                }
                
                setFeaturedTracks(validTracks);
            } catch (error) {
                console.error("Error fetching tracks:", error);
                setError('Failed to load tracks from Spotify');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []); // Empty dependency array ensures it runs once on mount

    // Get the price of the selected service
    const getSelectedPrice = () => {
        const service = serviceOptions.find(s => s.id === selectedService);
        return service ? `$${service.price}` : '$0';
    };

    // Validate the form
    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        if (description.trim().length < 10) {
            newErrors.description = 'Please provide details about your project (minimum 10 characters)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle booking button click
    const handleBookNow = () => {
        if (!selectedService) {
            setErrors({ description: 'Please select a service' });
            return;
        }
        
        if (validateForm()) {
            navigate('/booking', { 
                state: { 
                    selectedService, 
                    serviceName: serviceOptions.find(s => s.id === selectedService)?.name,
                    servicePrice: serviceOptions.find(s => s.id === selectedService)?.price,
                    description 
                } 
            });
        }
    };

    return (
        <div className="page-content">
            <h2>Mixing + Mastering</h2>
            
            {/* Spotify Showcase Section */}
            <section className="spotify-showcase">
                <h3>Featured Work</h3>
                {isLoading ? (
                    <div className="loading-indicator">Loading tracks...</div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                        <p>Please check the console for more details or try again later.</p>
                    </div>
                ) : (
                    <div className="tracks-container">
                        {featuredTracks.map(track => (
                            <SpotifyTrack 
                                key={track.id}
                                title={track.title}
                                artist={track.artist}
                                albumArt={track.albumArt}
                                previewUrl={track.previewUrl}
                                role={track.role}
                                id={track.id}
                            />
                        ))}
                    </div>
                )}
            </section>
            
            {/* Services Section */}
            <section className="content-section">
                <h3>Services</h3>
                <div className="services-container">
                    {/* Left Side - Service Form */}
                    <div className="services-form">
                        <div className="form-group">
                            <label>Select a Service:</label>
                            <div className="radio-options">
                                {serviceOptions.map(option => (
                                    <div 
                                        className={`radio-option ${selectedService === option.id ? 'selected' : ''}`} 
                                        key={option.id}
                                        onClick={() => setSelectedService(option.id)}
                                    >
                                        <input
                                            type="radio"
                                            id={option.id}
                                            name="service"
                                            value={option.id}
                                            checked={selectedService === option.id}
                                            onChange={() => {}}
                                        />
                                        <div className="service-header">{option.name}</div>
                                        <div className="service-description">{option.description}</div>
                                        <div className="service-footer">
                                            <div className="service-price">${option.price}</div>
                                            <div className="service-id">{option.id}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Session Details:</label>
                            <textarea
                                id="description"
                                className="description-field"
                                placeholder="Describe what you're looking to get out of the session (e.g., genre, references, specific needs)"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            ></textarea>
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>
                    </div>
                    
                    {/* Right Side - Book Now Button */}
                    <div className="booking-button-container">
                        <div className="price-display">
                            {getSelectedPrice()}
                        </div>
                        <button className="book-now-button" onClick={handleBookNow}>
                            Book Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Mixing; 