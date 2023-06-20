export const TOKEN_EXPIRED = 24 * 60 * 60;
export const COOKIE_EXPIRED = 30;
export const TOKEN_FORGOT_PASS_EXPIRED = 10 * 60;

export const LIMIT = 100;

export enum FilmsStatus {
  DRAFT,
  COMING,
  GOING_ON,
  FINISH,
}

// export enum FilmCategories {
//   ROMANCE = 'Romance', // Phim lãng mạn
//   ADVENTURE = 'Adventure', // phim phiêu lưu
//   COMEDY = 'Comedy', // Phim hài
//   DOCUMENTARY = 'Documentary', // Phim tài liệu
//   ACTION = 'Action', // Phim hành động
//   SCIENCE_FICTION = 'Science fiction', // Phim khoa học viễn tưởng
//   WAR = 'War', // Phim về chiến tranh
//   DRAFT = 'DRAFT',
// }

export enum FilmCategories {
  DRAFT,
  ROMANCE, // 1 - Phim lãng mạn
  ADVENTURE, // 2 -  phim phiêu lưu
  COMEDY, // 3 - Phim hài
  DOCUMENTARY, // 4 - Phim tài liệu
  ACTION, // 5 - Phim hành động
  SCIENCE_FICTIONiction, // 6 - Phim khoa học viễn tưởng
  WAR, // 7 - Phim về chiến tranh
}

export const checkStatus = (num: number) => {
  return [0, 1, 2, 3].includes(num);
};
