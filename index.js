const axios = require('axios');
const cheerio = require('cheerio');
const { get, first, children } = require('cheerio/lib/api/traversing');
const inquirer = require('inquirer');
const { format } = require('path');
const { performance } = require('perf_hooks');


async function getUrl() {
    let resultEpisode = [];
    let resultBatch = [];
    try {
        let firstStart = performance.now();
        await axios.get('https://194.163.183.129/')
            .then(response => {
                const $ = cheerio.load(response.data);

                //get latest episode
                $('.post-show').first().find('[itemscope=itemscope]').each((i, item) => {
                    let targetUrl = $('a', item).attr('href');
                    let titles = $('a', item).attr('title');
                    let postDate = $('div.dtla span', item).last().text().replace(' ', '');
                    resultEpisode.push({
                        title: titles,
                        toUrl: targetUrl,
                        date: postDate
                    })
                })
                //get latest batch
                $('.post-show').last().find('[itemscope=itemscope]').each((i, item) => {
                    let targetUrl = $('a', item).attr('href');
                    let titles = $('a', item).attr('title');
                    let postDate = $('div.dtla span', item).last().text().replace(' ', '');
                    resultBatch.push({
                        title: titles,
                        toUrl: targetUrl,
                        date: postDate
                    })
                })
            })
            .catch(error => {
                throw error
            })
        let firstEnd = performance.now();
        // console.log(resultEpisode.length)
        // resultEpisode.forEach((number) => {
        //     console.log(number.title)
        //     console.log(number.date)

        // })
        console.log()
        console.log(`loaded in ${(Math.floor(firstEnd - firstStart) / 1000)} Sec`)
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'choiceType',
                    message: `Please select option below ?`,
                    choices: [
                        'Latest episode',
                        'Latest batch'
                    ]
                }
            ])
            .then((answers) => {
                // console.log(resultEpisode[1].title)
                if (answers.choiceType === 'Latest episode') {
                    let question = [{
                        type: 'list',
                        name: 'chooseEpisode',
                        message: 'Select episode below',
                        choices: resultEpisode.map((episodes, index) => ({ name: `[${index + 1}] ${episodes.title}\n${episodes.date}`, value: index }))
                    }]
                    inquirer
                        .prompt(question)
                        .then(answers => {
                            const indexChoose = answers.chooseEpisode
                            console.log(`Selected episode ${resultEpisode[indexChoose].title}`)
                            let secondStart = performance.now();
                            axios.get(resultEpisode[indexChoose].toUrl)
                                .then(response => {
                                    const $ = cheerio.load(response.data);
                                    let downloadEpisode = [];
                                    let titleAndDownload = []
                                    //get download link
                                    $('.pencenter').each((i, item) => {
                                        $('#downloadb').each((i, item) => {
                                            let resolutionCounts = $('ul li', item).length
                                            let formatVid = $('b', item).text();


                                            for (x = 1; x <= resolutionCounts; x++) {
                                                // console.log(x)
                                                let resolutions = $(`ul > li:nth-child(${x}) > strong`, item).text()

                                                // console.log($(item).html())
                                                // console.log($(`ul > li:nth-child(${x}) > span:nth-child(${x + 1})`, item).html())
                                                // let linkCount = $(`ul li:nth-child(${x}) > span`, item).length;
                                                // console.log(linkCount)

                                                let TitleLink = $(`ul > li:nth-child(${x}) > span:nth-child(${x + 1}) > a `, item).text();
                                                // console.log(TitleLink)
                                                let savedDownloads = []
                                                // let linkDownloads;

                                                if ($(`ul > li:nth-child(${x}) > span:nth-child(${x + 1}) > a `, item).attr('href') !== undefined) {
                                                    let linkDownloads = $(`ul > li:nth-child(${x}) > span:nth-child(${x + 1}) > a `, item).attr('href')
                                                    savedDownloads.push(linkDownloads)
                                                    // console.log(linkDownloads)
                                                }
                                                // console.log(formatVid)
                                                // console.log(linkDownloads)

                                                // console.log(savedDownloads)

                                                downloadEpisode.push({
                                                    format: formatVid,
                                                    resolution: resolutions,
                                                    downloadLink: {
                                                        title: TitleLink,
                                                        links: savedDownloads
                                                    }

                                                });


                                            }


                                        })

                                    })
                                    console.log(downloadEpisode)
                                    let secondEnd = performance.now();
                                    console.log(`loaded in ${(Math.floor(secondEnd - secondStart) / 1000)} Sec`)

                                })
                                .catch(error => {
                                    throw error
                                })

                        })
                        .catch(error => {
                            if (error.isTtyError) {
                                console.log(error)
                                // throw error
                            } else {
                                return
                            }
                        })
                }
            })
            .catch(error => {
                if (error.isTtyError) {
                    console.log(error)
                    // throw error
                } else {
                    return
                }
            })
    }

    catch (error) {
        console.log(error)

    }

}

let consr = getUrl()
