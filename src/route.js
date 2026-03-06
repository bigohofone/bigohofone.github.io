import ResumePage from './pages/ResumePage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';

export const routeConfig = [
    {
        path: "/",
        label: "About",
        element: <ResumePage />,
        isMenu: true,
    },
    // {
    //     path: "/projects",
    //     label: "Projects",
    //     element: <ProjectsPage />,
    //     isMenu: true,
    // },
    {
        path: "/blog",
        label: "Blog",
        element: <BlogPage />,
        isMenu: true,
    },
    // // 메뉴에는 안 보이지만 페이지는 존재하는 경우
    // {
    //     path: "/secret",
    //     element: <SecretPage />,
    //     isMenu: false,
    // }
];