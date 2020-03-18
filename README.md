# Application Server
The application server runs as an Ubuntu server. The server sits behind a reverse proxy and is an Express server running in Node. 

<!-- ABOUT THE PROJECT -->
## Node and Express
The [Express server](https://www.npmjs.com/package/express) runs in [Nodejs](https://nodejs.org/en/). The [Node Package Manager](https://www.npmjs.com/) (npm) is used to run the server and install different modules. 

## Security
The application server has several security implementations, such as the reverse proxy, SSL/TLS, authentication, helmet, CSRF, environment variables etc. Most installed modules with implementations can be found in the [app.js](https://github.com/LasseUlvatne/IoT-Project-2DT301/blob/master/Application%20server/app.js) script.

### Reverse proxy
Reverse proxy runs as an NGINX server. [Read more..](https://www.nginx.com/)

### Let's encrypt
A SSL/TLS certificate was installed served by [Let's encrypt](https://letsencrypt.org/), using the scripts provided by [Certbot](https://certbot.eff.org/), to enable a secure connection over HTTPS.

## Databases
Two different databases are used in this application:

### Redis
Redis is in this project used for storing session variables. [Read more..](https://redis.io/)

### MongoDB
MongoDB Atlas is used to store and handle authentication storage for user details. [Read more.. ](https://www.mongodb.com/cloud/atlas)