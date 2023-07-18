const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('post-data', function(req) {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
app.use(express.json());
app.use(cors());


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
  res.json(contacts);
});

app.get('/info', (req, res) => {
  let date = new Date(Date.now());
  res.send(`Phonebook has info for ${contacts.length} people.<br/><br/>${date.toString()}`);
});

app.get('/api/persons/:id', (req, res) => {
  const contact = findContact(req.params.id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }

});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(contact => contact.id !== +id);

  res.status(204).end();
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

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  contacts = contacts.concat(contact);
  res.json(contact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "localhost", () => {
	console.log(`Listening to port ${PORT}`);
});