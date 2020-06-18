const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const DepartmentModel = require("../models/department").Department;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;
const { GraphQLDate } = require('graphql-iso-date');
const { DateValidation, ValidateRelatedID } = require('../validators/commonValidations');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const DeptEmployeesType = new GraphQLObjectType({
  name: "DeptEmployeesType",
  description: "Represent Departments Employees",
  extensions: {
    validations: {
      CREATE: [ValidateRelatedID, DateValidation],
      UPDATE: [ValidateRelatedID, DateValidation],
    }
  },
  fields: () => ({
    id: { type: GraphQLID },
    employee: {
      type: EmployeeType,
      extensions: {
        relation: {
          connectionField: "EmployeeID",
        },
      },
      resolve(parent, args) {
        return EmployeeModel.findById(parent.EmployeeID);
      },
    },
    department: {
        type: DepartmentType,
        extensions: {
          relation: {
            connectionField: "DepartmentID",
          },
        },
        resolve(parent, args) {
          return DepartmentModel.findById(parent.DepartmentID);
        }
    },
    from_date: { type: GraphQLNonNull(GraphQLDate) },
    to_date: { type: GraphQLNonNull(GraphQLDate) },
  })
});

gnx.connect(DeptEmployeesModel, DeptEmployeesType, "deptEmployees", "deptsEmployees");

module.exports = DeptEmployeesType;

const EmployeeType = require("./employee");
const DepartmentType = require('./department');