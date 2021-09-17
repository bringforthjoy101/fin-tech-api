import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction";
import PaymentLog from "App/Models/PaymentLog";
import { initialize, verifyTransaction, transferFundsToBank } from "App/Controllers/Helpers/flutterwave"
import { updateWallet } from "App/Controllers/Helpers/payments"
import {successResponse, errorResponse} from "App/Controllers/Helpers/handleResponse";
import Env from '@ioc:Adonis/Core/Env'
import Beneficiary from 'App/Models/Beneficiary';
import Withdrawal from 'App/Models/Withdrawal';
import User from 'App/Models/User';
import Transfer from 'App/Models/Transfer';
import { validate } from '../Helpers/validator';

export default class TransactionsController {
    public async allTransactions({response}: HttpContextContract)
    {   
        try {
            // get all transactions
            const transactions = await Transaction.all();
        // if transction record is more than 0
        if(!transactions.length)
            return successResponse(response, `No transaction available!`, []);
        return successResponse(response, `${transactions.length} Transaction${transactions.length>1 ?'s':''} retrieved successfully!`, transactions);
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }
    }
    public async singleTransaction({params, response}: HttpContextContract)
    {
        try {
            // get id from params and store as variables
            const {id} = params;
            // find transaction
            const transaction = await Transaction.find(id);
            if(!transaction)
                return errorResponse(response, `Transaction with ID ${id} not found!`);
            await transaction.preload('user')
            return successResponse(response, 'Operation successfull', transaction);
            
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }

    }

