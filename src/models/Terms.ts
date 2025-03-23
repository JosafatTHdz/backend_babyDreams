import mongoose from "mongoose";

const TermsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

const Terms = mongoose.model('Term', TermsSchema);
export default Terms