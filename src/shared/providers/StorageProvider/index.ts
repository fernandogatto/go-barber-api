import { container } from 'tsyringe';

import IStorageProvider from './interfaces/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';

const providers = {
  disk: DiskStorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  providers.disk,
);
