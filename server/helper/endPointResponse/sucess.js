const sucess = (message, status, data) => {
    let response = {
        status,
        message, 
        data
    }
    return response
}

export default sucess;