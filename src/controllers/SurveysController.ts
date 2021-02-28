import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required('Título é obrigatório'),
      description: yup.string().required('Descrição é obrigatória'),
    });

    try{
      await schema.validate(request.body, { abortEarly: false });
    } catch(error) {
      throw new AppError(error.errors);
    }

    const surveyRepository = getCustomRepository(SurveysRepository);

    const survey = surveyRepository.create({
      title,
      description
    });

    await surveyRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request,  response: Response) {
    const surveyRepository = getCustomRepository(SurveysRepository);

    const allSurveys = await surveyRepository.find();

    return response.json(allSurveys);
  }
}

export { SurveysController }