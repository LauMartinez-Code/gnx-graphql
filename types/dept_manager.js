const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const DepartmentModel = require("../models/department").Department;
const DeptManagerModel = require("../models/dept_manager").DeptManager;
const { GraphQLDate } = require('graphql-iso-date');
const { DateValidation, ValidateRelatedID } = require('../validators/commonValidations');
const { VerifyDatesOverlap } = require('../validators/departments.validator');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLNonNull,
} = graphql;

const validationFunctions = [ValidateRelatedID, DateValidation, VerifyDatesOverlap];

const DeptManagerType = new GraphQLObjectType({
  name: "DeptManagerType",
  description: "Represent Departments Managers",
  extensions: {
    validations: {
      CREATE: validationFunctions,
      UPDATE: validationFunctions
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

gnx.connect(DeptManagerModel, DeptManagerType, "deptManager", "deptsManagers");

module.exports = DeptManagerType;

const EmployeeType = require("./employee");
const DepartmentType = require('./department');