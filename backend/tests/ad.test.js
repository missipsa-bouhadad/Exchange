// backend/tests/ad.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; // Importe ton app.js (sans le listen)

// Connexion à une base de données de test avant de commencer
beforeAll(async () => {
    const url = process.env.MONGO_URI_TEST;
    await mongoose.connect(url);
});

// Nettoyage après les tests
afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('API Annonces (Ads)', () => {

    it('GET /api/v1/ad/ads devrait retourner une liste (200 OK)', async () => {
        const res = await request(app).get('/api/v1/ad/ads');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.ads)).toBe(true);
    });

    it('POST /api/v1/ad/create ne devrait pas fonctionner sans être connecté', async () => {
        const res = await request(app)
            .post('/api/v1/ad/create')
            .send({
                title: "Test Jest",
                description: "Description test",
                type: "GOOD",
                city: "Paris"
            });

        expect(res.statusCode).toEqual(401);
    });

});