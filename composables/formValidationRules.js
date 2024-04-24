export const useFormRules = {
  required: (value) => !!value || "This field is required",
  counter: (value) => value.length <= 20 || "Max 20 characters",
  phone: (value) => (value && value.length === 10) || "Please input a valid phone number",
  password: (value) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\p{P}\p{S}])[A-Za-z\d\p{P}\p{S}]{8,}$/u;
    return (
      pattern.test(value) ||
      "Password should always be a minimum of 8 characters with capital letters, small letters, numbers and special characters."
    );
  },
  confirmPassword: (v) => v === form.value.password || "Password doesn't match",
  email: (value) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Please enter a valid email";
  },
  text: (value) => {
    const pattern = /[ a-zA-Z0-9,#.-]+/g;
    return pattern.test(value) || "Oh Snap! Something is wrong with this text.";
  },
  number: (value) => {
    const pattern = /^[0-9]*$/;
    return pattern.test(value) || "Please ensure that this is a number.";
  },
  miscLength: (value) => (value && value.length <= 500) || "Max 500 characters",
  age: (value) =>
    (value && value >= 18) ||
    "The minimum age required for consultation is 18 years",
  tel: (value) => {
    const pattern = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
    return pattern.test(value) || "Please enter a valid phone number.";
  },
}; 