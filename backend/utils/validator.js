function validatePayment(data){
    const allowedPaymentTypes = ["booking_fee", "down_payment", "installment", "final_payment"];
    const allowedPaymentStatuses = ["pending", "confirmed", "rejected"];

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

    if(data.payment_type && !allowedPaymentTypes.includes(data.payment_type)){
        return "payment_type tidak valid";
    }

    if(data.status && !allowedPaymentStatuses.includes(data.status)){
        return "status payment tidak valid";
    }

    if(data.receipt_note && typeof data.receipt_note !== "string"){
        return "receipt_note harus berupa text";
    }

    if(data.proof_of_payment && typeof data.proof_of_payment !== "string"){
        return "proof_of_payment harus berupa text";
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
