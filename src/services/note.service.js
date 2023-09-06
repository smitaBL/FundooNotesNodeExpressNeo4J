import { session } from '../models/user.model'

import { uid } from 'uid';


//create new user
export const createNote = async (body) => {

    const { title, content, userId } = body;

    let id = uid(15);

    const createdAt = new Date().toISOString();

    const cypherQuery = `
      MATCH (user:User {email: $userId})
      CREATE (note:Note {title: $title, content: $content, userId: $userId, id:$id, createdAt: $createdAt})
      MERGE (user)-[:CREATED]->(note)
      RETURN note AS createdNote
    `;

    const result = await session.run(cypherQuery, { title, content, userId, id, createdAt });

    if (result.records.length === 0) {
        console.log('No results found.');

    }

    const createdNote = result.records[0].get('createdNote');

    return createdNote;
};


export const getAllNote = async (body) => {

    const { userId } = body;


    const cypherQuery = `
    MATCH (user:User {email: $userId})-[:CREATED]->(note:Note)
    RETURN user, collect(note) AS notes
  `;

    const result = await session.run(cypherQuery, { userId });


    const records = result.records;

    const responseData = records.map(record => ({
        user: record.get('user').properties,
        notes: record.get('notes').map(noteNode => noteNode.properties)
    }));

    return responseData;
};









