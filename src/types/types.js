const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { areas, shauchalayas } = require("../raw/data.json");

const areaType = new GraphQLObjectType({
  name: "Area",
  description: "Area of the city",
  fields: {
    idn: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
  },
})

const toiletType = new GraphQLObjectType({
  name: "Toilet",
  description: "Represents a Toilets from an area",
  fields: {
    idn: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    areaId: { type: GraphQLNonNull(GraphQLID) },
    location: { type: GraphQLNonNull(GraphQLString) },
  },
})

module.exports = {
  AreaType: areaType,
  ToiletType: toiletType
};
