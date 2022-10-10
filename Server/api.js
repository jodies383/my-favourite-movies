module.exports = function (app, db) {
    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.get('/api/test', function (req, res) {
        res.json({
            name: 'joe'
        });
    });

    function verifyToken(req, res, next) {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!req.headers.authorization || !token) {
            res.sendStatus(401);
            return;
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const { username } = decoded;
            //check if username matches logged in user
            if (username) {
                next();
            } else {
                res.status(403).json({
                    message: 'unauthorized'
                });
            }
        } catch (err) {
            if (err && 500) {
                res.json({
                    message: 'expired'
                })
            }

        }

    }

    app.post('/api/register', async function (req, res, next) {
        try {
            const { username, password, firstName, lastName } = req.body;

            let checkDuplicate = await db.manyOrNone(`SELECT * from users WHERE username = $1`, [username]);
            bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {

                    if (checkDuplicate.length < 1) {
                        await db.none(`insert into users (username, password, first_name, last_name) values ($1, $2, $3, $4)`, [username, hash, firstName, lastName])
                        res.json({
                            message: 'success'
                        });
                    } else {
                        res.json({
                            message: 'duplicate'
                        });
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }


    })
    app.post('/api/login', async function (req, res, next) {
        try {
            const { username } = req.body;
            const { password } = req.body;
            const token = jwt.sign({
                username
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4hr' });
            let checkUser = await db.manyOrNone(`SELECT id from users WHERE username = $1`, [username]);
            if (checkUser.length < 1) {
                res.json({
                    token,
                    message: 'unregistered'
                });
            } else {

                let checkPassword = await db.oneOrNone(`SELECT password from users WHERE username = $1`, [username]);

                const match = await bcrypt.compare(password, checkPassword.password);

                if (match) {
                    res.json({
                        token,
                        message: 'success'
                    });
                } else {
                    res.json({
                        token,
                        message: 'unmatched'
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }

    });


    app.get('/api/playlists/:username', verifyToken, async function (req, res, next) {
        try {
            const username = req.params.username


            const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
            const userInfo = await db.manyOrNone(`select * from users where username = $1`, [username])
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where user_id = $1`, [id]);
            const playlistNames = await db.many(`select * from playlists where user_id = $1`, [id])
            res.json({
                user: userInfo,
                playlist,
                playlistNames
            })


        } catch (err) {
            console.log(err);
        }

    });

    app.get('/api/in_playlist', verifyToken, async function (req, res) {
        try {
            const { user_id } = req.query
            const { movie_id } = req.query

            const movieInfo = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where user_id = $1 AND movie_id = $2`, [user_id, movie_id])

            res.json({ movieInfo })

        } catch (err) {
            console.log(err)
        }
    })

    app.get('/api/playlist_titles/:username/:playlist_name', verifyToken, async function (req, res, next) {
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

    });

    app.get('/api/in_playlist_titles', verifyToken, async function (req, res, next) {
        try {
            let inPlaylist = false
            const { username } = req.query
            const { playlist_name } = req.query
            const { movie_id } = req.query

            const { id } = await db.oneOrNone(`select id from users where username = $1`, [username])
            const userInfo = await db.manyOrNone(`select * from users where username = $1`, [username])
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles JOIN playlists on playlist_titles.playlist_id=playlists.id where playlists.playlist_name = $1  AND user_id = $2 AND movie_id = $3`, [playlist_name, id, movie_id]);
            if (playlist > 0) {
                inPlaylist = true
            }
            res.json({
                user: userInfo,
                inPlaylist
            })


        } catch (err) {
            console.log(err);
        }

    });

    app.get('/api/all_playlist_titles/:username', verifyToken, async function (req, res, next) {
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

    });



    app.post('/api/new_playlist/:username', verifyToken, async function (req, res, next) {
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

    });

    app.post('/api/playlist_titles/:username/:playlist_name', verifyToken, async function (req, res, next) {
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

    });

    app.delete('/api/playlist_titles', verifyToken, async function (req, res, next) {

        try {

            const { username } = req.query
            const { movie_id } = req.query
            const playlist_name = req.body


            try {
                const { id } = await db.one(`select id from users where username = $1`, [username])

                let playlist = await db.one(`select id from playlists where playlist_name = $1 and user_id = $2`, [playlist_name, id])
                const playlistId = playlist.id

                await db.none(`delete from playlist_titles 
                            INNERJOIN playlists on playlist_titles.playlist_id=playlists.id 
                            where movie_id = $1 and user_id = $2 
                            and playlist_id = $3`, [movie_id, id, playlistId]);
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

    });

    app.delete('/api/playlist', verifyToken, async function (req, res, next) {
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

    });


}