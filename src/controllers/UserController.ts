import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

export class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email('Formato inválido').required('E-mail é obrigatório!'),
    });

    // if (!(await schema.isValid(request.body))){
    //   throw new AppError('Validations Failed!')
    // }

    try {
      await schema.validate(request.body, {abortEarly: false});
    } catch (error) {
      throw new AppError(error.errors);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      where: {
        email
      }
    });

    if (userAlreadyExists) throw new AppError('User already exists');

    const user = usersRepository.create({
      name,
      email,
    })

    await usersRepository.save(user);

    return response.status(201).json({ message: `User created`});
  }
}