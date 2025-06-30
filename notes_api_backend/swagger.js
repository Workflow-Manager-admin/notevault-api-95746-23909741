const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NoteVault Notes API',
      version: '1.0.0',
      description: 'A simple RESTful API for creating, reading, updating, and deleting notes. Each note has a title, content, and optional tags or categories. Includes full CRUD support, query filtering, and integrated OpenAPI documentation.',
      contact: {
        name: 'NoteVault API Maintainers',
        email: 'support@notevault.dev'
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server'
      }
    ],
    tags: [
      { name: 'Notes', description: 'Notes management (CRUD & search)' },
      { name: 'Health', description: 'Service health check' }
    ],
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            _id: {
              type: 'string',
              description: 'Note\'s MongoDB ObjectId',
              example: '65ecb432257b5b5b16d9e6a7'
            },
            title: {
              type: 'string',
              description: 'Note title',
              maxLength: 120,
              example: 'Grocery List'
            },
            content: {
              type: 'string',
              description: 'Note content',
              maxLength: 5000,
              example: '- Milk\n- Bread\n- Eggs'
            },
            tags: {
              type: 'array',
              description: 'Tags to organize or filter notes',
              items: { type: 'string', maxLength: 32, example: 'shopping' },
              example: ['shopping', 'groceries']
            },
            categories: {
              type: 'array',
              description: 'Categories for grouping notes',
              items: { type: 'string', maxLength: 32, example: 'personal' },
              example: ['personal']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the note was created',
              example: '2024-04-01T13:30:41Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the note was last updated',
              example: '2024-04-02T10:11:12Z'
            }
          }
        },
        NoteCreateRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', description: 'Note title', example: 'My note' },
            content: { type: 'string', description: 'Note body', example: 'Note content here...' },
            tags: { type: 'array', items: { type: 'string' }, example: ['tag1', 'tag2'] },
            categories: { type: 'array', items: { type: 'string' }, example: ['work'] }
          }
        },
        NoteUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'New note title', example: 'Updated title' },
            content: { type: 'string', description: 'Updated content', example: 'Updated content...' },
            tags: { type: 'array', items: { type: 'string' }, example: ['urgent', '2024'] },
            categories: { type: 'array', items: { type: 'string' }, example: ['work'] }
          }
        },
        NoteDeleteResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Note deleted' },
            note: { $ref: '#/components/schemas/Note' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation error' }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Note not found' }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input or missing required fields',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Title is required and must be a non-empty string.' }
            }
          }
        },
        InvalidId: {
          description: 'Invalid note ID format',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Invalid note ID.' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
