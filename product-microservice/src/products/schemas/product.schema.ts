import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true, collection: 'products' },
);
