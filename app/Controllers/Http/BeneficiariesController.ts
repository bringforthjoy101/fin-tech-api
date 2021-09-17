import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Beneficiary from "App/Models/Beneficiary";
// import User from "App/Models/User";
import {successResponse, errorResponse} from "App/Controllers/Helpers/handleResponse";
import { validate } from '../Helpers/validator';
export default class BeneficiariesController {
    public async allBeneficiaries({response}: HttpContextContract)
    {
        try {
            const beneficiaries = await Beneficiary.all();
            if(!beneficiaries.length)
            return successResponse(response, `No beneficiary available!`, []);
        return successResponse(response, `${beneficiaries.length} Beneficiar${beneficiaries.length>1 ?'ies':'y'} retrieved successfully!`, beneficiaries);
        } catch (error) {
            console.log(error);
            return errorResponse(response);
        }
    }

    public async updateBeneficiary({ request, params, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        try {
            const {id} = params;
            const {bank_name, bank_code, bank_account_name, bank_account_number} = request.body()
            const beneficiary = await Beneficiary.find(id);
            if (!beneficiary)
                return errorResponse(response, `Beneficiary with ID ${id} not found!`);
            
            const user_beneficiary_data = {
                bank_name: bank_name ? bank_name : beneficiary.bank_name,
                bank_code: bank_code ? bank_code : beneficiary.bank_code, 
                bank_account_name: bank_account_name ? bank_account_name : beneficiary.bank_account_name, 
                bank_account_number: bank_account_number ? bank_account_number : beneficiary.bank_account_number
            };
            if (await Beneficiary.query().where('id', id).update(user_beneficiary_data))
                return successResponse(response, `Beneficiary updated successfully!`);
            return; // 401
        } catch (error) {
            console.log(error);
            return errorResponse(response);
        }
        
    }

    public async addBeneficiary({ request, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        const {bank_name, bank_code, bank_account_name, bank_account_number, user_id} = request.body()
        try {
            const user_beneficiary_data = {
                userId: user_id,
                bank_name,
                bank_code, bank_account_name, bank_account_number
            };
            const beneficiary = await Beneficiary.create(user_beneficiary_data);
            return successResponse(response, `Beneficiary created successfully!`, beneficiary);
        } catch (error) {
            console.log(error);
            return errorResponse(response);
        }
        
    }

    public async deleteBeneficiary({request, response}: HttpContextContract)
    {
        await validate(request) // handle data validation
        const {id} = request.body();
        try {
            const beneficiary = await Beneficiary.query().where('id', id);
            if(!beneficiary.length)
                return errorResponse(response, `Beneficiary with ID ${id} not found!`);

            await Beneficiary.query().where('id', id).delete();
            return successResponse(response, `Beneficiary deleted successfully!`);
        } catch (error) {
            console.log(error);
            return errorResponse(response);
        }
    }

    public async userBeneficiaries({params, response}: HttpContextContract)
    {
        const {user_id} = params;
        try {
            const beneficiaries = await Beneficiary.query().where("user_id", user_id);
        if(!beneficiaries.length)
            return successResponse(response, `No beneficiary available!`, []);
        return successResponse(response, `${beneficiaries.length} Beneficiar${beneficiaries.length>1 ?'ies':'y'} retrieved successfully!`, beneficiaries);
        } catch (error) {
            console.log(error)
            return errorResponse(response);
        }
    }
}
