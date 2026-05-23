# Phase 3: Order Management & Checkout

## Objectives
Implement the checkout process, payment gateway integration, and shipping services.

## Tasks
1. **Order Management System:**
   - Define `Order` schema in MySQL (combines user ID, cart snapshot, shipping address, and payment status).
   - Implement order state machine (Pending -> Processing -> Shipped -> Delivered).

2. **Checkout Process:**
   - Create checkout API flow: Validate cart -> Calculate taxes/shipping -> Create Pending Order.

3. **Payment Gateway Integration:**
   - Integrate Stripe (using test mode for learning).
   - Implement Stripe Payment Intents.
   - Set up REST webhook endpoint to securely receive Stripe events (payment_intent.succeeded) and update Order status.

4. **Shipping Services Integration:**
   - Integrate Shippo or EasyPost (test mode).
   - Calculate shipping rates during checkout based on user address.
   - Generate mock shipping labels when order status moves to "Processing".

## Definition of Done
- Users can successfully convert a cart into a paid order using Stripe test cards.
- Orders accurately reflect shipping costs.
- Users can view "My Orders" in their profile.
