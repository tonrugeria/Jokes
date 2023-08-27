import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/register', "AuthController.registerForm")
  Route.post('/register', "AuthController.register")
  Route.get('/login', "AuthController.loginForm")
  Route.post('/login', "AuthController.login")
}).middleware('guest')

Route.get('/logout', "AuthController.logout")

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('jokes/index')
  })
  Route.resource('jokes', 'JokesController')
  Route.patch('jokes/:id/interactions', 'JokesController.interactions')

  Route.get('/posts', 'UsersController.getPosts')
  Route.get('/profile', 'UsersController.showProfile')
  Route.patch('/profile', 'UsersController.updateProfile')
  Route.get('/change-password', "UsersController.showChangePassword")
  Route.patch('/change-password', "UsersController.changePassword")

  Route.get('*', 'NotFoundController.index').as('notFound');
}).middleware('auth')
