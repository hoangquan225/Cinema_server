export default class ENDPONTAPI {
  static LOGIN = '/login';
  static REGISTER = '/register';
  static LOGOUT = '/logout';

  //film
  static UPDATE_FILM = '/film/update-film';
  static GET_ALL_FILM = '/film/get-all-film';
  static GET_FILM_BY_ID = '/film/get-film-by-id';

  //User
  static UPDATE_USER = '/user/update-user';
  static CHANGE_PASSWORD = '/user/change-password';
  static GET_USER_FROM_TOKEN = '/user/get-user-from-token';
  static FORGOT_PASSWORD = '/user/forgot-password';
}
