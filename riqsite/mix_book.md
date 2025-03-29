Here's a detailed markdown explanation of how the attached files work in your React application, specifically focusing on the `Booking.tsx` and `Booking.css` files.

# Overview of the Booking Component

The `Booking.tsx` file is a React component responsible for handling the booking process for a studio session. It allows users to input their personal information, select a service, and confirm their booking. The component utilizes hooks for state management and side effects, and it integrates with the React Router for navigation.

## Key Features of `Booking.tsx`

### 1. Imports
The component imports necessary libraries and styles:
```typescript
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/Booking.css';
```
- **React**: The core library for building the component.
- **useState** and **useEffect**: Hooks for managing state and side effects.
- **useLocation** and **useNavigate**: Hooks from React Router for handling navigation and accessing route information.

### 2. Interfaces
The component defines TypeScript interfaces to ensure type safety:
```typescript
interface BookingState {
    selectedService: string;
    serviceName: string;
    servicePrice: number;
    description: string;
}
```
- **BookingState**: Represents the state of the booking, including selected service details.

### 3. Time Slots
The component defines an array of available time slots for booking:
```typescript
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
```
- This array is used to populate the dropdown for selecting a preferred time.

### 4. State Management
The component manages several pieces of state:
```typescript
const [bookingState, setBookingState] = useState<BookingState | null>(null);
const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    date: '',
    time: '',
    location: 'Dreamstar'
});
const [errors, setErrors] = useState<Record<string, string>>({});
```
- **bookingState**: Holds the state passed from the previous component (Mixing).
- **formData**: Holds the user's input data for the booking form.
- **errors**: Stores validation error messages for form fields.

### 5. Form Handling
The component includes functions to handle form changes, validation, and submission:
```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Validation logic...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        // Submit logic...
    }
};
```
- **handleInputChange**: Updates the form data state as the user types.
- **validateForm**: Checks for errors in the form fields and updates the errors state.
- **handleSubmit**: Prevents the default form submission and validates the form before proceeding.

### 6. Rendering the Form
The component renders a form with various input fields:
```typescript
<form className="booking-form" onSubmit={handleSubmit}>
    <div className="booking-header">
        <h3>Complete Your Booking</h3>
        <p>Fill out the form below to book your {bookingState.serviceName} session</p>
    </div>
    {/* Input fields for full name, phone number, date, time, and location */}
</form>
```
- The form includes fields for the user's full name, phone number, preferred date, and time, as well as a dropdown for selecting the location.

### 7. Booking Summary
The component displays a summary of the booking details:
```typescript
<div className="booking-summary">
    <h4>Booking Summary</h4>
    <div className="summary-item">
        <span>Service:</span>
        <span>{bookingState.serviceName}</span>
    </div>
    {/* Other summary items */}
</div>
```
- This section provides a quick overview of the selected service and user input.

## Overview of `Booking.css`

The `Booking.css` file contains styles for the Booking component, ensuring it matches the overall design of the application.

### Key Styles

1. **Container Styles**
```css
.booking-container {
    background: #2e1d23;
    border-radius: 10px;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}
```
- Sets the background color, padding, and border radius for the booking container.

2. **Form Styles**
```css
.booking-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}
```
- Uses a grid layout for the form, allowing for responsive design.

3. **Input Styles**
```css
.form-group input,
.form-group select {
    width: 100%;
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #c6497b;
    background: #2e1d23;
    color: white;
}
```
- Styles input fields and selects to match the dark theme of the application.

4. **Button Styles**
```css
.submit-button {
    background: #f7a8b8;
    color: #2e1d23;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
}
```
- Styles the submit button with a background color and hover effects.

5. **Responsive Adjustments**
```css
@media (max-width: 768px) {
    .booking-form {
        grid-template-columns: 1fr;
    }
}
```
- Ensures the form is responsive on smaller screens by stacking the input fields.

## Conclusion

The `Booking.tsx` and `Booking.css` files work together to create a user-friendly booking interface for your application. The component handles user input, validates the data, and displays a summary of the booking details, all while maintaining a consistent design with the rest of the site. The CSS styles ensure that the booking form is visually appealing and responsive, enhancing the overall user experience.
