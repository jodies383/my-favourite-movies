const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

const API = require('../routes');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL;
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);

API(app, db);

describe('The Movie API', function () {

    before(async function () {
        this.timeout(5000);
        // await db.none(`delete from users`);
        // await db.none(`delete from playlists`);
        // await db.none(`delete from playlist_titles`);

    });
    let token


    it('should have a test method', async () => {

        const response = await supertest(app)
            .get('/api/test')
            .expect(200);

        assert.deepStrictEqual({ name: 'joe' }, response.body);

    });

    it('should be able to register a new user', async () => {
        const response = await supertest(app)
            .post('/api/register')
            .send({
                username: 'JoeSmith01',
                password: '123',
                firstName: 'Joe',
                lastName: 'Smith'
            });


        const user = await db.one(`select username from users where username = 'JoeSmith01'`);
        assert.equal('JoeSmith01', user.username);

    })

    it('shouldnt be able to register the same user', async () => {
        const response = await supertest(app)
            .post('/api/register')
            .send({
                username: 'JoeSmith01',
                password: '123',
                firstName: 'Joe',
                lastName: 'Smith'
            });


        const { username } = await db.one(`select username from users`);
        assert.equal(10, username.length);

    })

    it('should be able to log in', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'JoeSmith01',
                password: '123'
            });
        token = response.body.token
        const { message } = response.body;
        assert.equal('success', message);
    });

    it('should not log in when username and password do not match', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'JoeSmith01',
                password: '7826187217'
            });

        const { message } = response.body;
        assert.equal('unmatched', message);
    });

    it('should not log in an unregistered user', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'AmyAllen',
                password: '7826187217'
            });

        const { message } = response.body;
        assert.equal('unregistered', message);
    });

    it('should be able to create a new playlist for a user', async () => {

        const response = await supertest(app)
            .post('/api/new_playlist/JoeSmith01')
            .set({ "Authorization": `Bearer ${token}` })
            .send({ playlist_name: 'Action' })
            .expect(200);


        const { message } = response.body;
        assert.equal('success', message);

    });

    it('should be able to add a movie to a specific playlist', async () => {

        const response = await supertest(app)
            .post('/api/playlist_titles/JoeSmith01/Action')
            .set({ "Authorization": `Bearer ${token}` })
            .send({ movieId: '4765' })
            .expect(200);


        const { message } = response.body;
        assert.equal('success', message);

    });

    it('should be able to view playlists for a user', async () => {

        const response = await supertest(app)
            .get('/api/playlists/JoeSmith01')
            .set({ "Authorization": `Bearer ${token}` })
            .expect(200);


        const { playlist } = response.body;
        assert.equal(1, playlist.length);

    });

    it('should be able to view movies for a specific playlist', async () => {

        const response = await supertest(app)
            .get('/api/playlist_titles/JoeSmith01/Action')
            .set({ "Authorization": `Bearer ${token}` })
            .expect(200);


        const { playlist } = response.body;
        assert.equal(1, playlist.length);

    });

    it('should be able to find all the favourite movies for a user', async () => {


        const response = await supertest(app)
            .get('/api/all_playlist_titles/JoeSmith01')
            .set({ "Authorization": `Bearer ${token}` })
            .expect(200);
        const playlist = response.body.playlist
        assert.equal(1, playlist.length);
    });


    it('you should be able to remove a movie from a specific playlist', async () => {

        const response = await supertest(app)
            .delete(`/api/playlist_titles?username=JoeSmith01&movie_id=4765`)
            .set({ "Authorization": `Bearer ${token}` })
            .send({ playlist_name: 'Action' })
            .expect(200);


        assert.equal('success', response.body.status);
    });

    it('you should be able to delete a playlist', async () => {

        const response = await supertest(app)
            .delete(`/api/playlist?username=JoeSmith01&playlist_name=Action`)
            .set({ "Authorization": `Bearer ${token}` })
            .expect(200);


        assert.equal('success', response.body.status);
    });

    after(() => {
        db.$pool.end();
    });
});