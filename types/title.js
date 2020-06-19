const graphql = require("graphql");
const gnx = require("@simtlix/gnx");
const EmployeeModel = require("../models/employee").Employee;
const TitleModel = require("../models/title").Title;
const { GraphQLDate } = require('graphql-iso-date');
const { DateValidation, ValidateRelatedID } = require('../validators/commonValidations');
const {VerifyDatesOverlap} = require('../validators/title.validator');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const validationFunctions = [ValidateRelatedID, DateValidation, VerifyDatesOverlap];

const TitleType = new GraphQLObjectType({
  name: "TitleType",
  description: "Represent Titles",
  extensions: {
    validations: {
      CREATE: validationFunctions,
      UPDATE: validationFunctions,
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
      }
    },
    title: { type: GraphQLNonNull(GraphQLString) },
    from_date: { type: GraphQLNonNull(GraphQLDate) },
    to_date: { type: GraphQLNonNull(GraphQLDate) },
  }),
});

gnx.connect(TitleModel, TitleType, "title", "titles");

module.exports = TitleType;

const EmployeeType = require("./employee");