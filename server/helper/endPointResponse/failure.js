const failure = (message, status) => {
    let response = {
        status,
        message
    }
    return response
}

export default failure;