import { useState, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";


const NEWS_DIR = "/data/aboutme/news";


const MONTH_ORDER = [
    'January','February','March','April','May','June','July',
    'August','September','October','November','December'
];


export function useNews() {
    const { locale } = useAppContext();
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const currentYear = new Date().getFullYear();
            const fetchedNews = [];

            for (let year = currentYear; year >= 2020; year--) {
                const path = `${NEWS_DIR}/${year}.${locale}.jsonl`; // in public folder so no need for process.env.PUBLIC_URL
                try {
                    const response = await fetch(path, { cache: "no-store" });
                    if (!response.ok) continue;

                    const text = await response.text();
                    const lines = text.split("\n").filter(line => line.trim() !== "");

                    for (const line of lines) {
                        const newsItem = JSON.parse(line);
                        fetchedNews.push({
                            year: `${year}`,
                            month: newsItem.month,
                            title: newsItem.title
                        });
                    }
                } catch (error) {
                    console.error(`Error loading news from ${path}:`, error);
                    continue;
                }
            }

            // month 기준으로 정렬
            fetchedNews.sort((a, b) => {
                const monthA = MONTH_ORDER.indexOf(a.month);
                const monthB = MONTH_ORDER.indexOf(b.month);
                return monthB - monthA;
            });

            setNewsList(fetchedNews);
        };

        fetchNews();
    }, [locale]);

    return newsList;
};