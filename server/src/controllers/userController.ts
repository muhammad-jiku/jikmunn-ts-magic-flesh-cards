import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import createHttpError from 'http-errors';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    console.log('getAuthenticatedUser...', req.session);
    const user = await UserModel.findById(req.session.userId)
      .select('+email')
      .exec();
    console.log('first user found', user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// sign up
interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  console.log('info', username, email, passwordRaw);

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, 'Parameters missing');
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    console.log('existing username', existingUsername);

    if (existingUsername) {
      throw createHttpError(
        409,
        'Username already taken. Please choose a different one or log in instead.'
      );
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();
    console.log('existing email', existingEmail);
    if (existingEmail) {
      throw createHttpError(
        409,
        'A user with this email address already exists. Please log in instead.'
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;
    console.log('user session id..', req.session.userId);
    console.log('console new user...', newUser);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// sign in
interface SignInBody {
  username?: string;
  password?: string;
}

export const signIn: RequestHandler<
  unknown,
  unknown,
  SignInBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, 'Parameters missing');
    }

    const user = await UserModel.findOne({ username: username })
      .select('+password +email')
      .exec();

    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid credentials');
    }
    console.log(user._id);
    console.log('..');
    req.session.userId = user._id;

    console.log(req.session);
    console.log(req.session.userId);
    console.log('-----------------');
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// sign out
export const signOut: RequestHandler = (req, res, next) => {
  console.log('sign out session ', req.session);
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
