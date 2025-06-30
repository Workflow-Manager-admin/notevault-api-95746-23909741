'use strict';

/**
 * Note Mongoose Model Definition
 *
 * Fields:
 * - title (required, string)
 * - content (required, string)
 * - tags (optional, [string])
 * - categories (optional, [string])
 * - createdAt, updatedAt (timestamps)
 */

const mongoose = require('mongoose');

/**
 * NoteSchema describes a personal note with tags/categories and timestamps.
 */
const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// PUBLIC_INTERFACE
/**
 * The Note model for reading/writing notes in MongoDB.
 */
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

module.exports = Note;
