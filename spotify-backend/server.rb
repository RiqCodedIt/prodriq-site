require 'stripe'
require 'sinatra'
require 'json'
require 'sinatra/cross_origin'
require 'date'
require 'fileutils'
require 'dotenv/load' if File.exist?(File.join(__dir__, '.env'))

# Configure Stripe API key
# Load from environment variable or use a default for development
Stripe.api_key = ENV['STRIPE_SECRET_KEY'] || 'sk_test_your_stripe_key_here'

# Configure Sinatra
set :port, 4242
set :bind, '0.0.0.0'

# Enable CORS
configure do
  enable :cross_origin
end

before do
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

options "*" do
  response.headers["Allow"] = "GET, POST, OPTIONS"
  200
end

# Create a bookings directory if it doesn't exist
bookings_dir = File.join(Dir.pwd, 'bookings')
FileUtils.mkdir_p(bookings_dir) unless File.directory?(bookings_dir)

# Create checkout session and save booking data
post '/create-checkout-session' do
  content_type :json
  
  # Parse the request body
  request_body = JSON.parse(request.body.read)
  
  begin
    # Extract data from request
    service = request_body['service']
    client = request_body['client']
    session_details = request_body['session']
    project = request_body['project']
    
    # Create a unique identifier for the booking
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    booking_id = "booking_#{timestamp}_#{client['fullName'].gsub(/\s+/, '_')}"
    
    # Format the booking data for saving
    booking_data = {
      id: booking_id,
      timestamp: Time.now.to_s,
      service: service,
      client: client,
      session: session_details,
      project: project,
      status: 'pending'
    }
    
    # Save booking data to a JSON file
    booking_file = File.join(bookings_dir, "#{booking_id}.json")
    File.open(booking_file, 'w') do |file|
      file.write(JSON.pretty_generate(booking_data))
    end
    
    # Create a Stripe Checkout Session
    session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: service['name'],
            description: "Session on #{session_details['date']} at #{session_details['time']}",
          },
          unit_amount: service['price'] * 100, # Convert dollars to cents
        },
        quantity: 1,
      }],
      metadata: {
        booking_id: booking_id,
      },
      mode: 'payment',
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&booking_id=#{booking_id}",
      cancel_url: "http://localhost:5173/booking?canceled=true",
    })
    
    # Update booking data with Stripe session ID
    booking_data[:stripe_session_id] = session.id
    File.open(booking_file, 'w') do |file|
      file.write(JSON.pretty_generate(booking_data))
    end
    
    # Return the session URL
    { url: session.url }.to_json
    
  rescue StandardError => e
    status 400
    { error: e.message }.to_json
  end
end

# Webhook for Stripe events
post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  
  begin
    event = Stripe::Webhook.construct_event(
      payload, sig_header, ENV['STRIPE_WEBHOOK_SECRET'] || 'whsec_your_webhook_signing_secret'
    )
    
    case event['type']
    when 'checkout.session.completed'
      session = event['data']['object']
      booking_id = session['metadata']['booking_id']
      
      # Update booking status to 'confirmed'
      booking_file = File.join(bookings_dir, "#{booking_id}.json")
      if File.exist?(booking_file)
        booking_data = JSON.parse(File.read(booking_file))
        booking_data['status'] = 'confirmed'
        booking_data['payment_status'] = session['payment_status']
        booking_data['payment_intent'] = session['payment_intent']
        
        File.open(booking_file, 'w') do |file|
          file.write(JSON.pretty_generate(booking_data))
        end
      end
    end
    
    status 200
    { received: true }.to_json
  rescue JSON::ParserError, Stripe::SignatureVerificationError => e
    status 400
    { error: e.message }.to_json
  end
end

# Success endpoint
get '/success' do
  "Payment successful! Your booking has been confirmed."
end

# For testing
get '/' do
  "RIQ Booking Server is running!"
end

# Get all bookings - for admin purposes
get '/bookings' do
  content_type :json
  
  bookings = []
  Dir.glob(File.join(bookings_dir, '*.json')).each do |file|
    bookings << JSON.parse(File.read(file))
  end
  
  bookings.to_json
end 