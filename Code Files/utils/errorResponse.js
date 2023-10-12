class ErrorResponse {
    constructor(error) {
        this.error = error
    }

    getResponse(){
        if(this.error.code === 'ER_DUP_ENTRY') {
            return {
                error: this.error.message
            }
        }
        if(this.error.sqlState && this.error.sqlState.startsWith('230')){
            return {
                error: 'IDs are incorrect or does not exist'
            }
        }
        return {
            error: this.error.message
        }
    }
}

module.exports = ErrorResponse