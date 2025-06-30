const express = require('express');
const notesController = require('../controllers/notes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Manage personal notes (CRUD & filtering by tag/category)
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note with a title, content, and optional tags/categories.
 *     tags: [Notes]
 *     requestBody:
 *       description: Note data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteCreateRequest"
 *           examples:
 *             SimpleNote:
 *               summary: Minimal note
 *               value: { "title": "Todo", "content": "Finish homework" }
 *             FullNote:
 *               summary: Note with tags/categories
 *               value: { "title": "Groceries", "content": "Buy eggs", "tags": ["shopping"], "categories": ["personal"] }
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Note"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
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
 *     summary: List all notes (optionally filter by tags/categories)
 *     description: Retrieve all notes. Supports query filtering by tag or category (any match).
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags to filter by (e.g. "personal,urgent")
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated categories to filter by (e.g. "work,ideas")
 *     responses:
 *       200:
 *         description: List of notes, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Note"
 *             examples:
 *               NoteArray:
 *                 summary: Example notes
 *                 value:
 *                   - _id: "6601f6e9b41c26de3cd5bb40"
 *                     title: "Shopping"
 *                     content: "Milk, Bread"
 *                     tags: ["groceries"]
 *                     categories: ["personal"]
 *                     createdAt: "2024-04-01T10:11:12Z"
 *                     updatedAt: "2024-04-01T10:12:12Z"
 *                   - _id: "6601f6e9b41c26de3cd5bb41"
 *                     title: "Work tasks"
 *                     content: "Submit report"
 *                     tags: ["work"]
 *                     categories: ["work"]
 *                     createdAt: "2024-04-02T13:40:20Z"
 *                     updatedAt: "2024-04-02T13:45:20Z"
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
 *     description: Retrieve a single note by its MongoDB ObjectId.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "6601f6e9b41c26de3cd5bb40"
 *         description: The note ID.
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Note"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       400:
 *         $ref: "#/components/responses/InvalidId"
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
 *     description: Update note fields (partial update, at least one field required).
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "6601f6e9b41c26de3cd5bb40"
 *         description: The note ID.
 *     requestBody:
 *       description: One or more note fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteUpdateRequest"
 *           examples:
 *             UpdateTitle:
 *               summary: Change note title
 *               value: { "title": "New title" }
 *             UpdateAll:
 *               summary: Update all fields
 *               value: { "title": "T1", "content": "Updated", "tags": ["foo"], "categories": ["archives"] }
 *     responses:
 *       200:
 *         description: Updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Note"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       404:
 *         $ref: "#/components/responses/NotFound"
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
 *     description: Remove a note. Returns deleted note object for confirmation.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "6601f6e9b41c26de3cd5bb40"
 *         description: The note ID.
 *     responses:
 *       200:
 *         description: Note deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NoteDeleteResponse"
 *             examples:
 *               DeletedNote:
 *                 value:
 *                   message: "Note deleted"
 *                   note:
 *                     _id: "6601f6e9b41c26de3cd5bb40"
 *                     title: "Trashed note"
 *                     content: "to be deleted"
 *                     tags: []
 *                     categories: []
 *                     createdAt: "2024-04-01T10:11:12Z"
 *                     updatedAt: "2024-04-02T12:12:12Z"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       400:
 *         $ref: "#/components/responses/InvalidId"
 */
router.delete(
  '/:id',
  notesController.validateNoteIdParam,
  notesController.deleteNote
);

module.exports = router;
