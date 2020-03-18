# Application Server
The application server runs as an Ubuntu server. The application sits behind a reverse proxy and is an Express server running in Node. 

<!-- ABOUT THE PROJECT -->
## Node and Express
The [Express server](https://www.npmjs.com/package/express) runs in [Nodejs](https://nodejs.org/en/) on the backend. The [Node Package Manager](https://www.npmjs.com/) (npm) is used to run the server and install different modules. In the frontend [Boostrap](https://getbootstrap.com/) with a bit of [Jquery](https://jquery.com/) was used

## Security
The application server has several security implementations, such as the reverse proxy, SSL/TLS, authentication, helmet, CSRF, environment variables etc. Most installed modules with implementations can be found in the [app.js](https://github.com/LasseUlvatne/IoT-Project-2DT301/blob/master/Application%20server/app.js) script.

### Reverse proxy
Reverse proxy runs as an NGINX server. [Read more..](https://www.nginx.com/)

### Let's encrypt
A SSL/TLS certificate was installed served by [Let's encrypt](https://letsencrypt.org/), using the scripts provided by [Certbot](https://certbot.eff.org/), to enable a secure connection over HTTPS.

## Databases
Two different databases are used in this application:

### Redis
Redis is in this project used for storing session variables instead of using memory storage. [Read more..](https://redis.io/)

### MongoDB
MongoDB Atlas is used to store and handle authentication storage for user details. [Read more.. ](https://www.mongodb.com/cloud/atlas)

### Moongoose
Moongoose is a mongodb object modelling tool. In this project mongoose was used to create and model schemas for MongoDb [Read more.. ](https://mongoosejs.com/)