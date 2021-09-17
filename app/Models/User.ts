import { DateTime } from 'luxon'
import Beneficiary from 'App/Models/Beneficiary';
import Transaction from 'App/Models/Transaction';
import PaymentLog from 'App/Models/PaymentLog';
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public phone: string

  @column()
  public wallet: number

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Beneficiary)
  public beneficiaries: HasMany<typeof Beneficiary>;

  @hasMany(() => Transaction)
  public transactions: HasMany<typeof Transaction>;

  @hasMany(() => PaymentLog)
  public paymentLogs: HasMany<typeof PaymentLog>;

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
