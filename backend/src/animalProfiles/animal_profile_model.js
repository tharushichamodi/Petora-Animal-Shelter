const mongoose = require('mongoose');
const { type } = require('express/lib/response');
const schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const animalProfileSchema = new schema(
    {
        animalProfileID: {
            type: Number,
            required: true,
            default: 0,
            unique: true,
        },
        species: {
            type: String,
            required: true,
            trim: true,
        },
        breed: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
            trim: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        weight: {
            type: String,
            required: true,
            trim: true,
        },
        adoptionStatus: {
            type: String,
            required: true,
            default: 'Under Care',
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        photos: [
            {
                type: String, // store image URLs or file paths
            },
        ],
        favouritedBy:[
            {
                type:Number
                
            }
        ]
    },
    
);
animalProfileSchema.plugin(AutoIncrement, { inc_field: 'animalProfileID', start_seq: 1000 });

module.exports = mongoose.model('AnimalProfile', animalProfileSchema, 'animalProfiles');