import { reportMapper } from '../../data/api-mapper';

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showReportListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportListMap : error :', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showReportsListLoading();

    try {
      await this.showReportListMap();
      const listOfReports = await this.#model.getAllReports();
      const reports = await Promise.all(listOfReports.map(reportMapper));

      const message = 'berhasil mendapatkan daftar laporan tersimpan';
      this.#view.populateBookmarkedReports(message, reports);
    } catch (error) {
      console.error('initialGaleryAndMap : error : ', error);
      this.#view.populatedBookmarkedReportsError(error.message);
    } finally {
      this.#view.hideReportsListLoading();
    }
  }
}
