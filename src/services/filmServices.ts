import AppConfig from '../common/config';
import { BadRequestError, FailureError } from '../utils/errors';
import { FilmModel } from '../database/film';
import { Film } from '../models/film';
import { LIMIT } from '../utils/constant';

class FilmServices {
  public isAllowRun: boolean = true;

  updateFilm = async (body: Film) => {
    if (body?.id) {
      // update
      try {
        const film = await FilmModel.findOneAndUpdate(
          { _id: body?.id },
          {
            $set: {
              ...body,
              updateDate: Date.now(),
            },
          },
          { new: true }
        );
        if (film) {
          return {
            data: film,
            status: AppConfig.STATUS_SUCCESS,
          };
        } else {
          return {
            data: 'không tồn tại',
            status: AppConfig.STATUS_NO_EXIST,
          };
        }
      } catch (error) {
        throw new BadRequestError();
      }
    } else {
      // create
      try {
        const newFilm = await FilmModel.create({
          ...body,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        return {
          data: newFilm,
          status: AppConfig.STATUS_SUCCESS,
        };
      } catch (error) {
        throw new BadRequestError();
      }
    }
  };

  deleteFilm = async (filmId: string) => {
    const deleteFilm = await FilmModel.deleteOne({ _id: filmId });
    if (!deleteFilm) {
      throw new FailureError('Film not found');
    }
    return deleteFilm;
  };

  getFilmById = async (filmId: string) => {
    console.log("/get-film-by-id| " +filmId);

    try {
      const film = await FilmModel.findById(filmId);
      if (!film) {
        throw new FailureError('Film not found');
      }
      return film;
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getAllFilm = async (body: { limit: number; skip: number; status: number }) => {
    console.log("/getAllFilm ");
    try {
      const { limit, skip, status } = body;
      let films
      if (!status) {
        films = await FilmModel.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      } else {
        films = await FilmModel.find({
          status
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      }
      const count = await FilmModel.countDocuments({})

      return {
        data: films.map((film) => new FilmModel(film)),
        count
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  searchFilmByName = async (name: string) => {
    try {
      // Tìm kiếm phim theo tên
      const films = await FilmModel.find({
        name: { $regex: `^${name}`, $options: 'i' },
      });

      return films;
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getFilmByStatus = async (status: number) => {
    try {
      // Tìm kiếm phim theo tên
      const films = await FilmModel.find({
        status
      });

      return films;
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getFilmByCategory = async (category: string) => {
    try {
      // Tìm kiếm phim theo tên
      const films = await FilmModel.find({
        category: { $elemMatch: { $in: category } }
      });
      return films;
    } catch (error) {
      throw new BadRequestError();
    }
  };

  autoUpdateStatusFilm = async () => {
    try {
      const count = await FilmModel.countDocuments({
        status: { $ne: AppConfig.FilmsStatus.DELETE }
      });

      const currentTime = Date.now();

      let limit = LIMIT,
        skip = 0,
        offset = limit * skip;

      while (offset <= count) {
        const films = await FilmModel.find({
          status: { $ne: AppConfig.FilmsStatus.DELETE }
        }).skip(skip).limit(limit);

        for (const film of films) {
          if (currentTime < film.startTime) {
            film.status = 2;
          } else if (currentTime >= film.startTime && currentTime <= film.endTime) {
            film.status = 1;
          } else {
            film.status = 3;
          }
          await film.save();
        }
        skip++;
        offset = limit * skip;
      }

      return { status: AppConfig.STATUS_SUCCESS }
    } catch (error) {
      console.error(error);
      throw new BadRequestError()
    }
  };


  //   autoUpdateStatusFilm = async () => {
  //     if (!this.isAllowRun) return;
  //     try {
  //       const total = await FilmModel.count({
  //         status: { $ne: AppConfig.FilmsStatus.FINISH },
  //       });
  // let limit = LIMIT,
  //   skip = 0,
  //   offset = limit * skip;

  //       while (offset <= total) {
  //         let films = await FilmModel.find(
  //           {},
  //           {
  //             skip,
  //             limit, 
  //           }
  //         );
  //         for (let fiml of films) {
  //           let startTime = momentTz(
  //             fiml.startTime,
  //             'YYYY-MM-DD HH:mm:ss',
  //             true
  //           ).toDate();
  //           let endTime = momentTz(
  //             fiml.endTime,
  //             'YYYY-MM-DD HH:mm:ss',
  //             true
  //           ).toDate();
  //           let currentTime = momentTz(
  //             new Date(),
  //             'YYYY-MM-DD HH:mm:ss',
  //             true
  //           ).toDate();

  //           if (momentTz(currentTime).isBefore(startTime)) {
  //             await this.filmsRepository.updateById(fiml.id, {
  //               status: FilmsStatus.COMING,
  //             });
  //           } else if (
  //             momentTz(startTime).isSameOrBefore(currentTime) &&
  //             momentTz(currentTime).isSameOrBefore(endTime)
  //           ) {
  //             await this.filmsRepository.updateById(fiml.id, {
  //               status: FilmsStatus.GOING_ON,
  //             });
  //           } else {
  //             await this.filmsRepository.updateById(fiml.id, {
  //               status: FilmsStatus.FINISH,
  //             });
  //           }
  //         }
  // skip++;
  // offset = limit * skip;
  //       }
  //       this.isAllowRun = true;
  //     } catch (error) {
  //       console.log('FilmsService::autoUpdateStatusFilm error:', error);
  //       this.isAllowRun = false;
  //     }
  //   };
}

export { FilmServices };
