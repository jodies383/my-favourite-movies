const Api = require('./api');
const Auth = require('./auth');

module.exports = function (app, db) {
  const api = Api(db);
  const auth = Auth(db);

  //User Routes
  app.get('/api/test', api.test);
  app.get('/api/user/:username', auth.verifyToken, api.getUser);

  app.post('/api/register', auth.registerUser);
  app.post('/api/login', auth.loginUser);
 
  app.get('/api/playlists/:id', auth.verifyToken, api.getUserPlaylists);
  app.get('/api/in_playlist', auth.verifyToken, api.checkMoviesInPlaylist);
  app.get('/api/playlist_titles/:id/:playlist_name', auth.verifyToken, api.getMoviesInPlaylist);
  app.get('/api/all_playlist_titles/:id', auth.verifyToken, api.getAllMovies);
  
  app.post('/api/new_playlist/:id', auth.verifyToken, api.createPlaylist);
  app.post('/api/playlist_titles/:id/:playlist_name/:movieId', auth.verifyToken, api.addToPlaylist);

  app.delete('/api/playlist_titles', auth.verifyToken, api.deleteFromPlaylist);
  app.delete('/api/playlist', auth.verifyToken, api.deletePlaylist);
};