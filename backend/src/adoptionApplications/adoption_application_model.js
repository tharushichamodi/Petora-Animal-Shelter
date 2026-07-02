const mongoose = require('mongoose');
const { type } = require('express/lib/response');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ChildSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    type: { type: String, enum: ['years', 'months'], required: true }
});

const PetSchema = new mongoose.Schema({
    type: { type: String, required: true },
    value: { type: Number, required: true }
});

const AdoptionApplicationSchema = new mongoose.Schema({
    // Personal Information
    applicationID: { type: Number, unique: true, required: true, default: 0 },
    userID: { type: Number, required: true },
    animalID: { type: Number, required: true },
    full_name: { type: String, required: true },
    email_address: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    dob: { type: Date, required: true },

    // Household Information
    residence_type: { type: String, enum: ['house', 'apartment', 'farm', 'other'], required: true },
    ownership_status: { type: String, enum: ['own', 'rent'], required: true },
    household_members: { type: Number, required: true },
    children: [ChildSchema],

    // Pet History
    current_pets: { type: String, enum: ['yes', 'no'], required: true },
    pets: [PetSchema],
    vaccination_status: { type: String, enum: ['yes', 'no'], required: false },
    past_pets: { type: String },

    // Lifestyle & Care
    adoption_reason: { type: String, required: true },
    pet_environment: { type: String, enum: ['indoors', 'outdoors', 'both'], required: true },
    alone_hours: { type: Number, required: true },
    backup_caretaker: { type: String, required: true },

    // Additional Notes
    additional_notes: { type: String },

    // Agreement
    agreement: { type: Boolean, required: true },
    status:{ type:String, default:'Pending' }

}, { timestamps: true });

AdoptionApplicationSchema.plugin(AutoIncrement, { inc_field: 'applicationID', start_seq: 1000 });

module.exports = mongoose.model('AdoptionApplication', AdoptionApplicationSchema, 'adoptionApplications');
