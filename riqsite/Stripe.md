# Stripe Implementation

Set up the server
Install the Stripe Ruby library
Install the Stripe ruby gem and require it in your code. Alternatively, if you’re starting from scratch and need a Gemfile, download the project files using the link in the code editor.


Terminal

Bundler

GitHub
Install the gem:

gem install stripe

Server
Create a Checkout Session
Add an endpoint on your server that creates a Checkout Session. A Checkout Session controls what your customer sees on the payment page such as line items, the order amount and currency, and acceptable payment methods. We enable cards and other common payment methods for you by default, and you can enable or disable payment methods directly in the Stripe Dashboard.

Server
Define a product to sell
Always keep sensitive information about your product inventory, such as price and availability, on your server to prevent customer manipulation from the client. Define product information when you create the Checkout Session using predefined price IDs or on the fly with price_data.



One-time

Recurring
Name
Sunglasses, premium plan, etc.
Price
0.00

USD

Create test product
More options
Server
Choose a mode
To handle different transaction types, adjust the mode parameter. For one-time payments, use payment. To initiate recurring payments with subscriptions, switch the mode to subscription. And for setting up future payments, set the mode to setup.

Server
Supply success and cancel URLs
Specify URLs for success and cancel pages—make sure they’re publicly accessible so Stripe can redirect customers to them. You can also handle both the success and canceled states with the same URL.

Server
Redirect to Checkout
After creating the session, redirect your customer to the URL for the Checkout page returned in the response.

Server
2
Build your checkout
Add an order preview page
Add a page to show a preview of the customer’s order. Allow them to review or modify their order—as soon as they’re sent to the Checkout page, the order is final and they can’t modify it without creating a new Checkout Session.

Client
Add a checkout button
Add a button to your order preview page. When your customer clicks this button, they’re redirected to the Stripe-hosted payment form.

Client
3
Test your page
Run the application
Start your server and navigate to http://localhost:3000/checkout

ruby server.rb

Client
Try it out
Click the checkout button to be redirected to the Stripe Checkout page. Use any of these test cards to simulate a payment.

Payment succeeds

4242 4242 4242 4242
Payment requires authentication

4000 0025 0000 3155
Payment is declined

4000 0000 0000 9995
Congratulations!
You have a basic Checkout integration working. Now learn how to customize the appearance of your checkout page and automate tax collection.

##CODE EXAMPLE
require 'stripe'
require 'sinatra'

# This is your test secret API key.
Stripe.api_key = 'sk_test_51R7GZb4NECjcRZYJmb4Hgrjw5LSikpS5xYEz0NrFwKyCPsWE7ab5GPSq2PxKMGnodullNf9wa7nUsSL5c0hLyIbS00EhlIgYXR'

set :static, true
set :port, 4242

YOUR_DOMAIN = 'http://localhost:4242'

post '/create-checkout-session' do
  content_type 'application/json'

  session = Stripe::Checkout::Session.create({
    line_items: [{
      # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
      price: '{{PRICE_ID}}',
      quantity: 1,
    }],
    mode: 'payment',
    success_url: YOUR_DOMAIN + '?success=true',
    cancel_url: YOUR_DOMAIN + '?canceled=true',
  })
  redirect session.url, 303
end

import React, { useState, useEffect } from "react";
import "./App.css";

const ProductDisplay = () => (
  <section>
    <div className="product">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
      />
      <div className="description">
      <h3>Stubborn Attachments</h3>
      <h5>$20.00</h5>
      </div>
    </div>
    <form action="/create-checkout-session" method="POST">
      <button type="submit">
        Checkout
      </button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}