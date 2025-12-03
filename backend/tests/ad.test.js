// backend/tests/ad.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; // Importe ton app.js (sans le listen)

// Connexion à une base de données de test avant de commencer
beforeAll(async () => {
    // Utilise une URL différente pour ne pas casser ta vraie BDD !
    const url = process.env.MONGO_URI_TEST || "mongodb+srv://usertest:usertest192837!@projet-gl.11pccgw.mongodb.net/?appName=projet-gl";
    await mongoose.connect(url);
});

// Nettoyage après les tests
afterAll(async () => {
    // On vide la base de test
    await mongoose.connection.db.dropDatabase();
    // On ferme la connexion
    await mongoose.connection.close();
});

describe('API Annonces (Ads)', () => {

    // TEST 1 : Récupérer les annonces (Public)
    it('GET /api/v1/ad/ads devrait retourner une liste (200 OK)', async () => {
        const res = await request(app).get('/api/v1/ad/ads');

        expect(res.statusCode).toEqual(200);
        // Vérifie que c'est bien un objet qui contient 'success: true' ou un tableau
        // Adapte selon ce que ton controller renvoie exactement
        // expect(res.body.success).toBe(true);
    });

    // TEST 2 : Sécurité sur la création (Sans token)
    it('POST /api/v1/ad/create ne devrait pas fonctionner sans être connecté', async () => {
        const res = await request(app)
            .post('/api/v1/ad/create')
            .send({
                title: "Test Jest",
                description: "Description test",
                type: "GOOD",
                city: "Paris"
            });

        // On s'attend à une erreur 401 (Unauthorized) car pas de cookie/token
        expect(res.statusCode).toEqual(401);
    });

});