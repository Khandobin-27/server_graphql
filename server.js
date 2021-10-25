const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const https = require('https');

let url = "https://jsonplaceholder.typicode.com/users";

//fetching API from JSONplaceholder
https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            //parsing the JSON objevt to use inside graphql
            let users = JSON.parse(body);

  //--------------------------------------------------------------------          
            //grpahql code
            const app = express()

            const UserAddress = new GraphQLObjectType ({
                name: 'UserAddress',
                description: 'This represents the address of each user',
                fields: () => ({
                    street: {type: GraphQLNonNull(GraphQLString)},
                    city: {type: GraphQLNonNull(GraphQLString)},
                    zipcode: {type: GraphQLNonNull(GraphQLString)}
                })
            })

            const UserName = new GraphQLObjectType ({
                name: 'User',
                description: 'This represent the name of the user',
                fields: () => ({
                    id: {type: GraphQLNonNull(GraphQLInt) },
                    name: {type: GraphQLNonNull(GraphQLString)},
                    email: {type: GraphQLNonNull(GraphQLString)},
                    phone: {type: GraphQLNonNull(GraphQLString)},
                    website: {type: GraphQLNonNull(GraphQLString)},
                    address: {type: UserAddress}
                })
            })

            const RootQueryType = new GraphQLObjectType({
                name: 'Query',
                description: 'Root Query',
                fields: () => ({
                    //this object to query single user
                    user: {
                        type: UserName,
                        description: 'A single User',
                        args: {
                            id: { type: GraphQLInt }
                        },
                        resolve: (parent, args) => users.find(user => user.id === args.id)
                    },
                    //this object to query all user
                    users: {
                        type: new GraphQLList(UserName),
                        description: 'List of users',
                        resolve: () => users
                    }
                })
            })

            const RootMutationType = new GraphQLObjectType({
                name: 'Mutation',
                description: 'Root Mutation',
                fields: () => ({
                  addUser: {
                    type: UserName,
                    description: 'Add a user',
                    args: {
                      name: { type: GraphQLNonNull(GraphQLString) },
                      id: { type: GraphQLNonNull(GraphQLInt) },
                    },
                    resolve: (parent, args) => {
                      const user = { id: users.length + 1, name: args.name }
                      users.push(user)
                      return user
                    }
                  }
                })
              })

            const schema = new GraphQLSchema ({
                query: RootQueryType,
                mutation: RootMutationType
            })

            app.use('/graphql', graphqlHTTP({
                schema: schema,
                graphiql: true
            }))
            app.listen(5000., () => console.log('Server is running'))
//-------------------------------------------------------------------------

        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});


