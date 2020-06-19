const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const SalaryModel = require("../models/salary").Salary;
const { GraphQLDate } = require('graphql-iso-date');
const { DateValidation, ValidateRelatedID } = require('../validators/commonValidations');
const { VerifyDatesOverlap } = require('../validators/salary.validator');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull,
} = graphql;

const validationFunctions = [ValidateRelatedID, DateValidation, VerifyDatesOverlap];

const SalaryType = new GraphQLObjectType({
  name: "SalaryType",
  description: "Represent Salaries",
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
    salary: { type: GraphQLNonNull(GraphQLFloat) },
    from_date: { type: GraphQLNonNull(GraphQLDate) },
    to_date: { type: GraphQLNonNull(GraphQLDate) },
  }),
});

gnx.connect(SalaryModel, SalaryType, "salary", "salaries");

module.exports = SalaryType;

const EmployeeType = require("./employee");