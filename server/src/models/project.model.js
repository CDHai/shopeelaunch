import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed'],
    default: 'draft'
  },
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 7
  },
  data: {
    category: String,
    marketAnalysis: {
      trends: [String],
      recommendations: [String]
    },
    businessPlan: {
      investment: Number,
      targetRevenue: Number,
      timeline: String
    },
    branding: {
      name: String,
      slogan: String,
      description: String
    },
    product: {
      name: String,
      description: String,
      keywords: [String]
    },
    marketing: {
      strategy: String,
      recommendations: [String]
    }
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;