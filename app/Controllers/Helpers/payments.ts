import Transaction from "App/Models/Transaction";
import User from "App/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'

const updateWallet = async (data) => {
  const { transaction_id, user_id, amount, type, ref, status, narration } = data;
    let balance
    if (type == "credit") {
      const sql = `UPDATE users SET wallet = (users.wallet + ?) WHERE id = ?`;
      try {
        await Database.rawQuery(sql, [Number(amount), user_id]);
        balance = await userWalletBalance(user_id);
      } catch (error) {
        console.log(error);
        return false
      }
    } else {
      const sql = `UPDATE users SET wallet = (users.wallet - ?) WHERE id = ?`;
      try {
        await Database.rawQuery(sql, [Number(amount), user_id]);
        balance = await userWalletBalance(user_id);
      } catch (error) {
        console.log(error);
        return false
      }
    }
    
    const users_transactions_data = {
      userId:user_id,
      transaction_id,
      type, ref, status,
      narration,
      amount,
      balance,
    };
    const transaction = await Transaction.create(users_transactions_data);
    if (transaction)
      return true
};

  const userWalletBalance = async (userId) => {
    const user = await User.find(userId);
    return user?.wallet
  }

  export { updateWallet, userWalletBalance }