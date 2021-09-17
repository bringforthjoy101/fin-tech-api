import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { successResponse, errorResponse } from "../Helpers/handleResponse";
import { validate } from 'App/Controllers/Helpers/validator';

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    await validate(request); // handle data validation
    const {email, password} = request.body();
    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "10 days",
      });
      return successResponse(response, 'Login successfull', token.toJSON());
    } catch (error) {
      console.log(error);
      return errorResponse(response);
    }
  }
  public async register({ request, auth, response }: HttpContextContract) {
    await validate(request); // handle data validation
    const {email, password, first_name, last_name, phone} = request.body();
    try {
      const user = await User.query().where('email', email);
      if(user.length)
        return errorResponse(response, `User with email ${email} already exists, pls sign in!`);
      await User.create({email, password, first_name, last_name, wallet: 0, phone});
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "10 days",
      });
      return successResponse(response, 'Registration successfull', token.toJSON());
    } catch (error) {
      console.log(error);
      return errorResponse(response);
    }
  }
}