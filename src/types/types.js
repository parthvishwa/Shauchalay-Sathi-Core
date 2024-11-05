const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { areas, shauchalayas } = require("../raw/data.json");

const toiletType = new GraphQLObjectType({
  name: "Toilet",
  description: "Represents a Toilets belonging to an area",
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    areaId: { type: GraphQLNonNull(GraphQLID) },
    area: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (toilet) => {
        return areas.find((area) => area.id === toilet.areaId).name ?? "";
      },
    },
    location: { type: GraphQLNonNull(GraphQLString) },
  },
})

const areaType = new GraphQLObjectType({
  name: "Area",
  description: "Area of the city",
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    toilets: {
      type: new GraphQLList(toiletType),
      resolve: (area) => {
        return shauchalayas.filter(shauchalaya => shauchalaya.areaId === area.id);
      },
    },
  },
})

module.exports = {
  AreaType: areaType,
  ToiletType: toiletType
};
