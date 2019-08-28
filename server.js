const mongoose = require("mongoose");
const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CONNECTION_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tf_task";
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// DB connection ----------------------------------------------------------
	mongoose
		.connect(CONNECTION_URI, { useNewUrlParser: true })
		.then(() => console.log("Connected to MongoDB!"))
		.catch(error => console.error("Could not connect to MongoDB... ", error));
// -----------------------------------------------------------------------------
	

// Mongoose schemas ------------------------------------------------------

	const astronautSchema = new mongoose.Schema({
		name: String,
		surname: String,
		birthdate: String,
		superpower: String
	});

	const Astronaut = mongoose.model("Astronaut", astronautSchema);
// -----------------------------------------------------------------------------


// Validation functions --------------------------------------------------------
	function validateAstronaut(astronaut, reqired = true)
	{
		const schema = {
			name:		Joi.string().min(2),
			surname: 	Joi.string().min(2),
			birthdate:  Joi.date(),
			superpower: Joi.string()
		};

		return Joi.validate(astronaut, schema, { presence: (reqired) ? "required" : "opional" });
    }

	function validateGet(getData)
	{
		const schema = {
			limit: 		Joi.number().min(1),
            name:		Joi.string().min(2),
            surname: 	Joi.string().min(2),
            birthdate:  Joi.date(),
            superpower: Joi.string()
		}
		return Joi.validate(getData, schema, { presence: "optional" });
	}
// -----------------------------------------------------------------------------
	
// GET requests ----------------------------------------------------------------

	app.get('/astronauts', (req, res) => {
        const { error } = validateGet(req.query);
        if (error)
        {
            res.status(400).send(error.details[0].message);
            return;
        }

        let dbQuery = Astronaut.find();

        if (req.query.limit)
            dbQuery = dbQuery.limit(req.query.limit);

        dbQuery.then(astronauts => { res.json(astronauts); })
            .catch(err => { res.status(400).send("Chyba požadavku na režiséry!"); });
    });


	app.get('/astronauts/:id', (req, res) => {
		Astronaut.findById(req.params.id, (err, person) => {
			if (err || !result)
				res.status(404).send("Astronaut s daným ID nebyl nalezen.");
			else
				res.json(person);
		});
	});

	if(process.env.NODE_ENV === "production") {
	    app.use(express.static('client/build'));

        app.get('/astronauts', (req, res) => {
            res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
        })
    }

// ---------------------------------------------------------------------------

// POST requests -------------------------------------------------------------	
	app.post('/astronauts', (req, res) => {
        const { error } = validateAstronaut(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            Astronaut.create(req.body)
                .then(result => { res.json(result) })
                .catch(err => { res.send("Nepodařilo se uložit astronauta")});
		}
	});
// -----------------------------------------------------------------------------
		
// PUT requests ----------------------------------------------------------------
	app.put('/astronauts/:id', (req, res) => {
		Astronaut.findByIdAndUpdate(req.params.id, req.body, { new: true})
			.then(result => { res.json(result) })
			.catch(err => { res.send("Nepodařilo se upravit astronauta")});
	});
// -----------------------------------------------------------------------------

// DELETE requests ------------------------------------------------------------------
	app.delete('/astronauts/:id', (req, res) => {
		Astronaut.findByIdAndDelete(req.params.id)
			.then(result => {
				if (result)
					res.json(result);
				else
					res.status(404).send("Astronaut s daným id nebyl nalezen!");
			})
			.catch(err => { res.send("Chyba při mazání astronauta!") });
	});
// -----------------------------------------------------------------------------

async function save() {
    const astronaut = new Astronaut({
            "name": "Neil",
            "surname": "Armstrong",
            "birthdate": "2018-07-22",
            "superpower": "Moon walking",
        })

    const result = await astronaut.save();
    console.log(result.id);
}