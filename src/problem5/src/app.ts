import express from 'express';
import dotenv from 'dotenv';
import assert from 'assert';
import { prisma } from './prisma.js';
import type { User } from './generated/prisma/client.js';
import type { UserUpdateInput } from './generated/prisma/models.js';
import type { ApiResponse } from './types.js';
import type { Prisma } from './generated/prisma/client.js';
import { validateEmail, validateUniqueEmail } from './utils.js';

dotenv.config();
assert(process.env.PORT, 'PORT is not set');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
  const VALID_CONTENT_TYPES = ['application/json'];
  const method = req.method;
  if(method && !VALID_METHODS.includes(method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const contentType = req.headers['content-type'];
  if(contentType && !VALID_CONTENT_TYPES.includes(contentType)) {
    return res.status(400).json({ error: 'Invalid content type' });
  }
  next();
});

app.get<{}, ApiResponse<User[]>>('/api/users', async (req, res) => {
  const {name, email} = req.query;
  const where: Prisma.UserWhereInput = {};
  if (typeof name === 'string' && name.length > 0) {
    where.name = { contains: name,  };
  }
  if (typeof email === 'string' && email.length > 0) {
    if(!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
      
    where.email = { equals: email };
  }

  const users = await prisma.user.findMany({ where });

  res.json({ data: users });
});

app.get<{ id: string }, ApiResponse<User>>('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  if(!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Id is invalid' });
  }
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  }); 
  if(!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ data: user });
});

app.post<{}, ApiResponse<User>, Pick<User, 'name' | 'email'>>('/api/users', async (req, res) => {
  if(typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({ error: 'Invalid body' });
  }
  
  const { name, email } = req.body;
  if(!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if(!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  const isUnique = await validateUniqueEmail(email);
  if(!isUnique) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const user = await prisma.user.create({
    data: { name, email },
  });

  res.json({ data: user });
});

app.put<{ id: string },ApiResponse<User> ,  Pick<User, 'name' | 'email'> , User>('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body; 

  if(!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const isUnique = await validateUniqueEmail(email);
  if(!isUnique) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const data: UserUpdateInput = { name, email };
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  res.json({ data: updatedUser });
});

app.delete<{ id: string },ApiResponse<User>>('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
  });

  res.json({ data: deletedUser });
});

export default app;