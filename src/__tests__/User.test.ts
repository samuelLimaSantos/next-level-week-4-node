import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';


describe("Users",() => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async (done) => {
    const entities = getConnection().entityMetadatas;

    for (const entity of entities) {
      const repository = getConnection().getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post("/users")
      .send({
        email: "user2@example.com",
        name: "User Example"
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a user with exists email', async() => {
    const response = await request(app).post("/users")
    .send({
      email: "user2@example.com",
      name: "User Example"
    });

    expect(response.status).toBe(400);
  })

});