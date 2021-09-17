import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PaymentLogs extends BaseSchema {
  protected tableName = 'payment_logs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_id', 255)
      table.string('email', 255).notNullable()
      table.string('reference', 255).notNullable()
      table.string('status', 255).notNullable()
      table.integer('user_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
