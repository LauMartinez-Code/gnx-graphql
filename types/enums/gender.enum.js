const { GraphQLEnumType } = require('graphql');

//6 - Gender must be implemented as Enum
const GenderEnumType = new GraphQLEnumType({
  name: 'GenderEnumType',
  description: 'represents possible values ​​for the genres',
  values: {
    MASC: { value: 'Masculine' },
    FEM: { value: 'Femenine' },
  },
});

module.exports = GenderEnumType;