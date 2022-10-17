const Api = require('./api');
const Auth = require('./auth');

module.exports = function (app, db) {
  const api = Api(db);
  const auth = Auth(db);

  //User Routes
  app.get('/api/test', api.test);
  app.get('/api/user/:username', api.getUser);

  app.post('/api/register', auth.registerUser);
  app.post('/api/login', auth.loginUser);
 
  app.get('/api/playlists/:username', api.getUserPlaylists);
  app.get('/api/in_playlist', api.checkMoviesInPlaylist);
  app.get('/api/playlist_titles/:username/:playlist_name', api.getMoviesInPlaylist);
  app.get('/api/all_playlist_titles/:username', api.getAllMovies);
  
  app.post('/api/new_playlist/:username', api.createPlaylist);
  app.post('/api/playlist_titles/:username/:playlist_name', api.addToPlaylist);

  app.delete('/api/playlist_titles', api.deleteFromPlaylist);
  app.delete('/api/playlist', api.deletePlaylist);
};