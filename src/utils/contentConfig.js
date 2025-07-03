import EducationContentItem from '../components/ContentItem/Education';
import ExperienceContentItem from '../components/ContentItem/Experience';
import PaperContentItem from '../components/ContentItem/Paper';
import ProjectContentItem from '../components/ContentItem/Project';
import HonorAndAwardContentItem from '../components/ContentItem/HonorAndAward';
import TalkContentItem from '../components/ContentItem/Talk';
import NewsContentItem from '../components/News';

// 캐시와 fetch promise를 저장할 객체
const contentDataCache = {};
const contentDataPromise = {};

const fetchContentData = async (key) => {
  if (contentDataCache[key]) {
    // 이미 데이터가 있으면 바로 반환
    return contentDataCache[key];
  }
  if (!contentDataPromise[key]) {
    // fetch가 진행 중이 아니면 fetch 시작
    contentDataPromise[key] = fetch(`/data/${key}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch /data/${key}.json`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error(`Fetched data for "${key}" is not a list`);
        contentDataCache[key] = data;
        return data;
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        contentDataCache[key] = ['error'];
        return ['error'];
      });
  }
  // fetch가 진행 중이면 해당 promise 반환
  return contentDataPromise[key];
};

const defineContent = (key, contentName, contentComponent) => ({
  contentName: contentName, // 메뉴에 표기할 이름
  contentData: () => fetchContentData(key), // 항상 Promise를 반환 (호출 시 await 필요)
  Component: contentComponent,
});

export const ContentConfig = {
  papers: defineContent('papers', 'Papers', PaperContentItem),
  education: defineContent('education', 'Education', EducationContentItem),
  experiences: defineContent('experiences', 'Experiences', ExperienceContentItem),
  projects: defineContent('projects', 'Projects', ProjectContentItem),
  honors_and_awards: defineContent('honors_and_awards', 'Honors and Awards', HonorAndAwardContentItem),
  talks: defineContent('talks', 'Talks', TalkContentItem)
};

export const NewsContent = defineContent('news', 'News.', NewsContentItem);