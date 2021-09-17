import { DateTime } from 'luxon';
import User from "App/Models/User";
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public transaction_id: string

  @column()
  public type: string

  @column()
  public narration: string

  @column()
  public amount: number

  @column()
  public balance: number

  @column()
  public ref: string

  @column()
  public status: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
