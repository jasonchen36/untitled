var questionsModel = {};

questionsModel.getFilingForData = function(){
    return [
        {
            category_id: 0,
            has_multiple_answers: 0,
            id: 9999,
            instructions: 'Are you filing for yourself guy?',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9999,
            text: 'Myself',
            type: 'Choice'
        },
        {
            category_id: 0,
            has_multiple_answers: 0,
            id: 9998,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9998,
            text: 'My Spouse/Partner',
            type: 'Choice'
        },
        {
            category_id: 0,
            has_multiple_answers: 0,
            id: 9997,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9997,
            text: 'Other Person/People',
            type: 'Choice'
        }
    ]
};

module.exports = questionsModel;