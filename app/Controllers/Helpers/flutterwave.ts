import axios from "axios";
import Flutterwave from "flutterwave-node-v3";
import Env from '@ioc:Adonis/Core/Env'

const rave = new Flutterwave(Env.get('FLUTTERWAVE_PUB_KEY'), Env.get('FLUTTERWAVE_SEC_KEY'));

const config = (url: string, method: string, data: any = null): any => {
    // console.log('params', url, method, data)
    return {
        method,
        url: `${Env.get('FLUTTERWAVE_BASE_URL')}${url}`,
        headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${Env.get('FLUTTERWAVE_SEC_KEY')}`
        },
        data
    }
}


const initialize = async (data) => {
    // console.log('data', data)
    const res = await axios(config('/payments', 'POST', data))
    // console.log(res.data);
    return res.data;
}

const verifyTransaction = async (data) => {
    const res = await rave.Transaction.verify(data);
    // console.log('datan', res)
    return res;
}

const getTransactions = async () => {
    const res = await rave.Transaction.fetch({});
    console.log(res)
}

const transferFundsToBank = async (data) => {
    const res = await rave.Transfer.initiate(data);
    console.log('res', res)
    return res;
}


export {
    initialize, verifyTransaction, getTransactions, transferFundsToBank
};