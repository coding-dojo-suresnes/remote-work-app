export interface IRemoteWorkApp {
  isUserInOffice(username: string, date: Date): Promise<boolean>;
}
