const index = r => require.ensure([], () => r(require("../pages/index")));
const error = r => require.ensure([], () => r(require("../pages/404")));
export default [{
        path: "/",
        name: "index",
        meta: {
            title: "主页",
        },
        component: index
    },
    {
        path: "/404",
        name: "404",
        meta: {
            title: "页面404",
        },
        component: error
    },
    {
        path: "*",
        component: {
            functional: true,
            render(createElement, context) {
                setTimeout(() => {
                    context.parent.$router.replace("/404");
                }, 1000);
            }
        }
    }
];