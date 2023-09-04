import Route from '@ioc:Adonis/Core/Route'




Route.group(() => {
  Route.get('/register', "AuthController.registerForm")
  Route.post('/register', "AuthController.register")
  Route.get('/login', "AuthController.loginForm")
  Route.post('/login', "AuthController.login")
}).middleware('guest')

Route.group(() => {
  Route.get('/logout', "AuthController.logout")
  Route.get('/', async ({ response }) => {
    return response.redirect().toPath('/jokes')
  })
  Route.resource('jokes', 'JokesController')
  Route.patch('jokes/:id/editRating', 'JokesController.editRating')
  Route.post('jokes/:id/postComment', 'JokesController.postComment')

  Route.get('/posts', 'UsersController.getPosts')
  Route.get('/profile', 'UsersController.showProfile')
  Route.patch('/profile', 'UsersController.updateProfile')
  Route.get('/change-password', "UsersController.showChangePassword")
  Route.patch('/change-password', "UsersController.changePassword")

  Route.get('*', ( { response } ) => {
    return response.redirect().back()
  })
}).middleware('auth')
