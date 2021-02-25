import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';


describe("Surveys",() => {

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

  it('should be able to create a new survey', async () => {
    const response = await request(app).post("/surveys")
      .send({
        title: "Title Example",
        description: "Description Example"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });


  it('should be able to get all surveys', async () => {
    await request(app).post("/surveys")
      .send({
        title: "Title Example 2",
        description: "Description Example 2"
      });

    const surveys = await request(app).get("/surveys");

    expect(surveys.body.length).toBe(2);
  })
});