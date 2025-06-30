'use strict';

/**
 * Note Service Logic for CRUD Operations and Filtering
 * Provides create, read (single & multiple), update, and delete functions for Note model.
 * Supports filtering notes by tags and categories.
 */

const Note = require('./note.model');

/**
 * PUBLIC_INTERFACE
 * Create a new note in the database.
 * @param {Object} data - The note data { title, content, tags, categories }
 * @returns {Promise<Object>} - Created note document
 */
async function createNote(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Note data must be provided as an object');
  }
  const { title, content, tags = [], categories = [] } = data;
  if (!title || !content) {
    throw new Error('Both title and content are required');
  }
  const note = await Note.create({
    title,
    content,
    tags: Array.isArray(tags) ? tags : [],
    categories: Array.isArray(categories) ? categories : [],
  });
  return note;
}

/**
 * PUBLIC_INTERFACE
 * Retrieve a note by its ID.
 * @param {string} id - Note ID (MongoDB ObjectId)
 * @returns {Promise<Object|null>} - Note document or null if not found
 */
async function getNoteById(id) {
  if (!id) throw new Error('Note ID must be provided');
  const note = await Note.findById(id);
  return note;
}

/**
 * PUBLIC_INTERFACE
 * Retrieve multiple notes, with optional tag/category filters.
 * Passing { tags: ['tag1'], categories: ['cat1'] } will filter notes that include those tags/categories.
 * @param {Object} filters - Optional filters: { tags: [string], categories: [string] }
 * @returns {Promise<Array>} - Array of note documents
 */
async function getNotes(filters = {}) {
  const query = {};
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
    query.categories = { $in: filters.categories };
  }
  return await Note.find(query).sort({ updatedAt: -1 });
}

/**
 * PUBLIC_INTERFACE
 * Update a note by its ID.
 * Only fields provided in updateData will be updated.
 * @param {string} id - Note ID (MongoDB ObjectId)
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object|null>} - Updated note document or null if not found
 */
async function updateNote(id, updateData) {
  if (!id) throw new Error('Note ID must be provided');
  if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
    throw new Error('Update data must be provided as a non-empty object');
  }
  // Only allow update of permitted fields
  const updatableFields = ['title', 'content', 'tags', 'categories'];
  const update = {};
  for (const key of updatableFields) {
    if (updateData[key] !== undefined) {
      update[key] = updateData[key];
    }
  }
  if (Object.keys(update).length === 0) {
    throw new Error('No updateable fields found in update data');
  }
  const note = await Note.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  return note;
}

/**
 * PUBLIC_INTERFACE
 * Delete a note by its ID.
 * @param {string} id - Note ID (MongoDB ObjectId)
 * @returns {Promise<Object|null>} - Deleted note document or null if not found
 */
async function deleteNote(id) {
  if (!id) throw new Error('Note ID must be provided');
  const note = await Note.findByIdAndDelete(id);
  return note;
}

module.exports = {
  createNote,
  getNoteById,
  getNotes,
  updateNote,
  deleteNote,
};
