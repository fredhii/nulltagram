const openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Nulltagram API',
        description: 'Instagram-like social network API for sharing photos',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:5001',
            description: 'Local development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'Firebase ID Token',
                description: 'Firebase ID token obtained from Firebase Auth'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', description: 'Firebase UID' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    image: { type: 'string', format: 'uri' },
                    followers: { type: 'array', items: { type: 'string' } },
                    following: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            UserSummary: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    image: { type: 'string', format: 'uri' }
                }
            },
            Comment: {
                type: 'object',
                properties: {
                    text: { type: 'string' },
                    postedBy: { $ref: '#/components/schemas/UserSummary' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Post: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    body: { type: 'string' },
                    picture: { type: 'string', format: 'uri' },
                    postedBy: { $ref: '#/components/schemas/UserSummary' },
                    likes: { type: 'array', items: { type: 'string' } },
                    comments: { type: 'array', items: { $ref: '#/components/schemas/Comment' } },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        '/protected': {
            get: {
                tags: ['Auth'],
                summary: 'Check authentication',
                description: 'Validates if user is logged in',
                responses: {
                    200: { description: 'User is authenticated', content: { 'text/plain': { schema: { type: 'string' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/create-profile': {
            post: {
                tags: ['Auth'],
                summary: 'Create user profile',
                description: 'Creates user profile in Firestore after Firebase Auth signup',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string' },
                                    image: { type: 'string', format: 'uri' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Profile created successfully',
                        content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, user: { $ref: '#/components/schemas/User' } } } } }
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/get-profile': {
            get: {
                tags: ['Auth'],
                summary: 'Get current user profile',
                description: 'Returns the authenticated user profile data',
                responses: {
                    200: {
                        description: 'User profile',
                        content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } } } }
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/allposts': {
            get: {
                tags: ['Posts'],
                summary: 'Get all posts',
                description: 'Returns all posts ordered by creation date (newest first)',
                responses: {
                    200: {
                        description: 'List of posts',
                        content: { 'application/json': { schema: { type: 'object', properties: { posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } }
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/createpost': {
            post: {
                tags: ['Posts'],
                summary: 'Create a new post',
                description: 'Creates a new post with title, body, and image URL',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'body', 'url'],
                                properties: {
                                    title: { type: 'string' },
                                    body: { type: 'string' },
                                    url: { type: 'string', format: 'uri', description: 'Image URL' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Post created', content: { 'application/json': { schema: { type: 'object', properties: { post: { $ref: '#/components/schemas/Post' } } } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/mypost': {
            get: {
                tags: ['Posts'],
                summary: 'Get my posts',
                description: 'Returns all posts created by the authenticated user',
                responses: {
                    200: {
                        description: 'List of user posts',
                        content: { 'application/json': { schema: { type: 'object', properties: { mypost: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } }
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/givelike': {
            put: {
                tags: ['Posts'],
                summary: 'Like a post',
                description: 'Adds the authenticated user to the post likes',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['postId'], properties: { postId: { type: 'string' } } } } }
                },
                responses: {
                    200: { description: 'Updated post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to like', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/removelike': {
            put: {
                tags: ['Posts'],
                summary: 'Unlike a post',
                description: 'Removes the authenticated user from the post likes',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['postId'], properties: { postId: { type: 'string' } } } } }
                },
                responses: {
                    200: { description: 'Updated post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to unlike', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/insert-comment': {
            put: {
                tags: ['Posts'],
                summary: 'Add comment to post',
                description: 'Inserts a comment on a post',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['postId', 'text'], properties: { postId: { type: 'string' }, text: { type: 'string' } } } } }
                },
                responses: {
                    200: { description: 'Updated post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to comment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/delete-post/{postId}': {
            delete: {
                tags: ['Posts'],
                summary: 'Delete a post',
                description: 'Deletes a post (only by the owner)',
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Deleted post data', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    403: { description: 'Not authorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Post not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/user/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get user profile',
                description: 'Returns user data and their posts',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID (Firebase UID)' }],
                responses: {
                    200: {
                        description: 'User profile and posts',
                        content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' }, posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } }
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/follow': {
            put: {
                tags: ['Users'],
                summary: 'Follow a user',
                description: 'Adds the authenticated user as a follower of the target user',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['followerId'], properties: { followerId: { type: 'string', description: 'User ID to follow' } } } } }
                },
                responses: {
                    200: { description: 'Updated user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to follow', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/unfollow': {
            put: {
                tags: ['Users'],
                summary: 'Unfollow a user',
                description: 'Removes the authenticated user from the target user followers',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['followerId'], properties: { followerId: { type: 'string', description: 'User ID to unfollow' } } } } }
                },
                responses: {
                    200: { description: 'Updated user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to unfollow', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/update-profile-image': {
            put: {
                tags: ['Users'],
                summary: 'Update profile image',
                description: 'Updates the authenticated user profile image',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['image'], properties: { image: { type: 'string', format: 'uri' } } } } }
                },
                responses: {
                    200: { description: 'Updated user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    422: { description: 'Failed to update', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        }
    },
    tags: [
        { name: 'Auth', description: 'Authentication and profile management' },
        { name: 'Posts', description: 'Post CRUD operations' },
        { name: 'Users', description: 'User profile and social features' }
    ]
}

module.exports = openApiSpec
