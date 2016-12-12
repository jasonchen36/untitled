var questionsModel = {};

questionsModel.getFilingForData = function(){
    return [
        {
            category_id: 90,
            has_multiple_answers: 0,
            id: 9901,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9901,
            text: 'Myself',
            type: 'Choice'
        },
        {
            category_id: 90,
            has_multiple_answers: 0,
            id: 9002,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9002,
            text: 'My Spouse/Partner',
            type: 'Choice'
        },
        {
            category_id: 90,
            has_multiple_answers: 0,
            id: 9003,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9003,
            text: 'Other Person/People',
            type: 'Choice'
        }
    ]
};

questionsModel.getMaritalStatusData = function(){
    return [
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9101,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9101,
            text: 'Married',
            type: 'Choice'
        },
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9102,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9102,
            text: 'Divorced',
            type: 'Choice'
        },
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9103,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9103,
            text: 'Separated',
            type: 'Choice'
        },
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9104,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9104,
            text: 'Widowed',
            type: 'Choice'
        },
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9105,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9105,
            text: 'Common Law',
            type: 'Choice'
        },
        {
            category_id: 91,
            has_multiple_answers: 0,
            id: 9106,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9106,
            text: 'Single',
            type: 'Choice'
        }
    ]
};

questionsModel.getDependentsData = function(){
    return [
        {
            category_id: 92,
            has_multiple_answers: 0,
            id: 9201,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9201,
            text: 'Yes',
            type: 'Choice'
        },
        {
            category_id: 92,
            has_multiple_answers: 0,
            id: 9202,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9202,
            text: 'No',
            type: 'Choice'
        }
    ]
};

questionsModel.getQuoteAppliesData = function(){
    return [
        {
            category_id: 93,
            has_multiple_answers: 0,
            id: 9301,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9301,
            text: 'Employee',
            type: 'Choice'
        },
        {
            category_id: 93,
            has_multiple_answers: 0,
            id: 9302,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9302,
            text: 'Self Employed',
            type: 'Choice'
        },
        {
            category_id: 93,
            has_multiple_answers: 0,
            id: 9303,
            instructions: '',
            product_id: process.env.API_PRODUCT_ID,
            question_id: 9303,
            text: 'RSP or RIF',
            type: 'Choice'
        }
    ]
};

module.exports = questionsModel;