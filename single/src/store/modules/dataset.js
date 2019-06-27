let _state = {
    dataList: "",
};

const actions = {
    dispDemo({ commit }) {
        return new Promise((resolve) => {
            $.ajax({
                type: "get",
                url: "/v2/book/search?q=javascript&alt=json&start=1&count=20",
                cache: false,
                success: function(data) {
                    resolve(data);
                    commit("GETBOOKS", data);
                },
            });
        });
    }
};

const getters = {
    updateDemo: (state) => {
        let data = [];
        if (state.dataList && state.dataList.books) {
            data = state.dataList.books[0].author_intro;
        }
        return data;
    }
};

const mutations = {
    ["GETBOOKS"](state, value) {
        _state.dataList = Array.isArray(value) ? value.books[0].author_intro : value;
    }
};

export default {
    state: _state,
    mutations,
    actions,
    getters
};