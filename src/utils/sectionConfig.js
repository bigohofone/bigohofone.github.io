import EducationCard from '../components/cards/EducationCard';
import ExperienceCard from '../components/cards/ExperienceCard';
import PaperCard from '../components/cards/PaperCard';
import ProjectCard from '../components/cards/ProjectCard';
import HonerAndAwardCard from '../components/cards/HonerAndAwardCard';
import TalkCard from '../components/cards/TalkCard';

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
    component: TalkCard,
  }
};