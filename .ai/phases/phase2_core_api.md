# Phase 2: Core E-Commerce API & Interactions

## Objectives
Build the core e-commerce features including product catalog, user profiles, shopping cart, and wishlist.

## Tasks
1. **Product Catalog:**
   - Define MongoDB schemas for `Product`, `Category`, and `Brand`.
   - Implement GraphQL Queries/Mutations for CRUD operations on products.
   - **Admin Feature:** Endpoints to manage catalog.
   - **User Feature:** Endpoints to view products, categories.

2. **User Profiles:**
   - Implement `UserProfile` schema in MySQL (extending base user).
   - Endpoints for "Manage Addresses" and "Profile Update".

3. **Shopping Cart:**
   - Implement `Cart` schema (can be stored in Redis for fast access, backed by MongoDB).
   - Endpoints: Add to Cart, Remove from Cart, Update Quantity, Clear Cart.

4. **Wishlist:**
   - Implement `Wishlist` schema in MongoDB.
   - Endpoints: Add to Wishlist, Remove, View Wishlist.

## Definition of Done
- Users can browse products, manage their profile, add items to their cart, and maintain a wishlist.
- Admins can create and update products.
