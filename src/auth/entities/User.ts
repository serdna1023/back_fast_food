export class User {
  constructor(
    public readonly id: string,
    public readonly restaurantId: string,
    public readonly username: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly roles: string[] = [],
    public readonly active: boolean = true
  ) {}
}
