module.exports = function (app, db) {
    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.get('/api/test', function (req, res) {
        res.json({
            name: 'joe'
        });
    });

    //returns a users info, playlists & playlist names - separate user info
    /// api/playlists/:username
   const getUserPlaylists = async function (req, res) {
        try {
            const {username} = req.params


            const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
            const user = await db.oneOrNone(`select * from users where username = $1`, [username])
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where user_id = $1`, [id]);

            const playlistNames = await db.many(`select * from playlists where user_id = $1`, [id])

            res.json({
                user,
                playlist,
                playlistNames
            })


        } catch (err) {
            console.log(err);
        }

    };

    //checks if a movie is in a users playlist
    // /api/in_playlist
    const checkMoviesInPlaylist = async function (req, res) {
        try {
            const { user_id } = req.query
            const { movie_id } = req.query

            const movieInfo = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where user_id = $1 AND movie_id = $2`, [user_id, movie_id])

            res.json({ movieInfo })

        } catch (err) {
            console.log(err)
        }
    };

    //returns movies in a given playlist for a given user
    // /api/playlist_titles/:username/:playlist_name
    const getMoviesInPlaylist = async function (req, res) {
        try {
            const { username } = req.params
            const { playlist_name } = req.params

            const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
            const userInfo = await db.manyOrNone(`select * from users where username = $1`, [username])
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where playlists.playlist_name = $1  AND user_id = $2`, [playlist_name, id]);
            res.json({
                user: userInfo,
                playlist
            })


        } catch (err) {
            console.log(err);
        }

    };
    //returns a given movie in a given playlist
    // app.get('/api/in_playlist_titles', verifyToken, async function (req, res) {
    //     try {
    //         let inPlaylist = false
    //         const { username } = req.query
    //         const { playlist_name } = req.query
    //         const { movie_id } = req.query

    //         const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
    //         const userInfo = await db.manyOrNone(`select * from users where username = $1`, [username])
    //         const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where playlists.playlist_name = $1  AND user_id = $2 AND movie_id = $3`, [playlist_name, id, movie_id]);
    //         if (playlist > 0) {
    //             inPlaylist = true
    //         }
    //         res.json({
    //             user: userInfo,
    //             inPlaylist
    //         })


    //     } catch (err) {
    //         console.log(err);
    //     }

    // });
    
    //returns all movies for a given user
    // /api/all_playlist_titles/:username
    const getAllMovies = async function (req, res) {
        try {
            const { username } = req.params

            const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
            const userInfo = await db.manyOrNone(`select * from users where username = $1`, [username])
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where user_id = $1`, [id]);
            res.json({
                user: userInfo,
                playlist
            })


        } catch (err) {
            console.log(err);
        }

    };


    //creates a new playlist
    // /api/new_playlist/:username
    const createPlaylist = async function (req, res) {
        try {
            const username = req.params.username
            const { playlist_name } = req.body


            const { id } = await db.oneOrNone(`SELECT id from users WHERE username = $1`, [username]);

            let checkUser = await db.manyOrNone(`SELECT * from playlists WHERE user_id = $1 and playlist_name = $2`, [id, playlist_name]);
            if (checkUser.length < 1) {
                await db.none(`insert into playlists (user_id, playlist_name) values ($1, $2)`, [id, playlist_name])

                res.json({
                    message: 'success'
                });
            } else {
                res.json({
                    message: 'duplicate'
                });
            }
        } catch (err) {
            console.log(err);
        }

    };

    //inserts a movie into a given playlist
    // /api/playlist_titles/:username/:playlist_name
    const addToPlaylist = async function (req, res) {
        try {
            const { username } = req.params
            const { playlist_name } = req.params
            const { movieId } = req.body


            const { id } = await db.oneOrNone(`SELECT id from users WHERE username = $1`, [username]);
            let playlist = await db.one(`select id from playlists where playlist_name = $1 and user_id = $2`, [playlist_name, id])
            const playlistId = playlist.id
            let checkPlaylists = await db.manyOrNone(`SELECT * from playlist_titles WHERE playlist_id = $1 and movie_id = $2`, [playlistId, id]);
            if (checkPlaylists.length < 1) {
                await db.none(`insert into playlist_titles (playlist_id, movie_id) values ($1, $2)`, [playlistId, movieId])

                res.json({
                    message: 'success'
                });
            } else {
                res.json({
                    message: 'duplicate'
                });
            }
        } catch (err) {
            console.log(err);
        }

    };

    //deletes a movie from a given playlist
    // /api/playlist_titles
    const deleteFromPlaylist = async function (req, res) {

        const { username, movie_id, playlist_name } = req.query

        try {
            const { id } = await db.one(`select id from users where username = $1`, [username])

            let playlist = await db.one(`select id from playlists where playlist_name = $1 and user_id = $2`, [playlist_name, id])
            const playlistId = playlist.id

            await db.none(`delete from playlist_titles where movie_id = $1 and playlist_id = $2`, [movie_id, playlistId]);
            res.status(200).send('deleted');
        } catch (err) {
            res.status(400).send(err.message);
        }


    };

    //deletes a given playlist
    // /api/playlist
    const deletePlaylist = async function (req, res) {
        try {

            const { username } = req.query
            const { playlist_name } = req.query

            try {
                const { id } = await db.one(`select id from users where username = $1`, [username])
                await db.none(`delete from playlists WHERE user_id = $1 and playlist_name = $2`, [id, playlist_name]);
                res.json({
                    status: 'success'
                })
            } catch (err) {
                res.json({
                    status: 'success',
                    error: err.stack
                })
            }
        } catch (err) {
            console.log(err);
        }

    };

    return {
        getUserPlaylists,
        checkMoviesInPlaylist,
        getMoviesInPlaylist,
        getAllMovies,
        createPlaylist,
        addToPlaylist,
        deleteFromPlaylist,
        deletePlaylist
      };
}