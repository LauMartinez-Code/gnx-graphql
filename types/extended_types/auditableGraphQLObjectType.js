const graphql = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const {
  GraphQLObjectType, GraphQLBoolean, GraphQLString,
} = graphql;

const AuditableObjectFields = {
  'createdAt': {
    type: GraphQLDateTime,
    description: 'Creation date',
    extensions: {
      readOnly: true,
    },
  },
  'updatedAt': {
    type: GraphQLDateTime,
    description: 'Last edited date',
    extensions: {
      readOnly: true,
    },
  },
};

module.exports = { AuditableObjectFields };