    public async initializeTransaction({ request, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        try {
            // get all request body and store as variables
            const {amount, user_id} = request.body();

            // check if user exists
            const userExists = await User.query().where('id', user_id).first();
            if (!userExists)
                return errorResponse(response, `User with ID ${user_id} not found`);

            const transaction_id = Math.floor((Math.random() * 1000000000) + 1).toString(16);

            // logging payment transactions
            const payment_log_data = {email: userExists.email, reference: transaction_id, status: 'init', userId: userExists.id}
            await PaymentLog.create(payment_log_data);

            // payload for third party API (flutterwave)
            const data = {
                tx_ref: transaction_id,
                amount,
                currency: "NGN",
                redirect_url: `${Env.get('FIN_TECH_API_BASE_URL')}/transactions/verify`,
                payment_options: 'card',
                meta: {
                    consumer_id: userExists.id
                },
                customer: {
                    email: userExists.email,
                    phonenumber: userExists.phone,
                    name: `${userExists.first_name} ${userExists.last_name}`
                },
                customizations: {
                    title: "Fin Tech Project",
                    description: "Fund your wallet",
                    logo: Env.get('FIN_TECH_LOGO')
                }
            }
            const res = await initialize(data);
            if (res.status === 'success')
                return successResponse(response, res.message, {transaction_ref: transaction_id, link: res.data.link});
            return errorResponse(response, res.message);
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }
        
    }

    public async verifyTransaction({request, response}: HttpContextContract)
    {
        // get all query params from the hook
        const reference = request.qs().tx_ref;
        const {transaction_id} = request.qs();
        const {status} = request.qs();

        if (status === 'cancelled') {
            // logs payment transaction
            await PaymentLog.query().where('reference', reference).update({ status });
            return response.status(200).send('');
        }

        try {
            const payload = { id: transaction_id }
            const res = await verifyTransaction(payload);
            console.log('res', res)
            if (res.status === 'error')
                return errorResponse(response, 'Transaction could not be verified!');

            const transaction_previously_verified = await PaymentLog.query().where('status', 'success').where('transaction_id', transaction_id);

            // if transaction was previously verified, stop the verification operation and return a response
            if (transaction_previously_verified.length > 0)
              return response.status(200).send('');
            
            await PaymentLog.query().where('reference', reference).update({ status: res.status, transaction_id });

            const user_data = { id: res.data.meta.consumer_id, email: res.data.customer.email }

            const wallet_data = {
              user_id: user_data.id,
              transaction_id: res.data.id,
              amount: res.data.amount,
              ref: user_data.email,
              narration: "Funding wallet",
              status: res.status,
              type: "credit"
            }

            // update wallet by credit
            const walletUpdated = await updateWallet(wallet_data)
            if (walletUpdated) {
              return response.status(200).send('');
            }
          } catch (error) {
            console.log(error)
            return errorResponse(response, `An error occured:- ${error.message}`);
          }
    } 

    public async withdrawFundsToBeneficiary({ request, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        try {
            // get all request body and store as variables
            const {beneficiary_id, amount, narration, user_id} = request.body();

            // check if beneficiary exists
            const beneficiaryExists = await Beneficiary.query().where('id', beneficiary_id).first();
            if (!beneficiaryExists)
                return errorResponse(response, `Beneficary with ID ${beneficiary_id} not found`);

            // get all beneficiary data and store as variables
            const {bank_code, bank_name, bank_account_name, bank_account_number} = beneficiaryExists;
            const transaction_id = `transfer-${Math.floor((Math.random() * 1000000000) + 1).toString(16)}`
            const data = {
                account_bank: bank_code,
                account_number: bank_account_number,
                amount,
                narration: narration ? narration : 'Funds Withdrawal',
                currency: "NGN",
                reference: transaction_id,
                callback_url: `${Env.get('FIN_TECH_API_BASE_URL')}/transactions/verify-withdrawal`,
                debit_currency: "NGN"
            }

            const wallet_data = {
                user_id,
                transaction_id,
                amount,
                ref: bank_account_number,
                narration,
                status: 'success',
                type: "debit"
            }
            const walletUpdated = await updateWallet(wallet_data);
            if (walletUpdated) {
                const res = await transferFundsToBank(data); // process transfer of funds to bank via third party API (flutterwave)
                const transfer_data = {
                    userId:user_id,
                    transaction_id,
                    amount,
                    narration,
                    bank_name,
                    bank_account_name,
                    bank_account_number,
                    bank_code,
                    status: res.status
                };

                // log withdrawal transaction
                await Withdrawal.create(transfer_data);
                return successResponse(response, 'Transfer successfully queued');
            } else {
                errorResponse(response);
            }
        } catch (error) {
            console.log(error)
            return errorResponse(response, `An error occured:- ${error.message}`);
        }
    }

    public async verifyWithdrawalTransaction({request, response, params}: HttpContextContract)
    {
        console.log('body', request.body());
        console.log('query params', request.qs());
        console.log('path params', params);
        return response.status(200).send('');
    }

    public async transferFundsToUser({ request, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        try {
            // get all request body and store as variables
            const {receiver_email, amount, narration, user_id} = request.body();

            // check if user exists
            const userExists = await User.query().where('id', user_id).first();
            if (!userExists)
                return errorResponse(response, `User with ID ${user_id} not found`);

            // checks if receiver exsits
            const receiverExists = await User.query().where('email', receiver_email).first();
            if (!receiverExists)
                return errorResponse(response, `Receiver with email ${receiver_email} not found`);

            const transaction_id = `transfer-${Math.floor((Math.random() * 1000000000) + 1).toString(16)}`

            // wallet data to be operated on
            const wallet_data = {
                user_id,
                transaction_id,
                amount,
                ref: receiver_email,
                narration,
                status: 'success',
                type: 'debit'
            }

            // Debit sender wallet
            const walletUpdated = await updateWallet(wallet_data)
            if (walletUpdated) {
                // Credit receiver wallet
                await updateWallet({...wallet_data, user_id: receiverExists.id, type: 'credit'});
                const transfer_data = {
                    sender_name: `${userExists.first_name} ${userExists.last_name}`,
                    sender_email: userExists.email,
                    receiver_name:`${receiverExists.first_name} ${receiverExists.last_name}`, 
                    receiver_email,
                    amount,
                    narration: narration ? `Transfer funds from ${userExists.first_name} ${userExists.last_name} to ${receiverExists.first_name} ${receiverExists.last_name} | ${narration}` : `Transfer funds from ${userExists.first_name} ${userExists.last_name} to ${receiverExists.first_name} ${receiverExists.last_name}`,
                    status: 'success',
                    transaction_id
                }
                // Log transfer transaction
                await Transfer.create(transfer_data);
                return successResponse(response, 'Funds successfully sent');
            } else {
                return errorResponse(response);
            }
        } catch (error) {
            console.log(error)
            return errorResponse(response, `An error occured:- ${error.message}`);
        }
    }

    public async userTransactions({params, response}: HttpContextContract)
    {
        const {user_id} = params;
        try {
            // get list of all transactions by user_id
            const transactions = await Transaction.query().where("user_id", user_id);
        if(!transactions.length)
            return successResponse(response, `No transaction available!`, []);
        return successResponse(response, `${transactions.length} Transaction${transactions.length>1 ?'s':''} retrieved successfully!`, transactions);
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }
    }
}
