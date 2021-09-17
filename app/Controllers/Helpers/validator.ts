import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const validate = async (request) => {
  const route = request.url();
  console.log('route', route);

  if(route === '/api/register') {
    const {email, password, first_name, last_name, phone} = request.body();
      await validator.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string(),
          first_name: schema.string(),
          last_name: schema.string(),
          phone: schema.string(),
        }),
        data: { email, password, first_name, last_name, phone },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/login') {
    const {email, password} = request.body();
      await validator.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string()
        }),
        data: { email, password },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/transactions/initialize') {
    const {amount, user_id} = request.body();
      await validator.validate({
        schema: schema.create({
          amount: schema.number(),
          user_id: schema.number()
        }),
        data: { amount: Number(amount), user_id: Number(user_id) },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/transactions/withdraw') {
    const {beneficiary_id, amount, narration, user_id} = request.body();
      await validator.validate({
        schema: schema.create({
          beneficiary_id: schema.number(),
          amount: schema.number(),
          narration: schema.string(),
          user_id: schema.number()
        }),
        data: { beneficiary_id: Number(beneficiary_id), amount: Number(amount), narration, user_id: Number(user_id) },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/transactions/transfer') {
    const {receiver_email, amount, narration, user_id} = request.body();
    await validator.validate({
      schema: schema.create({
        receiver_email: schema.number(),
        amount: schema.number(),
        narration: schema.string(),
        user_id: schema.number()
      }),
      data: { receiver_email: Number(receiver_email), amount: Number(amount), narration, user_id: Number(user_id) },
      messages: {
        '*': (field, rule) => {
          return `${rule} validation error on ${field}`
        }
      }
    })
  } else if (route === '/api/beneficiaries') {
    const {bank_name, bank_code, bank_account_name, bank_account_number, user_id} = request.body();
      await validator.validate({
        schema: schema.create({
          bank_name: schema.string(),
          bank_code: schema.string(),
          bank_account_name: schema.string(),
          bank_account_number: schema.string(),
          user_id: schema.number()
        }),
        data: { bank_name, bank_code, bank_account_name, bank_account_number, user_id: Number(user_id) },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/beneficiaries/update') {
    const {bank_name, bank_code, bank_account_name, bank_account_number} = request.body();
      await validator.validate({
        schema: schema.create({
          bank_name: schema.string(),
          bank_code: schema.string(),
          bank_account_name: schema.string(),
          bank_account_number: schema.string()
        }),
        data: { bank_name, bank_code, bank_account_name, bank_account_number },
        messages: {
          '*': (field, rule) => {
            return `${rule} validation error on ${field}`
          }
        }
      })
  } else if (route === '/api/beneficiaries/delete') {
    const {id} = request.body();
    await validator.validate({
      schema: schema.create({
        receiver_email: schema.number(),
        amount: schema.number(),
        narration: schema.string(),
        user_id: schema.number()
      }),
      data: { id },
      messages: {
        '*': (field, rule) => {
          return `${rule} validation error on ${field}`
        }
      }
    })
  } else {
    const {id} = request.body();
    await validator.validate({
      schema: schema.create({
        receiver_email: schema.number(),
        amount: schema.number(),
        narration: schema.string(),
        user_id: schema.number()
      }),
      data: { id },
      messages: {
        '*': (field, rule) => {
          return `${rule} validation error on ${field}`
        }
      }
    })
  }

  // switch (route) {
  //   // Auth Routes
  //   case '/api/register':{
  //     const {email, password, first_name, last_name, phone} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         email: schema.string({}, [rules.email()]),
  //         password: schema.string(),
  //         first_name: schema.string(),
  //         last_name: schema.string(),
  //         phone: schema.string(),
  //       }),
  //       data: { email, password, first_name, last_name, phone },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }
      
  //   case '/api/login': {
  //     const {email, password} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         email: schema.string({}, [rules.email()]),
  //         password: schema.string()
  //       }),
  //       data: { email, password },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/transactions/initialize': {
  //     const {amount, user_id} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         amount: schema.number(),
  //         user_id: schema.number()
  //       }),
  //       data: { amount: Number(amount), user_id: Number(user_id) },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/transactions/withdraw': {
  //     const {beneficiary_id, amount, narration, user_id} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         beneficiary_id: schema.number(),
  //         amount: schema.number(),
  //         narration: schema.string(),
  //         user_id: schema.number()
  //       }),
  //       data: { beneficiary_id: Number(beneficiary_id), amount: Number(amount), narration, user_id: Number(user_id) },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/transactions/transfer': {
  //     const {receiver_email, amount, narration, user_id} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         receiver_email: schema.number(),
  //         amount: schema.number(),
  //         narration: schema.string(),
  //         user_id: schema.number()
  //       }),
  //       data: { receiver_email: Number(receiver_email), amount: Number(amount), narration, user_id: Number(user_id) },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/beneficiaries': {
  //     const {bank_name, bank_code, bank_account_name, bank_account_number, user_id} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         bank_name: schema.string(),
  //         bank_code: schema.string(),
  //         bank_account_name: schema.string(),
  //         bank_account_number: schema.string(),
  //         user_id: schema.number()
  //       }),
  //       data: { bank_name, bank_code, bank_account_name, bank_account_number, user_id: Number(user_id) },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/beneficiaries/update': {
  //     const {bank_name, bank_code, bank_account_name, bank_account_number} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         bank_name: schema.string(),
  //         bank_code: schema.string(),
  //         bank_account_name: schema.string(),
  //         bank_account_number: schema.string()
  //       }),
  //       data: { bank_name, bank_code, bank_account_name, bank_account_number },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }

  //   case '/api/beneficiaries/delete': {
  //     const {id} = request.body();
  //     await validator.validate({
  //       schema: schema.create({
  //         receiver_email: schema.number(),
  //         amount: schema.number(),
  //         narration: schema.string(),
  //         user_id: schema.number()
  //       }),
  //       data: { id },
  //       messages: {
  //         '*': (field, rule) => {
  //           return `${rule} validation error on ${field}`
  //         }
  //       }
  //     })
  //   }
  // }
}

export {validate}