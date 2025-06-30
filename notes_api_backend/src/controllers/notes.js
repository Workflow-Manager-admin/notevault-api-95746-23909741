'use strict';

/**
 * Notes Controller
 * Handles HTTP request/response for Note CRUD operations.
 * Calls service layer functions and formats API responses.
 */

const notesService = require('../services/notes');
const { Types } = require('mongoose');

// --- Validation Middleware ---

/**
 * Validate note creation request body.
 */
function validateCreateNote(req, res, next) {
  const { title, content, tags, categories } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Content is required and must be a non-empty string.' });
  }
  if (tags && (!Array.isArray(tags) || !tags.every(t => typeof t === 'string'))) {
    return res.status(400).json({ message: 'Tags must be an array of strings.' });
  }
  if (categories && (!Array.isArray(categories) || !categories.every(c => typeof c === 'string'))) {
    return res.status(400).json({ message: 'Categories must be an array of strings.' });
  }
  next();
}

/**
 * Validate note update request body.
 */
function validateUpdateNote(req, res, next) {
  const { title, content, tags, categories } = req.body;
  if (!title && !content && !tags && !categories) {
    return res.status(400).json({ message: 'At least one field (title, content, tags, categories) must be provided for update.' });
  }
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ message: 'Title, if provided, must be a non-empty string.' });
  }
  if (content !== undefined && (typeof content !== 'string' || !content.trim())) {
    return res.status(400).json({ message: 'Content, if provided, must be a non-empty string.' });
  }
  if (tags !== undefined && (!Array.isArray(tags) || !tags.every(t => typeof t === 'string'))) {
    return res.status(400).json({ message: 'Tags, if provided, must be an array of strings.' });
  }
  if (categories !== undefined && (!Array.isArray(categories) || !categories.every(c => typeof c === 'string'))) {
    return res.status(400).json({ message: 'Categories, if provided, must be an array of strings.' });
  }
  next();
}

/**
 * Validate that note ID in param is a valid MongoDB ObjectId.
 */
function validateNoteIdParam(req, res, next) {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID.' });
  }
  next();
}

// Controller methods

// PUBLIC_INTERFACE
/**
 * Create a new note.
 */
async function createNote(req, res) {
  try {
    const note = await notesService.createNote(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Get all notes, with optional tag/category filter (via query ?tags=tag1,tag2&categories=cat1)
 */
async function getNotes(req, res) {
  try {
    const tags = req.query.tags ? req.query.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined;
    const categories = req.query.categories ? req.query.categories.split(',').map(c => c.trim()).filter(Boolean) : undefined;
    const filters = {};
    if (tags) filters.tags = tags;
    if (categories) filters.categories = categories;
    const notes = await notesService.getNotes(filters);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Get a note by ID.
 */
async function getNoteById(req, res) {
  try {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Update a note by ID.
 */
async function updateNote(req, res) {
  try {
    const note = await notesService.updateNote(req.params.id, req.body);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Delete a note by ID.
 */
async function deleteNote(req, res) {
  try {
    const note = await notesService.deleteNote(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted', note });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  validateCreateNote,
  validateUpdateNote,
  validateNoteIdParam,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
