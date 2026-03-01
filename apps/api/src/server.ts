import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sql } from '@vercel/postgres';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://j-read.vercel.app',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// API Routes
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'J Read API',
    version: '1.0.0',
    endpoints: [
      '/api/v1/auth',
      '/api/v1/stories',
      '/api/v1/users',
      '/api/v1/search'
    ]
  });
});

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create user (simplified - add password hashing in production)
    const result = await sql`
      INSERT INTO users (email, username, display_name, password_hash, role)
      VALUES (${email}, ${username}, ${username}, ${password}, 'reader')
      RETURNING id, email, username, display_name, role
    `;
    
    res.status(201).json({
      user: result.rows[0],
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await sql`
      SELECT id, email, username, display_name, role
      FROM users WHERE email = ${email} AND password_hash = ${password}
    `;
    
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT (simplified - use proper JWT library)
    const token = Buffer.from(JSON.stringify(result.rows[0])).toString('base64');
    
    res.json({
      user: result.rows[0],
      accessToken: token,
      refreshToken: token,
      expiresIn: '7d'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stories routes
app.get('/api/v1/stories', async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, status, sortBy = 'updated' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let orderBy = 's.last_updated_at DESC';
    if (sortBy === 'popular') orderBy = 's.vote_count DESC';
    if (sortBy === 'newest') orderBy = 's.published_at DESC';
    if (sortBy === 'reads') orderBy = 's.read_count DESC';
    
    const result = await sql`
      SELECT s.id, s.title, s.slug, s.description, s.cover_image_url, s.status,
             s.word_count, s.chapter_count, s.read_count, s.vote_count, s.comment_count,
             s.last_updated_at, s.published_at,
             u.username as author_username, u.display_name as author_display_name,
             g.name as genre_name, g.slug as genre_slug
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN genres g ON s.genre_id = g.id
      WHERE s.deleted_at IS NULL AND s.visibility = 'public'
      ORDER BY ${sql.unsafe(orderBy)}
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;
    
    const countResult = await sql`SELECT COUNT(*) FROM stories WHERE deleted_at IS NULL AND visibility = 'public'`;
    
    res.json({
      stories: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        coverImageUrl: row.cover_image_url,
        status: row.status,
        wordCount: row.word_count,
        chapterCount: row.chapter_count,
        readCount: row.read_count,
        voteCount: row.vote_count,
        commentCount: row.comment_count,
        lastUpdatedAt: row.last_updated_at,
        publishedAt: row.published_at,
        author: {
          username: row.author_username,
          displayName: row.author_display_name
        },
        genre: row.genre_name ? { name: row.genre_name, slug: row.genre_slug } : null
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/stories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await sql`
      SELECT s.*, 
             u.username as author_username, u.display_name as author_display_name,
             g.name as genre_name, g.slug as genre_slug
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN genres g ON s.genre_id = g.id
      WHERE s.slug = ${slug} AND s.deleted_at IS NULL
    `;
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    const story = result.rows[0];
    
    // Get chapters
    const chaptersResult = await sql`
      SELECT id, chapter_number, title, slug, word_count, read_count, vote_count,
             status, is_premium, published_at
      FROM chapters
      WHERE story_id = ${story.id} AND deleted_at IS NULL AND status = 'published'
      ORDER BY chapter_number ASC
    `;
    
    res.json({
      id: story.id,
      title: story.title,
      slug: story.slug,
      description: story.description,
      coverImageUrl: story.cover_image_url,
      status: story.status,
      wordCount: story.word_count,
      chapterCount: story.chapter_count,
      readCount: story.read_count,
      voteCount: story.vote_count,
      commentCount: story.comment_count,
      author: {
        username: story.author_username,
        displayName: story.author_display_name
      },
      genre: story.genre_name ? { name: story.genre_name, slug: story.genre_slug } : null,
      chapters: chaptersResult.rows.map(c => ({
        id: c.id,
        chapterNumber: c.chapter_number,
        title: c.title,
        slug: c.slug,
        wordCount: c.word_count,
        readCount: c.read_count,
        voteCount: c.vote_count,
        isPremium: c.is_premium,
        publishedAt: c.published_at
      }))
    });
  } catch (error) {
    console.error('Story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search routes
app.get('/api/v1/search', async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }
    
    const searchQuery = `%${q}%`;
    const offset = (Number(page) - 1) * Number(limit);
    
    // Search stories
    const storiesResult = await sql`
      SELECT s.id, s.title, s.slug, s.description, s.cover_image_url,
             s.word_count, s.chapter_count, s.read_count, s.vote_count,
             u.username as author_username, u.display_name as author_display_name,
             g.name as genre_name
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN genres g ON s.genre_id = g.id
      WHERE s.deleted_at IS NULL AND s.visibility = 'public'
        AND (s.title ILIKE ${searchQuery} OR s.description ILIKE ${searchQuery})
      ORDER BY s.vote_count DESC
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;
    
    res.json({
      stories: {
        items: storiesResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          coverImageUrl: row.cover_image_url,
          wordCount: row.word_count,
          chapterCount: row.chapter_count,
          readCount: row.read_count,
          voteCount: row.vote_count,
          author: {
            username: row.author_username,
            displayName: row.author_display_name
          },
          genre: row.genre_name
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount: storiesResult.rowCount || 0,
          totalPages: Math.ceil((storiesResult.rowCount || 0) / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Genres
app.get('/api/v1/search/genres', async (req, res) => {
  try {
    const result = await sql`
      SELECT id, name, slug, description, color, story_count
      FROM genres
      WHERE is_active = TRUE
      ORDER BY sort_order ASC
    `;
    
    res.json({ genres: result.rows });
  } catch (error) {
    console.error('Genres error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trending
app.get('/api/v1/search/trending', async (req, res) => {
  try {
    const result = await sql`
      SELECT s.id, s.title, s.slug, s.cover_image_url, s.vote_count, s.read_count,
             u.username as author_username, u.display_name as author_display_name
      FROM stories s
      JOIN users u ON s.author_id = u.id
      WHERE s.deleted_at IS NULL AND s.visibility = 'public'
        AND s.last_updated_at > NOW() - INTERVAL '7 days'
      ORDER BY (s.vote_count * 2 + s.read_count) DESC
      LIMIT 10
    `;
    
    res.json({ trending: result.rows });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
export default app;
