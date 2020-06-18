const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deptEmployeesFields = {
  EmployeeID: Schema.Types.ObjectId,
  DepartmentID: Schema.Types.ObjectId,
  from_date: Date,
  to_date: Date,
};

const deptEmployeesSchema = new Schema(deptEmployeesFields);

const DeptEmployees = mongoose.model("DeptEmployees", deptEmployeesSchema);
if (!DeptEmployees.collection.collection) {
  DeptEmployees.createCollection();
}

module.exports = { deptEmployeesFields, DeptEmployees };
