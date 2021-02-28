import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import * as yup from 'yup';

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const schemaParams = yup.object().shape({
      value: yup.string().required(),
    });

    const schemaQuery = yup.object().shape({
      value: yup.string().required(),
    })

    try {
      await schemaParams.validate(request.params, { abortEarly: false });
      await schemaQuery.validate(request.query, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.errors)
    }
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    })

    if (!surveyUser) {
      throw new AppError("Survey User does not exists");
    }

    surveyUser.value = parseInt(value)

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
