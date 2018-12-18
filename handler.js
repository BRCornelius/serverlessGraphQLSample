'use strict'
const {
    GraphQLID,
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull
  } = require('graphql');
const pgp = require('pg-promise')();
const db = pgp(process.env.POSTGRES_URL);

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLID
        },
        email: {
            type: GraphQLString,
        },
        fname: {
            type: GraphQLString,
        },
        lname: {
            type: GraphQLString,
        },
    }
})

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: UserType,
            resolve: (obj, args, context, info)=> {
                console.log('resolving')
                return db.any(`SELECT * FROM users`).then(([results])=>results) 
            }
      }
    }
  })
});

  var query = '{ users {email} }';
 
 module.exports.test = async (event, context, callback)=>{
    // context.callbackWaitsForEmptyEventLoop = true;
    graphql(schema, query)
    .then(result => {
        console.log("export", result);
        callback("Danger Will Robinson", {statusCode: 200, body: JSON.stringify(result)})
    })
    .catch(error=>console.log(error));
 }