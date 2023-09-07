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
    throw new Error("No results found.")
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



export const getNoteDetails = async (userId, noteId) => {

  const cypherQuery = `
  MATCH (user:User {email: $userId})-[:CREATED]->(note:Note {id: $noteId})
  RETURN note
`;

  const result = await session.run(cypherQuery, { userId, noteId });

  if (result.records.length === 0) {
    throw new Error("No results found.")
  }
  const note = result.records[0].get('note');
  return note.properties;
}


export const updateNoteDetail = async (body, noteId) => {

  const { userId, ...updates } = body;

  const cypherQuery = `
      MATCH (user:User {email: $userId})-[:CREATED]->(note:Note {id: $noteId})
      SET ${Object.keys(updates).map(field => `note.${field} = $${field}`).join(', ')}
      RETURN note
    `;

  const result = await session.run(cypherQuery, { userId, noteId, ...updates });

  const updatedNote = result.records[0].get('note');

  return updatedNote;
}


export const deleteNote = async (userId, noteId) => {

  const cypherQuery = `
      MATCH (user:User {email: $userId})-[:CREATED]->(note:Note {id: $noteId})
      DETACH DELETE note
    `;

  await session.run(cypherQuery, { userId, noteId });

  return " ";

}










