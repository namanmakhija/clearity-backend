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


HOW TO USE:

<PUT>
/add-class {course: <course id given by instructor>}
    returns: message

<GET>
/home
    returns: {course_title: [<list of course title], course_id: [<list of course id>]}
/logout 
    
 

/profile
    returns: Hello <User>
    
<POST>
/create-class {course: <course title}
    returns: {message:<unique id of the class>}
    
/register   {email:<String>, password:<String>, is_instructor:<boolean>}
/login      {email:<String>, password:<String>}
