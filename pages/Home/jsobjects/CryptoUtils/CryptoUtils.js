export default {
  md5: function (input) {
    // Use the CryptoJS library (ensure it's loaded in Libraries)
    return CryptoJS.MD5(input).toString();
  },
};
