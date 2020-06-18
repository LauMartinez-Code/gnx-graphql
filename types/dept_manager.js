const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const DepartmentModel = require("../models/department").Department;
const DeptManagerModel = require("../models/dept_manager").DeptManager;
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

const DeptManagerType = new GraphQLObjectType({
  name: "DeptManagerType",
  description: "Represent Departments Managers",
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

gnx.connect(DeptManagerModel, DeptManagerType, "deptManager", "deptsManagers");

module.exports = DeptManagerType;

const EmployeeType = require("./employee");
const DepartmentType = require('./department');