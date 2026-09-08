/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
 *         seller_id:
 *           type: string
 *           format: uuid
 *           example: "e2c3d4e5-f6a7-48b9-bc01-23456789abcd"
 *         name:
 *           type: string
 *           example: "Apple iPhone 15 Pro"
 *         slug:
 *           type: string
 *           example: "apple-iphone-15-pro"
 *         description:
 *           type: string
 *           example: "Titanium design with A17 Pro chip and super retina XDR display."
 *         category_id:
 *           type: integer
 *           example: 1
 *         tax_category_id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           nullable: true
 *           example: "Apple"
 *         type:
 *           type: string
 *           enum: [physical, digital, service]
 *           example: "physical"
 *         base_price:
 *           type: number
 *           example: 999.99
 *         base_cost:
 *           type: number
 *           example: 750.00
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T12:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T12:00:00Z"
 *     CreateProductInput:
 *       type: object
 *       required:
 *         - seller_id
 *         - name
 *         - description
 *         - category_id
 *         - tax_category_id
 *       properties:
 *         seller_id:
 *           type: string
 *           format: uuid
 *           example: "e2c3d4e5-f6a7-48b9-bc01-23456789abcd"
 *         name:
 *           type: string
 *           example: "Apple iPhone 15 Pro"
 *         slug:
 *           type: string
 *           description: Unique slug (auto-generated if omitted)
 *           example: "apple-iphone-15-pro"
 *         description:
 *           type: string
 *           example: "Titanium design with A17 Pro chip."
 *         category_id:
 *           type: integer
 *           example: 1
 *         tax_category_id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           example: "Apple"
 *         type:
 *           type: string
 *           enum: [physical, digital, service]
 *           default: "physical"
 *         base_price:
 *           type: number
 *           example: 999.99
 *         base_cost:
 *           type: number
 *           example: 750.00
 *         is_active:
 *           type: boolean
 *           default: true
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Apple iPhone 15 Pro Max"
 *         slug:
 *           type: string
 *           example: "apple-iphone-15-pro-max"
 *         description:
 *           type: string
 *           example: "Updated specifications"
 *         category_id:
 *           type: integer
 *           example: 1
 *         tax_category_id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           example: "Apple"
 *         type:
 *           type: string
 *           enum: [physical, digital, service]
 *         base_price:
 *           type: number
 *           example: 1099.99
 *         base_cost:
 *           type: number
 *           example: 800.00
 *         is_active:
 *           type: boolean
 *           example: true
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     description: List all products in the catalog. Public access.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 * 
 *   post:
 *     summary: Create a product
 *     description: Create a new product. Admin only.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Slug already exists
 * 
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product details
 *     description: Get a single product by UUID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 * 
 *   put:
 *     summary: Update a product
 *     description: Update an existing product by UUID. Admin only.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 * 
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by UUID. Admin only.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

export { };