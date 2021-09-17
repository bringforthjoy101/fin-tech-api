import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Withdrawal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public transaction_id: string

  @column()
  public amount: number

  @column()
  public narration: string

  @column()
  public bank_name: string

  @column()
  public bank_code: string

  @column()
  public bank_account_name: string

  @column()
  public bank_account_number: string

  @column()
  public status: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
