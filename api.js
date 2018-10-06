const express = require('express');
const router = express.Router();
const servers = [
    {
          id: 1
        , name: 'Publico'
        , users: []
    }
];

router.get('/', (req, res) => res.status(200).json('O Jorge é fixe'));

router.get('/servers', (req, res) => {
    res.status(200).json(servers);
});

router.get('/createServer', (req, res) => {
    const { user } = req.cookies
    if(!user)
        res.status(401).json('401 Unauthorized');
    else {
        const { name } = req.query;
        if(!name)
            res.status(400).json('400 Bad Request');
        else {
            servers.push({
                id: servers.length,
                name: name,
                users: [{username: user.username, id: user.id}]
            });

            res.status(200).json(servers);
        }
    }
});

module.exports = router;