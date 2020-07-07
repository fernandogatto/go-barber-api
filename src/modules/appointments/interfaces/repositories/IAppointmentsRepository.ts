import Appointment from '../../infra/typeorm/entities/Appoitment';

import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindInMonthFromProviderDTO from '../dtos/IFindInMonthFromProviderDTO';
import IFindInDayFromProviderDTO from '../dtos/IFindInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
