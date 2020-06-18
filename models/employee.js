const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeFields = {
  dni: Number,
  name: String,
  first_name: String,
  last_name: String,
  birth_date: Date,
  hire_date: Date,
  gender: String,
};

const employeeSchema = new Schema(employeeFields);

const Employee = mongoose.model("Employee", employeeSchema);
if (!Employee.collection.collection) {
  Employee.createCollection();
}

module.exports = { Employee, employeeFields };