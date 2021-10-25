//This file shows separately the basic structure for the graphql server

const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
} = require('graphql')

const app = express()
const schema = new GraphQLSchema ({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: { 
                type: GraphQLString, 
                resolve: () => 'Hellow World!'
            }
        })
    })
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
  }))
app.listen(5000., () => console.log('Server is running'))