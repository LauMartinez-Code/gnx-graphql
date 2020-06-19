const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const SalaryModel = require("../models/salary").Salary;
const TitleModel = require("../models/title").Title;
const DeptManagerModel = require("../models/dept_manager").DeptManager;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;
const { AuditableObjectFields } = require("../types/extended_types/auditableGraphQLObjectType");
const { GraphQLDate } = require("graphql-iso-date");
const GenderEnumType = require("../types/enums/gender.enum");
const { CantRepeatDNI, BeOfAge } = require('../validators/employee.validator');
const { CheckForRelatedElements } = require('../validators/commonValidations');


const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;


const EmployeeType = new GraphQLObjectType({
  name: "EmployeeType",
  description: "Represent Employees",
  extensions: {
    validations: {
      CREATE: [CantRepeatDNI, BeOfAge],
      UPDATE: [CantRepeatDNI, BeOfAge],
      DELETE: [CheckForRelatedElements]
    },
  },
  fields: () =>
    Object.assign(AuditableObjectFields, {
      id: { type: GraphQLID },
      dni: { type: GraphQLNonNull(GraphQLInt) },
      first_name: { type: GraphQLNonNull(GraphQLString) },
      last_name: { type: GraphQLNonNull(GraphQLString) },
      birth_date: { type: GraphQLNonNull(GraphQLDate) },
      hire_date: { type: GraphQLNonNull(GraphQLDate) },
      gender: { type: GenderEnumType },
      salary: {
        type: new GraphQLList(SalaryType),
        extensions: {
          relation: {
            embedded: false,
            connectionField: "EmployeeID",
          },
        },
        resolve(parent, args) {
          return SalaryModel.find({ EmployeeID: parent.id });
        }
      },
      title: {
        type: new GraphQLList(TitleType),
        extensions: {
          relation: {
            embedded: false,
            connectionField: "EmployeeID",
          },
        },
        resolve(parent, args) {
          return TitleModel.find({ EmployeeID: parent.id });
        }
      },
      dept_manager: {
        type: DeptManagerType,
        extensions: {
          relation: {
            embedded: false,
            connectionField: "EmployeeID",
          },
        },
        resolve(parent, args) {
          return DeptManagerModel.find({ EmployeeID: parent.id });
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

gnx.connect(EmployeeModel, EmployeeType, "employee", "employees");

module.exports = EmployeeType;

const SalaryType = require('./salary');
const TitleType = require('./title');
const DeptManagerType = require('./dept_manager');
const DeptEmployeesType = require('./dept_employees');