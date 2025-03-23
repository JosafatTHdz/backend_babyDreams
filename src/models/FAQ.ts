import mongoose from 'mongoose'

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const FAQ = mongoose.model("Faq", FaqSchema);
export default FAQ