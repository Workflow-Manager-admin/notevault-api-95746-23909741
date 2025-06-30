const express = require('express');
const notesController = require('../controllers/notes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management (CRUD)
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       description: Note data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Note title.
 *               content:
 *                 type: string
 *                 description: Note content.
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *               categories:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  notesController.validateCreateNote,
  notesController.createNote
);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes (optionally filter by tags/categories)
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by.
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated list of categories to filter by.
 *     responses:
 *       200:
 *         description: Array of notes
 */
router.get(
  '/',
  notesController.getNotes
);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID.
 *     responses:
 *       200:
 *         description: Note found
 *       404:
 *         description: Note not found
 *       400:
 *         description: Invalid ID
 */
router.get(
  '/:id',
  notesController.validateNoteIdParam,
  notesController.getNoteById
);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID.
 *     requestBody:
 *       description: Fields to update (at least one required)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               categories: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Updated note
 *       400:
 *         description: Validation or update error
 *       404:
 *         description: Note not found
 */
router.put(
  '/:id',
  notesController.validateNoteIdParam,
  notesController.validateUpdateNote,
  notesController.updateNote
);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID.
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 *       400:
 *         description: Invalid ID
 */
router.delete(
  '/:id',
  notesController.validateNoteIdParam,
  notesController.deleteNote
);

module.exports = router;
