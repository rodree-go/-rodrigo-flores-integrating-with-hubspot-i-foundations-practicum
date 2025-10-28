const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PORT = 3000;
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    try {
        const contactsResponse = await axios.get(
            'https://api.hubapi.com/crm/v3/objects/contacts',
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    limit: 20,
                    properties: 'firstname,lastname,email,nationality'
                }
            }
        );

        const contacts = contactsResponse.data.results;

        res.render('homepage', {
            title: 'Contacts List | HubSpot Practicum',
            contacts: contacts
        });

    } catch (error) {
        console.error('Error fetching contacts:', error.response?.data || error.message);
        res.status(500).send('Error fetching contacts from HubSpot');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Object | Integrating With HS I Practicum'
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    try {
        const { firstname, lastname, email, nationality } = req.body;

        const contactData = {
            properties: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                nationality: nationality
            }
        };

        const createResponse = await axios.post(
            'https://api.hubapi.com/crm/v3/objects/contacts',
            contactData,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Contact created successfully:', createResponse.data);

        res.redirect('/');

    } catch (error) {
        console.error('Error creating contact:', error.response?.data || error.message);
        res.status(500).send('Error creating contact in HubSpot');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
