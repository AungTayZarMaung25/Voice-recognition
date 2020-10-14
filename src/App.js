import React, { useEffect, useState } from 'react'
import alanBtn from "@alan-ai/alan-sdk-web"

import wordsToNumbers from 'words-to-numbers';

import NewsCards from './components/NewsCards/NewsCards';
import useStyle from './style'

const alanKey = 'ce0747b952b58a60ea3d3e50accf8a422e956eca572e1d8b807a3e2338fdd0dc/stage'

const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1)
    const classes = useStyle()

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles)
                    setActiveArticle(-1)
                } else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1)
                } else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > articles.length) {
                        alanBtn().playText('Please try that again...');
                    } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    } else {
                        alanBtn().playText('Please try that again...');
                    }
                }
            },
        })
    }, [])

    return (
        <div>
            <div className={classes.logoContainer}>
                <img src="https://alan.app/voice/images/previews/preview.jpg" className={classes.alanLogo} alt="Alan Logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    )
}

export default App;