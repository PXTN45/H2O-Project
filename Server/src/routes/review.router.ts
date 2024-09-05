
/**
 * @swagger
 * /respondToReview/{id}:
 *   post:
 *     summary: Respond to a review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responder:
 *                 type: string
 *                 description: The ID of the admin responding to the review
 *               content:
 *                 type: string
 *                 description: The content of the response
 *             example:
 *               responder: "668f17e531ff843f51f18852"
 *               content: "ขอบคุณสำหรับรีวิวของคุณ!"
 *     responses:
 *       200:
 *         description: Successfully responded to the review.
 *       403:
 *         description: Forbidden. Only admins can respond to reviews.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */

import express, { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getRating,
  updateReview,
  getReviewByHomeStay,
  getReviewByPackageId,
  respondToReview
} from "../controller/review.controller";

const router = express.Router();

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: Successfully retrieved all reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/review", getAllReview);

/**
 * @swagger
 * /createReview:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Successfully created a review.
 */
router.post("/createReview", createReview);

/**
 * @swagger
 * /updateReview/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *             example:
 *               content: "Updated review content"
 *               rating: 4
 *     responses:
 *       200:
 *         description: Successfully updated the review.
 */
router.put("/updateReview/:id", updateReview);

/**
 * @swagger
 * /deleteReview/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the review.
 */
router.delete("/deleteReview/:id", deleteReview);

/**
 * @swagger
 * /getRating/{homestayId}:
 *   get:
 *     summary: Get rating details by homestay ID
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: homestayId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the homestay to retrieve rating details for
 *     responses:
 *       200:
 *         description: Successfully retrieved rating details for the homestay.
 */
router.get("/getRating/:homestayId", getRating);

/**
 * @swagger
 * /getReviewByHomeStay/{homeStayId}:
 *   get:
 *     summary: Get reviews by homestay ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: homeStayId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the homestay to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the homestay.
 */
router.get("/getReviewByHomeStay/:homeStayId", getReviewByHomeStay);

/**
 * @swagger
 * /getReviewByPackage/{packageId}:
 *   get:
 *     summary: Get reviews by package ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the package.
 */
router.get("/getReviewByPackage/:packageId", getReviewByPackageId);

router.post("/respondToReview/:id", respondToReview);

export default router;
