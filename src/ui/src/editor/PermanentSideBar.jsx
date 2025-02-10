import HandymanIcon from '@mui/icons-material/Handyman';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SettingsIcon from '@mui/icons-material/Settings';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import SideBarItems from './SideBarItems';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ArticleIcon from '@mui/icons-material/Article';
import BookIcon from '@mui/icons-material/Book';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IosShareIcon from '@mui/icons-material/IosShare';

export const sideBarIcons = [
  {
    text: 'prompts',
    icon: HandymanIcon,
    show: true
  },
  {
    text: 'search-citations',
    icon: FormatQuoteIcon,
    show: true
  },
  {
    text: 'ask-to',
    icon: PsychologyAltIcon,
    show: true
  },
  {
    text: 'settings',
    icon: SettingsIcon,
    show: true
  },
  {
    text: 'check',
    icon: ChecklistIcon,
    show: true
  },
  {
    text: 'summextend',
    icon: ReceiptIcon,
    show: true
  },
  {
    text: 'reference',
    icon: ArticleIcon,
    show: true
  },
  {
    text: 'save',
    icon: IosShareIcon,
    show: true
  },
  {
    text: 'bibliography',
    icon: BookIcon,
    show: false
  }
]


export default function SideBar({setSelectedProject, isBibliographyShowed, isHidden, setIsHidden, selectedProject}) {
  sideBarIcons[sideBarIcons.length-1].show = isBibliographyShowed
  return (
      <div className='flex flex-col w-10 h-screen pt-10 overflow-y-hidden gap-3 left-0'>
          {sideBarIcons.map((i, index) => (
            <SideBarItems 
            item={i} 
            setSelectedProject={setSelectedProject} 
            index={index} 
            key={index} 
            setIsHidden={setIsHidden}
            isHidden={isHidden}
            selectedProject={selectedProject} />
          ))}
      </div>
      
  );
}
