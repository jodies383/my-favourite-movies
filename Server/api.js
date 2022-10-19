module.exports = function (db) {
   
    const test = (req, res) => {
        res.json({ name: 'Joe' })
    }

    const getUser = async function (req, res) {
        try {
            const { username } = req.params
            const user = await db.one(`SELECT * from users WHERE username = $1`, [username])
            res.json({ user })
        } catch (err) {
            console.log(err);
        }
    }

    const getUserPlaylists = async function (req, res) {
        try {
            const { id } = req.params

            const playlist = await db.manyOrNone(`SELECT * from playlist_titles 
            JOIN playlists on playlist_titles.playlist_id=playlists.id 
            WHERE user_id = $1`, [id]);

            const playlistNames = await db.many(`SELECT * from playlists WHERE user_id = $1`, [id])

            res.json({
                playlist,
                playlistNames
            })
        } catch (err) {
            res.status(400).send(err.message);
        }

    };


    const checkMoviesInPlaylist = async function (req, res) {
        try {
            const { id, movie_id } = req.query

            const movieInfo = await db.manyOrNone(`SELECT * from playlist_titles 
            JOIN playlists on playlist_titles.playlist_id=playlists.id 
            WHERE user_id = $1 
            AND movie_id = $2`, [id, movie_id])
            res.json({ movieInfo })
        } catch (err) {
            res.status(400).send(err.message);
        }
    };


    const getMoviesInPlaylist = async function (req, res) {
        try {
            const { playlist_name, id } = req.params

            const playlist = await db.manyOrNone(`SELECT * from playlist_titles 
            JOIN playlists on playlist_titles.playlist_id=playlists.id 
            WHERE playlists.playlist_name = $1 
            AND user_id = $2`, [playlist_name, id]);
            res.json({playlist})
        } catch (err) {
            res.status(400).send(err.message);
        }

    };

    const getAllMovies = async function (req, res) {
        try {
            const { id } = req.params
            const playlist = await db.manyOrNone(`SELECT * from playlist_titles 
            JOIN playlists on playlist_titles.playlist_id=playlists.id 
            WHERE user_id = $1`, [id]);
            res.json({playlist})
        } catch (err) {
            res.status(400).send(err.message);
        }

    };


    const createPlaylist = async function (req, res) {
        try {
            const { id } = req.params
            const { playlist_name } = req.body

            let checkUser = await db.manyOrNone(`SELECT * from playlists 
            WHERE user_id = $1 
            AND playlist_name = $2`, [id, playlist_name]);
            if (checkUser.length < 1) {
                await db.none(`INSERT into playlists (user_id, playlist_name) values ($1, $2)`, [id, playlist_name])
                res.status(200).send('success');
            }
        } catch (err) {
            res.status(400).send(err.message);
        }

    };

    const addToPlaylist = async function (req, res) {
        try {
            const { id, playlist_name, movieId } = req.params

            
            let playlist = await db.one(`SELECT id from playlists 
            WHERE playlist_name = $1 
            AND user_id = $2`, [playlist_name, id])

            const playlistId = playlist.id
            let checkPlaylists = await db.manyOrNone(`SELECT * from playlist_titles 
            WHERE playlist_id = $1 
            AND movie_id = $2`, [playlistId, id]);
            if (checkPlaylists.length < 1) {
                await db.none(`INSERT into playlist_titles (playlist_id, movie_id) values ($1, $2)`, [playlistId, movieId])
                res.status(200).send('success');
            }
        } catch (err) {
            res.status(400).send(err.message);
        }

    };

    const deleteFromPlaylist = async function (req, res) {

        const { id, movie_id, playlist_name } = req.query
        try {
            let playlist = await db.one(`SELECT id from playlists 
            WHERE playlist_name = $1 
            AND user_id = $2`, [playlist_name, id])
            const playlistId = playlist.id

            await db.none(`DELETE from playlist_titles 
            WHERE movie_id = $1 
            AND playlist_id = $2`, [movie_id, playlistId]);
            res.status(200).send('deleted');
        } catch (err) {
            res.status(400).send(err.message);
        }
    };

    const deletePlaylist = async function (req, res) {
        try {

            const { id, playlist_name } = req.query

            try {
                await db.none(`DELETE from playlists 
                WHERE user_id = $1 
                AND playlist_name = $2`, [id, playlist_name]);
                res.status(200).send('success');
            } catch (err) {
                res.status(400).send(err.message);
            }
        } catch (err) {
            console.log(err);
        }

    };

    return {
        test,
        getUser,
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