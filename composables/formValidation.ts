export const useRules = () => {
  const rules = {
    required: (value: string) => !!value || "Oops this is Required.",
    textLength: (value: string) => (value && value.length <= 10) || "Name must be less than 10 characters",
    otp: (value: string) => (value && value.length === 10) || "OTP should be 6 digits",
    email: (value: string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Please enter a valid email";
    },
    // date: (value: string) => {
    //   const pattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    //   return pattern.test(value) || "Please enter a valid date";
    // },
    tel: (value: string) => {
      const pattern = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
      return pattern.test(value) || "Please enter a valid phone number.";
    },
    telLength: (value: string) => (value && value.length === 10) || "Phone number should be 10 digits.",
    bvn: (value: string) => {
      return  (value && value.toString().length === 11) || "BVN should be 11 digits."
    },
    text: (value: string) => {
      const pattern = /[ a-zA-Z0-9,#.-]+/g;
      return pattern.test(value) || "Oh Snap! Something is wrong with this text.";
    },
    number: (value: string) => {
      const pattern = /^[0-9]*$/;
      return pattern.test(value) || "Please ensure that this is a number.";
    },
    password: (value: string) => {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return (
        pattern.test(value) ||
        "Password should always be a minimum of 8 characters with capital letters, small letters, numbers and special characters."
      );
    },
  }
  return rules
}
