// import { getConnection } from "typeorm";
// import createConnection from '../database'
// import { app } from '../app';
// import request from 'supertest'

// describe('SendMail', () => {
//   beforeAll( async () => {
//     const connection = await createConnection();
//     await connection.runMigrations();
//   });

//   afterAll(async () => {
//     const connection = getConnection();
//     await connection.dropDatabase();
//     await connection.close()
//   });

//   it('should be able to send mail and create a survey_users', async () => {
//     await request(app).post("/users")
//       .send({
//         email: "user2@example.com",
//         name: "User Example"
//       });

//     const survey = await request(app).post("/surveys")
//       .send({
//         title: "Title Example",
//         description: "Description Example"
//       });

//     const response = await request(app).post('/sendMail')
//       .send({
//         email: "user2@example.com",
//         survey_id: survey.body.id
//       })

    
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//   })


// });