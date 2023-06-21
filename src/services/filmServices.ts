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
        console.log(error);
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

  //   autoUpdateStatusFilm = async () => {
  //     if (!this.isAllowRun) return;
  //     try {
  //       const total = await FilmModel.count({
  //         status: { $ne: AppConfig.FilmsStatus.FINISH },
  //       });

  //       let limit = LIMIT,
  //         skip = 0,
  //         offset = limit * skip;

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
  //         skip++;
  //         offset = limit * skip;
  //       }
  //       this.isAllowRun = true;
  //     } catch (error) {
  //       console.log('FilmsService::autoUpdateStatusFilm error:', error);
  //       this.isAllowRun = false;
  //     }
  //   };
}

export { FilmServices };
