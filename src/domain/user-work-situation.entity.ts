export enum UserWorkSituation {
  IN_OFFICE = 'IN_OFFICE',
  REMOTE = 'REMOTE',
  NOT_DEFINED = 'NOT_DEFINED',
}

export function userWorkSituationFromString(
  situation: string,
): UserWorkSituation {
  switch (situation) {
    case 'IN_OFFICE':
      return UserWorkSituation.IN_OFFICE;
    case 'REMOTE':
      return UserWorkSituation.REMOTE;
    case 'NOT_DEFINED':
      return UserWorkSituation.NOT_DEFINED;
    default:
      throw new Error('Unknown work situation');
  }
}
