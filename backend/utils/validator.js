function validatePayment(data){
    if(!data.event_id){
        return "event_id wajib diisi";
    }

    if(!data.payment_amount){
        return "payment_amount wajib diisi";
    }

    if(isNaN(data.payment_amount)){
        return "payment_amount harus berupa angka";
    }

    if(!data.payment_date){
        return "payment_date wajib diisi";
    }

    if(data.payment_method && typeof data.payment_method !== "string"){
        return "payment_method harus berupa text";
    }

    if(data.payment_type && typeof data.payment_type !== "string"){
        return "payment_type harus berupa text";
    }

    return null;
}

function validateId(id){
    if(!id || isNaN(id)){
        return "ID tidak valid";
    }
    return null;
}

module.exports = {
    validatePayment,
    validateId
};