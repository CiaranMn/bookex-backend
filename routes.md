# Server routing

## USERS

### POST /users
- expects a JSON object, requiring `username` and `password` keys, and optionally `location` (string), `currently_reading` (object), and three arrays of objects: `favourite_books`, `wishlist`, and `books_read`.
- if user creation is successful, returns a JSON object with a `user` key, the value of which is the user profile. There is an `Authorization` key in the header with a JWT token as its value. Will return an object with errmsg key if validation fails, e.g. due to username already taken.
- returns a 400 status if there are any errors. 


### GET /users/profile
- expects a header with key `Authorization` and value equal to a valid JWT token.
- returns the user profile inside a `user` key as JSON if the token is validated.
- returns a 401 status if the token is not verified as having originated from the server, is no longer present on the server, or relates to a user that cannot be found.

### PATCH /users/profile
- expects a JSON object with one or more valid user fields (except `username` and `password` which currently cannot be changed), along with an `Authorization` key in the header with a JWT token.
- will update the user record if the token is valid. Only specified fields will be changed - any not included in the request will be untouched.
- returns a 400 status if there are any errors.

### POST /users/login
- expects a JSON object and requires a `username` and `password` field.
- returns the user object with an `Authorization` key in the header with a JWT token.
- returns a 400 status if the user is not found or if the password is incorrect.

### POST /users/logout
- expects a header with key `Authorization` and value equal to a valid JWT token.
- will delete the token from the user record on the server, so that even if someone has it, it cannot be used for authentification (tokens are matched against user records as well as being checked for a valid signature)


## BOOKS

### GET /books
- expects a `q` parameter with a search term, and an optional `start` parameter to specify which record to start at.
- will return the first 40 results matching the search term, offsetting by the start value if given.
- will return a 400 status if there are any errors.

### GET /books/popular
- returns an array of objects representing all books which are recorded under the 'currently_reading' field for all users (currently unsorted and uncounted)

### GET /books/suggestions
- returns an array of objects representing a random 100 sample of books in the database (i.e. books which have ever been persisted due to users choosing them as favourites, wishlist, available for loan, or currently reading).

## LOANS

### GET /loans
- returns an array of loans, each representing a user offering a specific book for loan, with the user information populated under a 'user' key and the book information populated under a 'book' key.

### GET /loans/:id
- the params.id represents a BOOK - this route returns all loans associated with a particualr book.

### POST /loans
- expects a JSON object with a valid user ObjectId under a 'user' key, and a book object under the 'book' key (which will be found in the database or created if necessary, and reduced to an ObjectID).

### DELETE /loans/:id
- the params.id represents a LOAN - this record will be deleted.