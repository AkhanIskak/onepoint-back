import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: "1.0.0",
        title: "API",
        description: "OnePoint Back"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./controllers/authController.mjs', './controllers/eventController.mjs', './controllers/enrollmentController.mjs'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('./index.mjs'); // Your project's root file
});