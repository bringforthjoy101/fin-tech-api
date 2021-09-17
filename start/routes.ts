/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import {checkBalance, userExists} from 'App/Controllers/Helpers/middleware'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");

  // Transactions Routes
  Route.group(() => {
    Route.get("/", "TransactionsController.allTransactions");
    Route.post("initialize", "TransactionsController.initializeTransaction");
    Route.get("id/:id", "TransactionsController.singleTransaction");
    Route.get("verify", "TransactionsController.verifyTransaction");
    Route.get("verify-withdrawal", "TransactionsController.verifyWithdrawalTransaction");
    Route.post("withdraw", "TransactionsController.withdrawFundsToBeneficiary").middleware(userExists).middleware(checkBalance);
    Route.post("transfer", "TransactionsController.transferFundsToUser").middleware(userExists).middleware(checkBalance);
    Route.get("user/:user_id", "TransactionsController.userTransactions");
  }).prefix("transactions");

  // Beneficiaries Routes
  Route.group(() => {
    Route.get("/", "BeneficiariesController.allBeneficiaries");
    Route.post("/", "BeneficiariesController.addBeneficiary").middleware(userExists);
    Route.post("/update", "BeneficiariesController.updateBeneficiary");
    Route.post("/delete", "BeneficiariesController.allBeneficiaries");
    Route.get("/user/:user_id", "BeneficiariesController.userBeneficiaries");
  }).prefix("beneficiaries");

  Route.group(() => {
    Route.get("/", "UsersController.allWallets");
    Route.get("/user/:user_id", "UsersController.userWallet");
  }).prefix("wallets");

  // Protected Routes
  Route.group(() => {
    // Routes goes here
  }).middleware("auth:api");
}).prefix("api");
