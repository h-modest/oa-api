import _ from 'underscore';

export function is_email(text) {
    var pattern = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]*\.)+[A-Za-z]{2,14}$/;
    return pattern.test(text);
};

export function is_phone(text) {
    var pattern = /^((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/;
    return pattern.test(text);
};
