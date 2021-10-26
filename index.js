const axios = require('axios');
const cheerio = require('cheerio');
const { get, first } = require('cheerio/lib/api/traversing');
const inquirer = require('inquirer')



async function getUrl() {
    let resultScrap = [];

    try {
        await axios.get('https://194.163.183.129/')
            .then(response => {

                // console.log('Last Update')
                const $ = cheerio.load(response.data);

                $('.post-show').first().find('[itemscope=itemscope]').each((i, item) => {
                    let targetUrl = $('a', item).attr('href');
                    // targetUrl.shift()

                    // console.log(targetUrl)
                    let titles = $('a', item).attr('title');
                    // console.log(titles)
                    let postDate = $('div.dtla span', item).last().text().replace(' ', '');
                    resultScrap.push({
                        title: titles,
                        toUrl: targetUrl,
                        date: postDate
                    })
                })

                console.log(resultScrap)
                // console.log(targetUrl)
                // console.log(targetUrl)   
            })
            .catch(error => {
                throw error
            })
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'choiceType',
                    message: `apa sudah makan ?`,
                    choices: [
                        'Last Update',
                        'Last batch'
                    ]
                }
            ])
            .then((answers) => {
                // console.log(answers)
                if (answers.choiceType === 'Last Update') {
                }
            })
            .catch(error => {
                if (error.isTtyError) {
                    console.log(error)
                } else {
                    return
                }
            })
        // response = await console.log(postDate, titles, postDate)
        // return response

    }

    catch (error) {
        console.log(error)

    }

}

let consr = getUrl()
