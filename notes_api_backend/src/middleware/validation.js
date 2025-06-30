'use strict';

/**
 * Note Validation Middleware for Express: Validates note creation and update.
 * Enforces required fields, type checking, and field length constraints.
 * - title: required, string, min 1, max 120 chars
 * - content: required, string, min 1, max 5000 chars
 * - tags: optional, array of strings (each <= 32 chars)
 * - categories: optional, array of strings (each <= 32 chars)
 */

// PUBLIC_INTERFACE
/**
 * Validate request body for creating a note.
 * Ensures title, content are required and length-constrained; tags/categories optional.
 */
function validateCreateNote(req, res, next) {
  const { title, content, tags, categories } = req.body;

  if (typeof title !== 'string' || !title.trim() || title.length > 120) {
    return res.status(400).json({ message: 'Title is required, must be a non-empty string, and at most 120 characters.' });
  }
  if (typeof content !== 'string' || !content.trim() || content.length > 5000) {
    return res.status(400).json({ message: 'Content is required, must be a non-empty string, and at most 5000 characters.' });
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every(t => typeof t === 'string' && t.length <= 32)) {
      return res.status(400).json({ message: 'Tags must be an array of strings (each at most 32 characters).' });
    }
  }
  if (categories !== undefined) {
    if (!Array.isArray(categories) || !categories.every(c => typeof c === 'string' && c.length <= 32)) {
      return res.status(400).json({ message: 'Categories must be an array of strings (each at most 32 characters).' });
    }
  }
  next();
}

// PUBLIC_INTERFACE
/**
 * Validate request body for updating a note.
 * At least one updatable field required. Apply type and length constraints to present fields.
 */
function validateUpdateNote(req, res, next) {
  const { title, content, tags, categories } = req.body;
  if (title === undefined && content === undefined && tags === undefined && categories === undefined) {
    return res.status(400).json({ message: 'At least one updatable field (title, content, tags, categories) must be provided.' });
  }
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim() || title.length > 120) {
      return res.status(400).json({ message: 'Title, if provided, must be a non-empty string and at most 120 characters.' });
    }
  }
  if (content !== undefined) {
    if (typeof content !== 'string' || !content.trim() || content.length > 5000) {
      return res.status(400).json({ message: 'Content, if provided, must be a non-empty string and at most 5000 characters.' });
    }
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every(t => typeof t === 'string' && t.length <= 32)) {
      return res.status(400).json({ message: 'Tags, if provided, must be an array of strings (each at most 32 characters).' });
    }
  }
  if (categories !== undefined) {
    if (!Array.isArray(categories) || !categories.every(c => typeof c === 'string' && c.length <= 32)) {
      return res.status(400).json({ message: 'Categories, if provided, must be an array of strings (each at most 32 characters).' });
    }
  }
  next();
}

module.exports = {
  validateCreateNote,
  validateUpdateNote,
};
