CS498 Final Project

Clearity - Backend

Endpoints needed:

/login post? passport?
{
	‘email’:
	‘password’:
}
/signup post? passport?
{
	‘email’:
	‘password’:
	‘is_instructor’:
}

/home get

(instructor only):
/create-class post

(student only):
/add-class post
/join-class/:id  socket?
/history/ get-collection
/history/:id get specific class history
/history/:id/:num get specific lecture from class

