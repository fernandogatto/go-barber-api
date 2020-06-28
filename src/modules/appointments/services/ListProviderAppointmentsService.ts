import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appoitment';

import IAppointmentsRepository from '../interfaces/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/providers/CacheProvider/interfaces/ICacheProvider';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const keyAppointment = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      keyAppointment,
    );

    if(!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
      });

      await this.cacheProvider.save(keyAppointment, appointments);
    }


    return appointments;
  }
}

export default ListProviderAppointmentsService;
