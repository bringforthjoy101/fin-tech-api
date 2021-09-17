
const successResponse = (response: any, message: string, data: any = []): any => {
    return response.status(200).json({ success: true, message, data });
}

const errorResponse = (response: any, message: string = 'Oops! an error occured'): any => {
    return response.status(400).json({ success: false, message });
}

const customResponse = (response: any, statusCode: number, success: string, message: string, data: any = []): any => {
    return response.status(statusCode).json({ success, message, data });
}

export { successResponse, errorResponse, customResponse }