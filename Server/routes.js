const Api = require('./api');
const Auth = require('./auth');

module.exports = function (app, db) {
  const users = Api(db);
  const auth = Auth(db);

  //User Routes
  app.post('/api/register', auth.registerUser);
  app.post('/api/login', auth.loginUser);
 
  app.get('/api/playlists/:username', users.getUserPlaylists);
  app.get('/api/in_playlist', users.checkMoviesInPlaylist);
  app.get('/api/playlist_titles/:username/:playlist_name', users.getMoviesInPlaylist);
  app.get('/api/all_playlist_titles/:username', users.getAllMovies);
  
  app.post('/api/new_playlist/:username', users.createPlaylist);
  app.post('/api/playlist_titles/:username/:playlist_name', users.addToPlaylist);

  app.delete('/api/playlist_titles', users.deleteFromPlaylist);
  app.delete('/api/playlist', users.deletePlaylist);
};