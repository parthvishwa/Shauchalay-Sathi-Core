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
const {
  isValidEntity,
  isNameUnique,
  generateIdforEntity,
} = require('../util/utils');
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
        try {
          return await AreaModel.findById({ _id: args.id });
        } catch (error) {
          return new GraphQLError(error.message);
        }
      },
    },
    toilet: {
      type: ToiletType,
      description: 'Toilet name and details',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          return await ToiletModel.findById({ _id: args.id });
        } catch (error) {
          return new GraphQLError(error.message);
        }
      }
    },
    toiletsInArea: {
      type: new GraphQLList(ToiletType),
      description: 'list of total toilets in an area',
      args: {
        areaId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          if (await AreaModel.exists({ _id: args.areaId }))
            return await ToiletModel.find({ areaId: args.areaId });
          else
            return new GraphQLError(
              "Couldn't find area with id: " + args.areaId
            );
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
      resolve: async (parent, args) => {
        if (await AreaModel.exists({ name: args.name })) {
          return new GraphQLError(
            'Invalid name/Id for Area.name | Name already exists'
          );
        }
        const size = await AreaModel.countDocuments({});
        const newArea = Object.assign(
          {},
          { _id: generateIdforEntity(size, args.name), name: args.name }
        );
        try {
          AreaModel.create(newArea);
        } catch (error) {
          return new GraphQLError(error.message)
        }
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
      resolve: async (parent, args) => {
        if (await AreaModel.exists({ _id: args.areaId })) {
          return new GraphQLError('Bad value for area id');
        }
        const size = await ToiletModel.countDocuments({});
        const newToilet = Object.assign(
          {},
          {
            _id: generateIdforEntity(size, args.name),
            name: args.name,
            areaId: args.areaId,
            location: args.location,
          }
        );
        if(await ToiletModel.exists({name: args.name, areaId: args.areaId})) {
          return new GraphQLError(
            'Invalid name/Id for Area.name | Name already exists'
          );
        } else{
          ToiletModel.create(newToilet)
        }
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
