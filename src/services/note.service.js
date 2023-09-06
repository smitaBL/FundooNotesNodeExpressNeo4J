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








