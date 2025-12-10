// ============================================
// HASENE BACKEND - Express.js + MongoDB
// ============================================

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hasene';

MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log('✅ MongoDB bağlantısı başarılı');
        db = client.db();
    })
    .catch(err => {
        console.error('❌ MongoDB bağlantı hatası:', err);
    });

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

// Basit token kontrolü (production'da JWT kullan)
function authenticate(req, res, next) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = userId;
    next();
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User Stats
app.get('/api/user/stats', authenticate, async (req, res) => {
    try {
        const stats = await db.collection('user_stats').findOne({ userId: req.userId });
        res.json(stats || {
            totalPoints: 0,
            badges: { stars: 0, bronze: 0, silver: 0, gold: 0, diamond: 0 },
            streakData: { currentStreak: 0, bestStreak: 0, totalPlayDays: 0 },
            gameStats: { totalCorrect: 0, totalWrong: 0, gameModeCounts: {} },
            perfectLessonsCount: 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/stats', authenticate, async (req, res) => {
    try {
        await db.collection('user_stats').updateOne(
            { userId: req.userId },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Daily Tasks
app.get('/api/user/daily-tasks', authenticate, async (req, res) => {
    try {
        const tasks = await db.collection('daily_tasks').findOne({ userId: req.userId });
        res.json(tasks || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/daily-tasks', authenticate, async (req, res) => {
    try {
        await db.collection('daily_tasks').updateOne(
            { userId: req.userId },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Weekly Tasks
app.get('/api/user/weekly-tasks', authenticate, async (req, res) => {
    try {
        const tasks = await db.collection('weekly_tasks').findOne({ userId: req.userId });
        res.json(tasks || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/weekly-tasks', authenticate, async (req, res) => {
    try {
        await db.collection('weekly_tasks').updateOne(
            { userId: req.userId },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Word Stats
app.get('/api/user/word-stats', authenticate, async (req, res) => {
    try {
        const wordStats = await db.collection('word_stats')
            .find({ userId: req.userId })
            .toArray();
        
        const stats = {};
        wordStats.forEach(item => {
            stats[item.wordId] = item.stats;
        });
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/word-stats/:wordId', authenticate, async (req, res) => {
    try {
        await db.collection('word_stats').updateOne(
            { userId: req.userId, wordId: req.params.wordId },
            { 
                $set: { 
                    stats: req.body,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Favorites
app.get('/api/user/favorites', authenticate, async (req, res) => {
    try {
        const favorites = await db.collection('favorites')
            .find({ userId: req.userId })
            .toArray();
        res.json(favorites.map(f => f.wordId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/user/favorites/:wordId', authenticate, async (req, res) => {
    try {
        await db.collection('favorites').updateOne(
            { userId: req.userId, wordId: req.params.wordId },
            { $set: { createdAt: new Date() } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/user/favorites/:wordId', authenticate, async (req, res) => {
    try {
        await db.collection('favorites').deleteOne({
            userId: req.userId,
            wordId: req.params.wordId
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Daily Stats
app.get('/api/user/daily-stats/:date', authenticate, async (req, res) => {
    try {
        const stat = await db.collection('daily_stats').findOne({
            userId: req.userId,
            date: req.params.date
        });
        res.json(stat ? stat.stats : null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/daily-stats/:date', authenticate, async (req, res) => {
    try {
        await db.collection('daily_stats').updateOne(
            { userId: req.userId, date: req.params.date },
            { 
                $set: { 
                    stats: req.body,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const leaderboard = await db.collection('user_stats')
            .find({})
            .sort({ totalPoints: -1 })
            .limit(limit)
            .toArray();
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Hasene Backend API çalışıyor: http://localhost:${PORT}`);
});

