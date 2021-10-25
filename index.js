const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://194.163.183.129/')
    .then(response => {
        console.log('Last Update')
        const $ = cheerio.load(response.data);
        $('.post-show').first().find('[itemscope=itemscope]').each((i, item) => {
            const targetUrl = $('a', item).attr('href');
            console.log(targetUrl)
            const titles = $('a', item).attr('title');
            console.log(titles)
            const postDate = $('div.dtla span', item).last().text().replace(' ', '');
            console.log(postDate)
            console.log('[=====]\n')
        })
    })