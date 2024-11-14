const { ToiletType, AreaType } = require('../types/types');
const {
  GraphQLID,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
} = require('graphql');
const { areas, shauchalayas } = require('../raw/data.json');
const { isValidEntity, isNameUnique } = require('../util/utils');
const AreaModel = require('../models/AreaModel');
const ToiletModel = require('../models/ToiletModel');

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: () => ({
    areas: {
      type: new GraphQLList(AreaType),
      description: 'list of areas',
      resolve: async () => {
        const res = await AreaModel.find();
        return res;
      },
    },
    toilets: {
      type: new GraphQLList(ToiletType),
      description: 'list of all toilets',
      resolve: async () => await ToiletModel.find(),
    },
    area: {
      type: AreaType,
      description: 'Area name and details',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        return await AreaModel.findOne({ idn: Number(args.id) });
      },
    },
    toilet: {
      type: ToiletType,
      description: 'Toilet name and details',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        return await ToiletModel.findOne({ idn: args.id });
      },
    },
    toiletsInArea: {
      type: new GraphQLList(ToiletType),
      description: 'list of total toilets in an area',
      args: {
        areaId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          if (await AreaModel.findOne({ idn: args.areaId }))
            return await ToiletModel.find({ areaId: Number(args.areaId) });
          else
            return new GraphQLError("Couldn't find area with id: " + args.areaId);
        } catch (error) {
          return new GraphQLError(error.message);
        }
      },
    },
  }),
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addArea: {
      type: AreaType,
      description: 'Adds an Area',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        if (!isNameUnique(areas, args.name)) {
          return new GraphQLError(
            'Invalid name/Id for Area.name / Name already exists'
          );
        }
        const newArea = Object.assign(
          {},
          { idn: areas.length + 1, name: args.name }
        );
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
        if (
          !isValidEntity(areas, args.areaId) ||
          !isNameUnique(shauchalayas, args.name)
        ) {
          throw new GraphQLError('Bad value for name/id');
        }
        const newToilet = Object.assign(
          {},
          {
            id: shauchalayas.length + 1,
            name: args.name,
            areaId: args.areaId,
            location: args.location,
          }
        );
        shauchalayas.push(newToilet);
        return newToilet;
      },
    },
  }),
});

module.exports = {
  rootSchema: new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
  }),
};
