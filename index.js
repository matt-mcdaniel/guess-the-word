const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

console.log('PORT', port);

app.prepare()
    .then(() => {
        const server = express();

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(port, err => {
            if (err) throw err;

            console.log(`Server listening on ${port}`);
        });
    })
    .catch(exception => {
        console.error(exception.stack);
        process.exit(1);
    });
