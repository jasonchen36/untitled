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

questionsModel.getMaritalStatusData = function(){
    return [
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8889,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8889,
            text: 'Married',
            type: 'Choice'
        },
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8888,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8888,
            text: 'Divorced',
            type: 'Choice'
        },
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8887,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8887,
            text: 'Separated',
            type: 'Choice'
        },
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8886,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8886,
            text: 'Widowed',
            type: 'Choice'
        },
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8885,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8885,
            text: 'Common Law',
            type: 'Choice'
        },
        {
            category_id: 7,
            has_multiple_answers: 0,
            id: 8884,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 8884,
            text: 'Single',
            type: 'Choice'
        }
    ]
};

module.exports = questionsModel;