import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transfers extends BaseSchema {
  protected tableName = 'transfers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_id', 255)
      table.integer('amount').notNullable()
      table.string('narration', 255).notNullable()
      table.string('sender_name', 255).notNullable()
      table.string('sender_email', 255).notNullable()
      table.string('receiver_name', 255).notNullable()
      table.string('receiver_email', 255).notNullable()
      table.string('status', 255).notNullable()
      table.integer('user_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
