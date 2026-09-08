/**
 * @openapi
 * components:
 *   schemas:
 *     VariantAttribute:
 *       type: object
 *       properties:
 *         type_id:
 *           type: integer
 *           example: 1
 *         type_name:
 *           type: string
 *           example: "Color"
 *         value_id:
 *           type: integer
 *           example: 3
 *         value:
 *           type: string
 *           example: "Space Black"
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7a"
 *         product_id:
 *           type: string
 *           format: uuid
 *           example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
 *         sku:
 *           type: string
 *           example: "IPHONE-15-PRO-BLK-256"
 *         price:
 *           type: number
 *           nullable: true
 *           example: 999.99
 *         discount_price:
 *           type: number
 *           nullable: true
 *           example: 949.99
 *         cost:
 *           type: number
 *           nullable: true
 *           example: 750.00
 *         stock:
 *           type: integer
 *           example: 50
 *         version:
 *           type: integer
 *           example: 1
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantAttribute'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T14:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T14:00:00Z"
 *     CreateVariantInput:
 *       type: object
 *       required:
 *         - sku
 *       properties:
 *         sku:
 *           type: string
 *           description: Unique SKU for this variation
 *           example: "IPHONE-15-PRO-BLK-256"
 *         price:
 *           type: number
 *           example: 999.99
 *         discount_price:
 *           type: number
 *           example: 949.99
 *         cost:
 *           type: number
 *           example: 750.00
 *         stock:
 *           type: integer
 *           default: 0
 *           example: 25
 *         attribute_value_ids:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of attribute value IDs associated with this variation (e.g., Color ID and Storage ID)
 *           example: [3, 10]
 *     UpdateVariantInput:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: "IPHONE-15-PRO-BLK-256-V2"
 *         price:
 *           type: number
 *           example: 979.99
 *         discount_price:
 *           type: number
 *           example: 929.99
 *         cost:
 *           type: number
 *           example: 740.00
 *         stock:
 *           type: integer
 *           example: 40
 *         attribute_value_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [3, 11]
 *     VariantResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ProductVariant'
 *     VariantListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @openapi
 * /api/v1/variants/products/{productId}/variants:
 *   get:
 *     summary: Get all variants of a product
 *     description: Retrieve all variations for a given product ID, including their configured attributes.
 *     tags:
 *       - Product Variations
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantListResponse'
 * 
 *   post:
 *     summary: Create a product variation
 *     description: Add a new variant to a product and link attribute values. Admin only.
 *     tags:
 *       - Product Variations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVariantInput'
 *     responses:
 *       201:
 *         description: Variant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: SKU already exists
 * 
 * /api/v1/variants/variants/{id}:
 *   get:
 *     summary: Get variant by ID
 *     description: Retrieve specific variation details and associated attributes.
 *     tags:
 *       - Product Variations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Variant details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantResponse'
 *       404:
 *         description: Variant not found
 * 
 *   put:
 *     summary: Update variant
 *     description: Update SKU, pricing, inventory stock, or attribute value mappings. Admin only.
 *     tags:
 *       - Product Variations
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
 *             $ref: '#/components/schemas/UpdateVariantInput'
 *     responses:
 *       200:
 *         description: Variant updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantResponse'
 *       404:
 *         description: Variant not found
 *       409:
 *         description: SKU already exists
 * 
 *   delete:
 *     summary: Delete variant
 *     description: Delete a product variation by UUID. Admin only.
 *     tags:
 *       - Product Variations
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
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 */

export { };