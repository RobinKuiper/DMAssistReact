import Formsy from 'formsy-react'

Formsy.addValidationRule('isRequired', function (values, value) {
  return value !== null && value !== '';
});