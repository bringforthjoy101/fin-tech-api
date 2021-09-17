import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Withdrawals extends BaseSchema {
  protected tableName = 'withdrawals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_id', 255)
      table.integer('amount').notNullable()
      table.string('narration').notNullable()
      table.string('bank_name', 255).notNullable()
      table.string('bank_code', 255).notNullable()
      table.string('bank_account_number', 255).notNullable()
      table.string('bank_account_name', 255).notNullable()
      table.string('status', 255).notNullable()
      table.integer('user_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
