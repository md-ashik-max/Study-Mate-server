# Study Mate Server

live url : https://study-mate-server-plum.vercel.app

## Feature 

- Secure User Authentication with JWT: Implement a robust user authentication system using JSON Web Tokens (JWT). Users can securely log in to your application, and upon successful authentication, receive a JWT token. This token can then be used to authenticate subsequent API requests, ensuring that only authenticated users can access protected routes.

- Protected Routes and Authorization: Utilize JWT to create protected routes that require authentication. With JWT middleware, you can restrict access to certain endpoints based on user roles or permissions. This ensures that sensitive data and functionalities are only accessible to authorized users.

- Integration with MongoDB: MongoDB serves as the database backend for your application. Utilize Mongoose, a MongoDB object modeling tool, to interact with your MongoDB database. Define schemas for your data models, perform CRUD operations, and leverage MongoDB's flexible document-oriented structure to store and retrieve data efficiently.

- Cross-Origin Resource Sharing (CORS) Configuration: Configure CORS middleware to enable cross-origin requests to your server. This is particularly useful if your server needs to serve resources to client-side applications hosted on different domains. By specifying allowed origins, methods, and headers, you can control which client domains can access your server's resources securely.

- Environment Configuration with dotenv: Use dotenv to manage environment variables in your server-side application. This allows you to store sensitive information such as database credentials or JWT secret keys securely, without hardcoding them into your codebase. With dotenv, you can easily switch between different environments (e.g., development, staging, production) by loading environment-specific configurations from a .env file.

