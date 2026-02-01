import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    link: { type: String },
    image: { type: String }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
