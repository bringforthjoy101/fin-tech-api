import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Transfer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public transaction_id: string

  @column()
  public amount: number

  @column()
  public narration: string

  @column()
  public sender_name: string

  @column()
  public sender_email: string

  @column()
  public receiver_name: string

  @column()
  public receiver_email: string

  @column()
  public status: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
