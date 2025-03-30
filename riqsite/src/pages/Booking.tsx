import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Booking.css';

interface BookingState {
    selectedService: string;
    serviceName: string;
    servicePrice: number;
    description: string;
}

// Define available time slots
const timeSlots = [
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
    "6:00 PM",
    "8:00 PM", 
    "10:00 PM",
    "12:00 AM",
];

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingState, setBookingState] = useState<BookingState | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        date: '',
        time: '',
        location: 'Dreamstar'
    });
    
    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Formatting helpers
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    const formatTime = (time: string) => {
        return time;
    };
    
    // Set min date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    // Load booking state from location
    useEffect(() => {
        if (location.state) {
            setBookingState(location.state as BookingState);
        } else {
            // Redirect back to mixing page if no state is provided
            navigate('/mixing');
        }
    }, [location.state, navigate]);
    
    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error for field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };
    
    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        // Phone number validation - must be in format XXX-XXX-XXXX
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be in format XXX-XXX-XXXX';
        }
        
        // Date validation
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        
        // Time validation
        if (!formData.time) {
            newErrors.time = 'Please select a time slot';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm() && bookingState) {
            try {
                // Combine form data with booking state
                const bookingData = {
                    service: {
                        id: bookingState.selectedService,
                        name: bookingState.serviceName,
                        price: bookingState.servicePrice,
                    },
                    client: {
                        fullName: formData.fullName,
                        phoneNumber: formData.phoneNumber,
                    },
                    session: {
                        date: formData.date,
                        time: formData.time,
                        location: formData.location,
                    },
                    project: {
                        description: bookingState.description
                    }
                };
                
                // Send data to the server
                const response = await fetch('http://localhost:4242/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData),
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                // Get the checkout URL from the response
                const data = await response.json();
                
                // Redirect to Stripe checkout
                window.location.href = data.url;
            } catch (error) {
                console.error('Error creating checkout session:', error);
                alert('Something went wrong. Please try again later.');
            }
        }
    };
    
    // Format phone number as user types
    const formatPhoneNumber = (value: string) => {
        // Strip all non-numeric characters
        const phoneNumber = value.replace(/\D/g, '');
        
        // Format as XXX-XXX-XXXX
        if (phoneNumber.length <= 3) {
            return phoneNumber;
        } else if (phoneNumber.length <= 6) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        } else {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };
    
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedNumber = formatPhoneNumber(e.target.value);
        setFormData({
            ...formData,
            phoneNumber: formattedNumber
        });
        
        // Clear error
        if (errors.phoneNumber) {
            setErrors({
                ...errors,
                phoneNumber: ''
            });
        }
    };
    
    // If no booking state, show loading
    if (!bookingState) {
        return (
            <div className="page-content">
                <h2>Booking</h2>
                <div className="content-section">
                    <p>Loading booking information...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="page-content">
            <h2>Book Your Session</h2>
            
            <div className="booking-container">
                <div className="audio-wave-decoration"></div>
                
                <form className="booking-form" onSubmit={handleSubmit}>
                    <div className="booking-header">
                        <h3>Complete Your Booking</h3>
                        <p>Fill out the form below to book your {bookingState.serviceName} session</p>
                    </div>
                    
                    {/* Personal Info */}
                    <div className="form-group">
                        <label htmlFor="fullName">Artist Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                        />
                        {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="XXX-XXX-XXXX"
                        />
                        {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                    </div>
                    
                    {/* Date and Time */}
                    <div className="form-group">
                        <label htmlFor="date">Preferred Date</label>
                        <input 
                            type="date" 
                            id="date" 
                            name="date" 
                            value={formData.date}
                            onChange={handleInputChange}
                            min={minDate}
                        />
                        {errors.date && <div className="error-message">{errors.date}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="time">Preferred Start Time</label>
                        <select 
                            id="time" 
                            name="time" 
                            value={formData.time}
                            onChange={handleInputChange}
                            className={!formData.time ? "placeholder-select" : ""}
                        >
                            <option value="" disabled>Select a time</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                        {errors.time && <div className="error-message">{errors.time}</div>}
                        <div className="note">* Minimum 2-hour session</div>
                    </div>
                    
                    {/* Location */}
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <select 
                            id="location" 
                            name="location" 
                            value={formData.location}
                            onChange={handleInputChange}
                        >
                            <option value="Dreamstar">Dreamstar</option>
                        </select>
                    </div>
                    
                    {/* Confirmation & Summary */}
                    <div className="booking-summary">
                        <h4>Booking Summary</h4>
                        <div className="summary-item">
                            <span>Service:</span>
                            <span>{bookingState.serviceName}</span>
                        </div>
                        <div className="summary-item">
                            <span>Project Details:</span>
                            <span>{bookingState.description.substring(0, 30)}...</span>
                        </div>
                        {formData.date && (
                            <div className="summary-item">
                                <span>Date:</span>
                                <span>{formatDate(formData.date)}</span>
                            </div>
                        )}
                        {formData.time && (
                            <div className="summary-item">
                                <span>Time:</span>
                                <span>{formatTime(formData.time)}</span>
                            </div>
                        )}
                        <div className="summary-item">
                            <span>Total:</span>
                            <span>${bookingState.servicePrice}</span>
                        </div>
                    </div>
                    
                    <div className="submit-container">
                        <button type="submit" className="submit-button">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Booking; 