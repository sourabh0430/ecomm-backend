/**
 * @openapi
 * components:
 *   schemas:
 *     AttributeType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Color"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T10:00:00Z"
 *     AttributeValue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         attribute_type_id:
 *           type: integer
 *           example: 1
 *         value:
 *           type: string
 *           example: "Red"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-30T10:00:00Z"
 *     CreateAttributeTypeInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the attribute (e.g., Color, Size, Storage)
 *           example: "Color"
 *     UpdateAttributeTypeInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Primary Color"
 *     CreateAttributeValueInput:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *           description: Attribute value (e.g., Red, XL, 256GB)
 *           example: "Midnight Blue"
 *     UpdateAttributeValueInput:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *           example: "Navy Blue"
 *     AttributeTypeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/AttributeType'
 *     AttributeTypeListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeType'
 *     AttributeValueResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/AttributeValue'
 *     AttributeValueListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeValue'
 */

/**
 * @openapi
 * /api/v1/attributes:
 *   get:
 *     summary: List all attribute types
 *     description: Retrieve all attribute types (e.g., Color, Size). Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attribute types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeTypeListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 *   post:
 *     summary: Create an attribute type
 *     description: Create a new attribute type. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttributeTypeInput'
 *     responses:
 *       201:
 *         description: Attribute type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeTypeResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Attribute type already exists
 * 
 * /api/v1/attributes/{id}:
 *   put:
 *     summary: Update an attribute type
 *     description: Update name of an attribute type by ID. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttributeTypeInput'
 *     responses:
 *       200:
 *         description: Attribute type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeTypeResponse'
 *       404:
 *         description: Attribute type not found
 * 
 *   delete:
 *     summary: Delete an attribute type
 *     description: Delete an attribute type and its associated values. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attribute type deleted
 *       404:
 *         description: Attribute type not found
 * 
 * /api/v1/attributes/{typeId}/values:
 *   get:
 *     summary: List values for an attribute type
 *     description: Retrieve all values under a specific attribute type. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: typeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Values retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeValueListResponse'
 * 
 *   post:
 *     summary: Add a value to an attribute type
 *     description: Add a new value to an attribute type. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: typeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttributeValueInput'
 *     responses:
 *       201:
 *         description: Attribute value created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeValueResponse'
 *       404:
 *         description: Attribute type not found
 *       409:
 *         description: Value already exists under this type
 * 
 * /api/v1/attributes/values/{valueId}:
 *   put:
 *     summary: Update an attribute value
 *     description: Update the value string by its ID. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: valueId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttributeValueInput'
 *     responses:
 *       200:
 *         description: Attribute value updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributeValueResponse'
 *       404:
 *         description: Attribute value not found
 * 
 *   delete:
 *     summary: Delete an attribute value
 *     description: Remove an attribute value by ID. Admin only.
 *     tags:
 *       - Product Attributes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: valueId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attribute value deleted
 *       404:
 *         description: Attribute value not found
 */

export { };