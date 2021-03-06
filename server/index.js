const mongoose = require("mongoose");
const path = require('path');
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
		birthdate: Date,
		superpower: String
	});

	const Astronaut = mongoose.model("Astronaut", astronautSchema);
// -----------------------------------------------------------------------------


// Validation functions --------------------------------------------------------
	function validateAstronaut(astronaut, required = true)
	{
		const schema = {
			name:	    Joi.string().min(2),
			surname:    Joi.string().min(2),
			birthdate:  Joi.date(),
			superpower: Joi.string()
		};

		return Joi.validate(astronaut, schema, { presence: (required) ? "required" : "optional" });
    }

	function validateGet(getData)
	{
		const schema = {
            name:	    Joi.string().min(2),
            surname:    Joi.string().min(2),
            birthdate:  Joi.date(),
            superpower: Joi.string()
		};
		
		return Joi.validate(getData, schema, { presence: "optional" });
	}
// -----------------------------------------------------------------------------
	
// GET requests ----------------------------------------------------------------

	app.get('/astronauts', (req, res) => {
	    const { error } = validateGet(req.query);
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
            Astronaut.find()
                .then(astronauts => { res.json(astronauts); })
                .catch(err => { res.status(400).send("Request error!"); });
		}
	});

	app.get('/astronauts/:id', (req, res) => {
        const { error } = validateGet(req.query);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            Astronaut.findById(req.params.id)
                .then(astronaut => res.json(astronaut))
                .catch(err => res.status(400).send("Astronaut with given id not found!"));
		}
	});

	if(process.env.NODE_ENV === "production") {
		app.use(express.static('../client/build'));

		app.get('*', (req, res) => {
			res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
		})
	}

// ---------------------------------------------------------------------------

// POST request -------------------------------------------------------------	
	app.post('/astronauts', (req, res) => {
        const { error } = validateAstronaut(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            Astronaut.create(req.body)
                .then(result => { res.json(result) })
                .catch(err => { res.send("Failed to save the astronaut!")});
		}
	});
// -----------------------------------------------------------------------------
		
// PUT request ----------------------------------------------------------------
	app.put('/astronauts/:id', (req, res) => {
        const { error } = validateAstronaut(req.body, false);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            Astronaut.findByIdAndUpdate(req.params.id, req.body, { new: true})
            	.then(result => { res.json(result) })
                .catch(err => { res.send("Failed to update the astronaut!")});
        }
	});
// -----------------------------------------------------------------------------

// DELETE request ------------------------------------------------------------------
	app.delete('/astronauts/:id', (req, res) => {
		Astronaut.findByIdAndDelete(req.params.id)
			.then(result => {
				if (result)
					res.json(result);
				else
					res.status(404).send("The astronaut with given id not found!");
			})
			.catch(err => { res.send("Error on delete the astronaut!") });
	});
// -----------------------------------------------------------------------------
