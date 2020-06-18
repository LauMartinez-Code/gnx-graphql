const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const DepartmentModel = require("../models/department").Department;
const DeptManagerModel = require("../models/dept_manager").DeptManager;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;
const { CantRepeatDepartmentName } = require('../validators/departments.validator');

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} = graphql;


const DepartmentType = new GraphQLObjectType({
  name: "DepartmentType",
  description: "Represent Departments",
  extensions: {
    validations: {
      CREATE: [CantRepeatDepartmentName],
      UPDATE: [CantRepeatDepartmentName],
    },
  },
  fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLNonNull(GraphQLString) },
      dept_manager: {
        type: DeptManagerType,
        extensions: {
          relation: {
            embedded: false,
            connectionField: "DepartmentID",
          },
        },
        resolve(parent, args) {
          return DeptManagerModel.find({ DepartmentID: parent.id });
        }
      },
      dept_employees: {
        type: DeptEmployeesType,
        extensions: {
          relation: {
            embedded: false,
            connectionField: "DepartmentID",
          },
        },
        resolve(parent, args) {
          return DeptEmployeesModel.find({ DepartmentID: parent.id });
        }
      }
    })
});

gnx.connect(DepartmentModel, DepartmentType, "department", "departments");

module.exports = DepartmentType;

const DeptManagerType = require('./dept_manager');
const DeptEmployeesType = require('./dept_employees');