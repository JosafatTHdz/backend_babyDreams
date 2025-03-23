import mongoose from "mongoose";

const PoliciesSchema = new mongoose.Schema({
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

const Policies = mongoose.model("Policies", PoliciesSchema);
export default Policies