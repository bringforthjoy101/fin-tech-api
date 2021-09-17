import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {successResponse, errorResponse} from "App/Controllers/Helpers/handleResponse";

export default class UsersController {
    public async beneficiariesByUser({ auth, response }: HttpContextContract) {
        try {
            const user = await auth.authenticate();
            await user.preload("beneficiaries");
            const {beneficiaries} = user;
            if(!beneficiaries.length)
                return successResponse(response, `No beneficiary available!`, []);
            return successResponse(response, `${beneficiaries.length} Beneficiar${beneficiaries.length>1 ?'ies':'y'} retrieved successfully!`, beneficiaries);
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }
        
      }
    
      public async transactionsByUser({ auth, response }: HttpContextContract) {
        const user = await auth.authenticate();
        await user.preload("transactions");
        const transactions = user.transactions;
        return successResponse(response, `Beneficiary created successfully!`, transactions);
        return transactions;
      }
    
      public async userWallet({ auth }: HttpContextContract) {
        const user = await auth.authenticate();
        const wallet = user.wallet;
        return wallet;
      }
}
