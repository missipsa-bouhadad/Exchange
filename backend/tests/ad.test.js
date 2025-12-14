// backend/tests/ad.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import { User } from '../models/user.model.js';
import { Ad } from '../models/ad.model.js';

// --- CONFIGURATION ---

const createTestUser = async (name = "TestUser") => {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await User.create({
        firstName: "Test",
        lastName: name,
        email: `${name.toLowerCase()}@test.com`,
        password: passwordHash,
        city: "Paris"
    });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY || "secret_test", { expiresIn: '1d' });
    return { user, token };
};

beforeAll(async () => {
    const url = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test_db_ads";
    await mongoose.connect(url);
}, 20000);

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

afterEach(async () => {
    await Ad.deleteMany({});
    await User.deleteMany({});
});

// --- TESTS ---

describe('API Annonces (Ads)', () => {

    // 1. TEST DE LECTURE (GET)
    describe('GET /api/v1/ad/ads', () => {
        it('devrait retourner une liste vide au début', async () => {
            const res = await request(app).get('/api/v1/ad/ads');
            expect(res.statusCode).toEqual(200);
            expect(res.body.ads).toEqual([]);
        });
    });

    // 2. TEST DE CRÉATION (POST)
    describe('POST /api/v1/ad/create', () => {
        it('devrait créer une annonce si utilisateur connecté', async () => {
            const { token } = await createTestUser();

            const res = await request(app)
                .post('/api/v1/ad/create')
                .set('Cookie', [`token=${token}`]) // Simulation du cookie
                .send({
                    title: "Vélo VTT",
                    description: "Super vélo rouge",
                    type: "GOOD",
                    city: "Lyon",
                    availabilityStart: "2024-01-01",
                    availabilityEnd: "2024-02-01"
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.ad.title).toBe("Vélo VTT");
        });

        it('devrait refuser si les dates sont incohérentes', async () => {
            const { token } = await createTestUser();

            const res = await request(app)
                .post('/api/v1/ad/create')
                .set('Cookie', [`token=${token}`])
                .send({
                    title: "Test Date",
                    description: "Desc",
                    type: "SKILL",
                    city: "Paris",
                    availabilityStart: "2024-05-01",
                    availabilityEnd: "2024-01-01" // Fin AVANT début -> Erreur
                });

            expect(res.statusCode).toEqual(400);
        });

        it('devrait rejeter un utilisateur non connecté', async () => {
            const res = await request(app)
                .post('/api/v1/ad/create')
                .send({ title: "Hack" });

            expect(res.statusCode).toEqual(401);
        });
    });

    // 3. TEST DE MISE À JOUR (PUT)
    describe('PUT /api/v1/ad/update/:id', () => {
        it('devrait mettre à jour une annonce existante', async () => {
            const { user, token } = await createTestUser();

            const ad = await Ad.create({
                title: "Vieux Titre",
                description: "Vielle desc",
                type: "GOOD",
                city: "Paris",
                user: user._id,
                availabilityStart: new Date(),
                availabilityEnd: new Date()
            });

            const res = await request(app)
                .put(`/api/v1/ad/update/${ad._id}`)
                .set('Cookie', [`token=${token}`])
                .send({
                    title: "Nouveau Titre",
                    city: "Marseille"
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.ad.title).toBe("Nouveau Titre");
            expect(res.body.ad.city).toBe("Marseille");
        });

        it("ne devrait pas autoriser un autre utilisateur à modifier l'annonce", async () => {
            const owner = await createTestUser("Owner");
            const hacker = await createTestUser("Hacker");

            const ad = await Ad.create({
                title: "Touche pas",
                description: "...",
                type: "GOOD",
                city: "Nice",
                user: owner.user._id,
                availabilityStart: new Date(),
                availabilityEnd: new Date()
            });

            // UPDATE par un autre utilisateur
            const res = await request(app)
                .put(`/api/v1/ad/update/${ad._id}`)
                .set('Cookie', [`token=${hacker.token}`])
                .send({ title: "Hacked!" });

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain("pas autorisé");
        });
    });

    // 4. TEST DE SUPPRESSION (DELETE)
    describe('DELETE /api/v1/ad/remove/:id', () => {
        it('devrait supprimer une annonce', async () => {
            const { user, token } = await createTestUser();
            const ad = await Ad.create({
                title: "A supprimer",
                description: "...",
                type: "SKILL",
                city: "Lille",
                user: user._id,
                availabilityStart: new Date(),
                availabilityEnd: new Date()
            });

            adId = ad._id;

            const res = await request(app)
                .delete(`/api/v1/ad/delete/${adId.toString()}`)
                .set('Cookie', [`token=${token}`]);

            expect(res.statusCode).toEqual(200);

            const checkAd = await Ad.findById(ad._id);
            expect(checkAd).toBeNull();
        });
    });

    // 5. TEST GET BY ID
    describe('GET /api/v1/ad/:id', () => {
        it('devrait retourner une annonce par son ID', async () => {
            const { user } = await createTestUser();
            const ad = await Ad.create({
                title: "Cherche moi",
                description: "...",
                type: "GOOD",
                city: "Nantes",
                user: user._id,
                availabilityStart: new Date(),
                availabilityEnd: new Date()
            });

            const res = await request(app).get(`/api/v1/ad/${ad._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe("Cherche moi");

            if (res.body.user && typeof res.body.user === 'object') {
                expect(res.body.user._id).toBeDefined();
            }
        });

        it('devrait retourner 404 si ID inconnu', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/v1/ad/${fakeId}`);
            expect(res.statusCode).toEqual(404);
        });
    });

});