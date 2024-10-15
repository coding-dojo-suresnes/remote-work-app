import { UserId } from '../../domain/user-id.value-object';
import { UserEntity } from '../../domain/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let sut: UserRepository;

  beforeEach(() => {
    sut = new UserRepository();
  });
  describe('getUserByUsername', () => {
    it('Should return null when user does not exist', () => {
      const res = sut.getUserByUsername('DO NOT EXIST');
      expect(res).toBe(null);
    });
  });
  describe('getUserById', () => {
    it('Should return null when user does not exist', () => {
      const res = sut.getUserById(new UserId('1'));
      expect(res).toBe(null);
    });
    it('Should return user when user exists', () => {
      sut.persistUser(new UserEntity('TestUser', new UserId('1')));
      const res = sut.getUserById(new UserId('1'));
      expect(res?.username).toBe('TestUser');
    });
  });
  describe('persistUser', () => {
    it('Should persist a new user and retrieve it ', () => {
      // Arrange
      const username = 'wayglem';
      const user = new UserEntity(username);

      // Act
      sut.persistUser(user);

      // Assert
      const result = sut.getUserByUsername(username);
      expect(result).not.toBe(null);
      expect(result?.username).toEqual(username);
      expect(result?.id.value).toEqual(user.id.value);
    });
    it('Should replace a user when they already exists in database', () => {
      // Arrange
      const username = 'wayglem';
      const user = new UserEntity(username);
      user.firstName = 'oldName';
      user.lastName = 'oldLastName';
      sut.persistUser(user);

      const newUser = new UserEntity(username, user.id);
      newUser.firstName = 'newName';
      newUser.lastName = 'newLastName';

      // Act
      sut.persistUser(newUser);

      // Assert
      const found = sut.getUserByUsername(username);
      expect(found).not.toBe(null);
      expect(found?.username).toEqual(username);
      expect(found?.id.value).toEqual(user.id.value);
      expect(found?.id.value).toEqual(newUser.id.value);
      expect(found?.firstName).toEqual('newName');
      expect(found?.lastName).toEqual('newLastName');
    });
  });
});
