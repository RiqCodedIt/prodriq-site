# RIQ Booking Server

This is a Ruby server that handles booking submissions from the RIQ website and integrates with Stripe for payment processing.

## Features

- Accepts booking form submissions from the React frontend
- Stores booking data in JSON files
- Creates Stripe checkout sessions
- Handles Stripe webhook events
- Provides endpoints for retrieving booking data

## Prerequisites

- Ruby 2.7 or higher
- Bundler
- Stripe account with API keys

## Installation

1. Install dependencies:

```bash
bundle install
```

2. Configure your Stripe API keys:

Edit `server.rb` and replace the Stripe API key with your own:

```ruby
Stripe.api_key = 'sk_test_your_stripe_test_key'
```

For production, use your live key and store it in an environment variable:

```ruby
Stripe.api_key = ENV['STRIPE_SECRET_KEY']
```

3. Configure Stripe webhook signing secret:

Edit the webhook handler in `server.rb` and replace the webhook signing secret:

```ruby
event = Stripe::Webhook.construct_event(
  payload, sig_header, 'whsec_your_webhook_signing_secret'
)
```

## Running the Server

Start the server:

```bash
ruby server.rb
```

The server will run on port 4242 by default.

## Endpoints

- `POST /create-checkout-session`: Create a Stripe checkout session
- `POST /webhook`: Handle Stripe webhook events
- `GET /bookings`: Get all bookings (for admin purposes)
- `GET /success`: Success endpoint for redirects
- `GET /`: Test endpoint

## Integrating with the React Frontend

The server is designed to work with the RIQ React frontend. Make sure your frontend sends booking data in the expected format:

```javascript
const bookingData = {
  service: {
    id: "serviceId",
    name: "Service Name",
    price: 50, // in dollars
  },
  client: {
    fullName: "Client Name",
    phoneNumber: "123-456-7890",
  },
  session: {
    date: "2023-06-01",
    time: "10:00 AM",
    location: "Dreamstar",
  },
  project: {
    description: "Project description"
  }
};
```

## Stripe Webhook Setup

To test Stripe webhooks locally:

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run the following command:

```bash
stripe listen --forward-to localhost:4242/webhook
```

3. Use the webhook signing secret provided by the Stripe CLI.

## Folder Structure

- `bookings/`: Directory where booking data is stored
- `server.rb`: Main server file
- `Gemfile`: Ruby dependencies

## Data Storage

Booking data is stored in JSON files in the `bookings/` directory. Each booking gets its own file named with the pattern:

```
booking_[timestamp]_[client_name].json
```

## Production Deployment

For production deployment:

1. Use environment variables for sensitive data:
   - Stripe API keys
   - Webhook signing secrets
   - Redirect URLs

2. Use a proper web server like Nginx or Apache in front of the Ruby application.

3. Consider a more robust database for storing booking data instead of JSON files.

## Troubleshooting

- Check the logs for error messages
- Verify that your Stripe API keys are correct
- Make sure CORS is properly configured for your frontend
- Ensure the webhook signing secret is correct 