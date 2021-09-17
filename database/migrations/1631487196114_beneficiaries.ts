import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Beneficiaries extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('bank_name', 255).notNullable()
      table.string('bank_code', 255).notNullable()
      table.string('bank_account_name', 255).notNullable()
      table.string('bank_account_number', 255).notNullable()
      table.integer('user_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
