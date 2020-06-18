const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentFields = {
  name: String
};

const departmentSchema = new Schema(departmentFields);

const Department = mongoose.model("Department", departmentSchema);
if (!Department.collection.collection) {
  Department.createCollection();
}

module.exports = { departmentFields, Department };