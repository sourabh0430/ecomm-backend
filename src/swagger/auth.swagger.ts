/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - confirmPassword
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user (1-100 characters)
 *           example: Sourabh Jain
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address
 *           example: sourabh.jain@example.com
 *         phone:
 *           type: string
 *           description: Contact phone number (5-15 characters)
 *           example: "+919876543210"
 *         password:
 *           type: string
 *           format: password
 *           description: Login password (6-100 characters)
 *           example: "SecretPassword123"
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirm password, must match password
 *           example: "SecretPassword123"
 *         role:
 *           type: string
 *           enum: [seller, buyer]
 *           description: User role (seller or buyer)
 *           example: buyer
 *     RegisterUserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User registered successfully
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Sourabh Jain
 *                 email:
 *                   type: string
 *                   example: sourabh.jain@example.com
 *                 phone:
 *                   type: string
 *                   example: "+919876543210"
 *                 role:
 *                   type: string
 *                   example: buyer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-08-27T18:30:54Z"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message detail
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Validation Failed
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: email
 *               message:
 *                 type: string
 *                 example: Invalid email address
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the role of seller or buyer.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: User already exists (email/phone conflict)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export {};
