const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
  titre: String,
  description: String,
  type: { type: String, enum: ["objet", "compétence"] },
  proprietaire: String, // userId fictif
});

module.exports = mongoose.model("Annonce", annonceSchema);
