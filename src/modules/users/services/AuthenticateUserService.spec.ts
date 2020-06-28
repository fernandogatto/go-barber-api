import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateAppointment: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateAppointment = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Spaceman',
      email: 'spaceman@email.com',
      password: '123456'
    });

    const response = await authenticateAppointment.execute({
      email: 'spaceman@email.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateAppointment.execute({
      email: 'spaceman@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Spaceman',
      email: 'spaceman@email.com',
      password: '123456'
    })

    await expect(authenticateAppointment.execute({
      email: 'spaceman@email.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError);
  });
});
