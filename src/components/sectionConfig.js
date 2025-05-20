import EducationCard from './cards/EducationCard';
import ExperienceCard from './cards/ExperienceCard';
import PaperCard from './cards/PaperCard';
import ProjectCard from './cards/ProjectCard';
import HonerAndAwardCard from './cards/HonerAndAwardCard';

export const SECTIONS = {
  papers: {
    label: 'Papers',
    component: PaperCard,
  },
  education: {
    label: 'Education',
    component: EducationCard,
  },
  experiences: {
    label: 'Experiences',
    component: ExperienceCard,
  },
  projects: {
    label: 'Projects',
    component: ProjectCard,
  },
  honers_and_awards: {
    label: 'Honors and Awards',
    component: HonerAndAwardCard,
  },
  talks: {
    label: 'Talks',
    component: "",
  },
  other: {
    label: '기타 정보',
    component: "",
  }
};