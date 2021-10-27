const axios = require('axios');
const cheerio = require('cheerio');
const { get, first, children } = require('cheerio/lib/api/traversing');
const { link } = require('fs');
const inquirer = require('inquirer');
const { format } = require('path');
const { performance } = require('perf_hooks');
const chalk = require('chalk');
const fs = require('fs')


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


        console.log(chalk.yellowBright(`loaded in ${(Math.floor(firstEnd - firstStart) / 1000)} Second`))
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'choiceType',
                    message: `Please select option below ?`,
                    choices: [
                        'Latest episode',
                    ]
                }
            ])
            .then((answers) => {
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
                            console.log(`Selected episode ${chalk.bold.cyan(resultEpisode[indexChoose].title)}`)
                            let secondStart = performance.now();
                            axios.get(resultEpisode[indexChoose].toUrl)
                                .then(response => {
                                    const $ = cheerio.load(response.data);

                                    //get download link
                                    $('.pencenter').each((i, item) => {
                                        $('#downloadb').each((i, item) => {
                                            let resolutionCounts = $('ul li', item).length
                                            let formatVid = $('b', item).text();


                                            for (x = 1; x <= resolutionCounts; x++) {
                                                let resolutions = $(`ul > li:nth-child(${x}) > strong`, item).text()
                                                let linkCount = $(`ul li:nth-child(${x}) > span`, item).length;
                                                //mirror title link
                                                let TitleLink = $(`ul > li:nth-child(${x}) > span:nth-child(${x + 1}) > a `, item).text();
                                                console.log(`\n${chalk.green(formatVid)} - ${chalk.green(resolutions)}`)

                                                for (y = 1; y <= linkCount; y++) {
                                                    let linkDownloads = $(`ul > li:nth-child(${x}) > span:nth-child(${y + 1}) > a `, item).attr('href')
                                                    console.log(linkDownloads)
                                                }
                                            }
                                        })
                                    })
                                    let secondEnd = performance.now();
                                    console.log(chalk.yellowBright(`loaded in ${(Math.floor(secondEnd - secondStart) / 1000)} Second`))

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
