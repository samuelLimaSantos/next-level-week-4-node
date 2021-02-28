import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const schema = yup.object().shape({
      survey_id: yup.string().required('Survey_id é obrigatório!'),
    });

    try {
      await schema.validate(request.params, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.errors)
    }

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      where: { survey_id, value: Not(IsNull())}
    });

    const detractors = surveysUsers.filter(survey => 
      (survey.value >= 0 && survey.value <= 6)
    ).length;

    const promoters = surveysUsers.filter(survey => 
      (survey.value >= 9 && survey.value <= 10)
    ).length;

    const passives = surveysUsers.filter(survey => 
      (survey.value >= 7 && survey.value <= 8)
    ).length;

    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
    })

  }
}


export { NpsController };