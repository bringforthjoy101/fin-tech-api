import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_id', 255).notNullable()
      table.string('type', 255).notNullable()
      table.string('narration', 255).notNullable()
      table.integer('amount').notNullable()
      table.integer('balance').notNullable()
      table.string('ref', 255).notNullable()
      table.string('status', 255).notNullable()
      table.integer('user_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
