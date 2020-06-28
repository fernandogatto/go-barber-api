import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/interfaces/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const keyProvider = `list-provider:${user_id}`;

    let users = await this.cacheProvider.recover<User[]>(keyProvider);

    if(!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(keyProvider, users);
    }

    return users;
  }
}

export default ListProvidersService;
