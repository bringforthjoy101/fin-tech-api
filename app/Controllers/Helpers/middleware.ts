import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import {errorResponse} from "App/Controllers/Helpers/handleResponse";
import {userWalletBalance} from "App/Controllers/Helpers/payments";

const checkBalance = async ({request, response}: HttpContextContract, next) => {
    const {amount, user_id} = request.body()
    const walletBalance: number | undefined = await userWalletBalance(user_id);
    switch (1) {
        case Math.sign(amount):
            if (amount > Number(walletBalance) )
                return errorResponse(response, 'Insufficient fund in wallet!');
            await next();
            break;
        default:
            return errorResponse(response, 'Value cannot be zero or negative!');
    }
}

const userExists = async ({request, response}: HttpContextContract, next) => {
    const {user_id} = request.body();
    const user = await User.query().where('id', user_id).first();
    if (!user)
        return errorResponse(response, `User with ID ${user_id} not found`);
    await next();
}

export { checkBalance, userExists }