import { session } from '../models/user.model'
import { uid } from 'uid';
import bcrypt from 'bcrypt'

//create new user
export const registerNewUser = async (body) => {

  const { firstName, lastName, email, password } = body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds); // You can adjust the salt rounds as needed

  const existingUserResult = await session.run(
    'MATCH (u:User {firstName: $firstName}) RETURN u',
    { firstName }
  );

  if (existingUserResult.records.length > 0) {
    throw new Error("Username already exists")
  }

  let _id = uid();

  const createUserResult = await session.run(
    'CREATE (u:User { _id : $_id,firstName: $firstName, lastName:$lastName, email:$email, password:$password}) RETURN u',
    { _id, firstName, lastName, email, password: hashedPassword }
  );

  const createdUser = createUserResult.records[0].get('u').properties;
  return createdUser
};

