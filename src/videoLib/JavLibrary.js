import axios from 'axios';

import getCheerio from '../getCheerio';

export default class JavLibrary {
  constructor() {
    this.baseURL = 'http://www.javlibrary.com/tw';
    this.http = axios.create({
      baseURL: this.baseURL,
      headers: { Cookie: 'over18=18' },
    });
  }

  _isSearchPage = data => /識別碼搜尋結果/.test(data);
  _hasResult = data => !/(搜尋沒有結果|搜尋字串是無效)/.test(data);

  _getVideoUrl = (code, $) => {
    const url = $('div.video')
      .filter((i, elem) => $(elem).children().find('div.id').text() === code)
      .find('a')
      .attr('href');

    if (!url) {
      throw new Error(`code: ${code}, not found same video url`);
    }

    return url.slice(1);
  };

  _getCodePage = async code => {
    const { data } = await this.http.get(`/vl_searchbyid.php?keyword=${code}`);

    if (!this._hasResult(data)) {
      throw new Error(`code: ${code}, video not found`);
    }

    let $ = getCheerio(data);
    if (this._isSearchPage(data)) {
      const url = this._getVideoUrl(code, $);
      const response = await this.http.get(url);

      $ = getCheerio(response.data);
    }

    return $;
  };

  getCodeInfos = async code => {
    const $ = await this._getCodePage(code);

    const id = $('#video_id td.text').text();

    const title = $('#video_title h3.post-title.text').text();
    const models = [];
    $('#video_cast span.cast').each((i, elem) => {
      const arr = $(elem).text().split(' ').filter(e => e);
      models.push(...arr);
    });
    const imgUrl = $('link[rel=image_src]').attr('href');
    const publishedAt = new Date($('#video_date td.text').text());
    const length = Number($('#video_length span.text').text());
    const score = Number($('#video_review span.score').text().slice(1, -1));
    const tags = [];
    $('#video_genres span.genre').each((i, elem) => {
      tags.push($(elem).text());
    });

    return {
      id,
      title,
      models,
      imgUrl,
      publishedAt,
      length,
      score,
      tags,
    };
  };
}
