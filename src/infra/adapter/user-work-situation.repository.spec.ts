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
  it('should save and retrieve the user work situation', async () => {
    const userWorkSituationRepository = new UserWorkSituationRepository();
    const today = new Date();

    // act
    userWorkSituationRepository.saveUserWorkSituation(
      'Toto',
      today,
      UserWorkSituation.IN_OFFICE,
    );
    const userWorkSituation =
      await userWorkSituationRepository.getUserWorkSituation('Toto', today);

    // assert
    expect(userWorkSituation).toBe(UserWorkSituation.IN_OFFICE);
  });
});
