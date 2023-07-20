require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Contact = require('./models/contact');

morgan.token('post-data', function(req) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
app.use(express.json());




let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

function findContact(id) {
  return contacts.find(contact => contact.id === +id);
}

function generateId() {
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id)) 
    : 0;

  return maxId + 1;
}

function verifyUniqueName(name) {
  return contacts.find(contact => contact.name === name);
}


app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts);
  });
});

app.get('/info', (req, res) => {
  let date = new Date(Date.now());

  Contact.estimatedDocumentCount().then(count => {
    res.send(`Phonebook has info for ${count} people.<br/><br/>${date.toString()}`);
  })

});

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.send(res.json(contact));
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(404).json({ 
      error: 'name required' 
    });
  } else if (!body.number) {
    return res.status(404).json({
      error: 'number required'
    });
  } else if (verifyUniqueName(body.name)) {
    return res.status(404).json({
      error: 'name must be unique'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then(savedContact => {
    res.json(savedContact);
  });
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'});
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Listening to port ${PORT}`);
});