export default class AppConfig {
  static LOGIN_FAILED = -1;
  static LOGIN_SUCCESS = 0;
  static LOGIN_ACCOUNT_IS_USED = 1;
  static LOGIN_ACCOUNT_NOT_EXIST = 2;
  static LOGIN_WRONG_PASSWORD = 3;
  static LOGIN_WRONG_PROVIDER = 4;
  static LOGIN_ACCOUNT_NOT_ACTIVATED = 5;
  static LOGIN_TOKEN_INVALID = 8;
  static LOGIN_WAIT_FOR_EMAIL_VERIFICATION = 9;

  static STATUS_PUBLIC = 1;
  static STATUS_PRIVATE = 0;
  static STATUS_DELETED = -1;
  static STATUS_SUCCESS = 0;
  static RESPONSIVE_NULL = 1;
  static STATUS_FAIL = -1;
  static STATUS_NO_EXIST = 2;

  // user role
  static ROLE_ADMIN = 0;
  static ROLE_USER = 1;

  static GENDER_MALE = 1;
  static GENDER_FEMALE = 2;
  static GENDER_OTHER = 3;

  static UserStatus = Object.freeze({
    NOT_ACTIVATED: -2,
    DELETED: -1,
    NORMAL: 0,
  });
}
