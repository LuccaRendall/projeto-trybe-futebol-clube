import { NextFunction, Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';
import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from './httpProtocols';

import TokenInterface from '../interfaces/TokenInterface';

// DOC: https://community.smartbear.com/t5/SwaggerHub-Questions/How-to-replace-quot-bearer-quot-in-Bearer-Authentication-with/td-p/207705
// DOC: https:// www.freecodecamp.org/portuguese/news/como-simplificar-e-deixar-limpa-a-validacao-de-entrada-na-aplicacao-do-express-js/
const ValidateMatch = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { homeTeam, awayTeam } = req.body;

  if (!authorization) {
    return res.status(UNAUTHORIZED).json(
      { message: 'Token must be a valid token' },
    );
  }

  if (homeTeam === awayTeam) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      message: 'It is not possible to create a match with two equal teams' });
  }

  // if (homeTeam === undefined || homeTeam === '' || awayTeam === undefined || awayTeam === '') {
  //   return res.status(404).json({ message: 'There is no team with such id' });
  // }

  try {
    JWT.verify(authorization, 'jwt_secret') as TokenInterface;
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Token must be a valid token' });
  }

  next();
};

export default ValidateMatch;
