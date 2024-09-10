import { UserWorkSituation } from '../../domain';
import { UserWorkSituationRepository } from './user-work-situation.repository';

describe('UserWorkSituationRepository', () => {
  it('should retrieve NOT_DEFINED when no work situation was declared', async () => {
    const userWorkSituationRepository = new UserWorkSituationRepository();
    const today = new Date();
    const userWorkSituation =
      await userWorkSituationRepository.getUserWorkSituation('Toto', today);

    expect(userWorkSituation).toBe(UserWorkSituation.NOT_DEFINED);
  });
});
