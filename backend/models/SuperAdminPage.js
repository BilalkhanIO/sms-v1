import mongoose from "mongoose";

const SuperAdminPageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const SuperAdminPage = mongoose.model("SuperAdminPage", SuperAdminPageSchema);

export default SuperAdminPage;
