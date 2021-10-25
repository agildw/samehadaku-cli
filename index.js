const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://194.163.183.129/')
    .then(response => {
        const $ = cheerio.load(response.data);
        $('.post-show').first().find('[itemscope=itemscope]').each((i, item) => {
            // let hasil = $(`div.thumb a`).attr('href');
            // console.log(i)
            const targetUrl = $('a', item).attr('href');
            // console.log($(item).html())
            console.log(targetUrl)
            const titles = $('a', item).attr('title');
            console.log(titles)
        })
    })