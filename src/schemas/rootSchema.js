const { ToiletType, AreaType } = require("../types/types");
const { GraphQLID, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLError } = require("graphql");
const { areas, shauchalayas } = require('../raw/data.json');
const { isValidEntity, isInvalidName } = require("../util/utils");

const rootQuery = new GraphQLObjectType({
  name: "Query",
  description: "Root query",
  fields: ()=> ({
    areas: {
      type: new GraphQLList(AreaType),
      description: "list of areas",
      resolve: () => areas,
    },
    toilets: {
      type: new GraphQLList(ToiletType),
      description: "list of all toilets",
      resolve: () => shauchalayas,
    },
    area: {
      type: AreaType,
      description: "Area name and details",
      args: {
        id: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve: (parent,args) => {
        if(!isValidEntity(shauchalayas, args.name) || !isValidName(areas, args.areaId)){
          return new GraphQLError({message: 'Bad value for name/id'});
        }
        return areas.find(area => area.id == args.id)
      },
    },
    toilet: {
      type: ToiletType,
      description: "Toilet name and details",
      args: {
        id: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve: (parent,args) => shauchalayas.find(shauchalaya => shauchalaya.id == args.id),
    },
    toiletsInArea: {
      type: new GraphQLList(ToiletType),
      description: "list of total toilets in an area",
      args: {
        areaId: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve: (parent,args) => shauchalayas.filter(shauchalaya => shauchalaya.areaId == args.areaId),
    },
  }),
})

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () =>({
    addArea: {
      type: AreaType,
      description: 'Adds an Area',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        if(!isValidName(areas, args.name)){
          return;
        }
        const newArea = Object.assign({}, {id: areas.length + 1, name: args.name})
        shauchalayas.push(newArea);
        return newArea;
      },
    },
    addToilet: {
      type: ToiletType,
      description: 'Adds a toilet',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        areaId: { type: GraphQLNonNull(GraphQLID) },
        location: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        if(!isValidEntity(shauchalayas, args.name) || !isValidName(areas, args.areaId)){
          throw new GraphQLError({message: 'Bad value for name/id'});
        }
        const newToilet = Object.assign({}, {id: shauchalayas.length + 1, name: args.name, areaId: args.areaId, location: args.location})
        shauchalayas.push(newToilet);
        return newToilet;
      },
    },
  })
})

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
});

module.exports = {
  rootSchema: schema
}