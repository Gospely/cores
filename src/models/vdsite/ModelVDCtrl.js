import React, { PropTypes } from 'react';
import dva from 'dva';
import { Icon, notification } from 'antd';
import randomString from '../../utils/randomString.js';

import initialData from './initialData.js';

const openNotificationWithIcon = (type, title, description) => (
    notification[type]({
        message: title,
        description: description,
    })
)

const methods = {
    checkName(symbols, name) {
            for (var i = 0; i < symbols.length; i++) {
                if (symbols[i].name == name) {
                    return false;
                }
            }
            return true;
        },
        getSymbolIndexByKey(symbols, key) {

            for (var i = 0; i < symbols.length; i++) {
                if (symbols[i].key == key) {
                    return i;
                }
            }
            return undefined;
        }
}

export default {
    namespace: 'vdctrl',
    state: {

        specialAttrList: [],

        commonAttrList: [],
        symbols: [],
        currentSymbolKey: '',
        symbolName: '',
        popoverVisible: false,
        editPopoverVisible: false,
        keyValeUpdateVisible: false,
        keyValeCreateVisible: false,
        publicAttrs: [],

        controllers: []
    },

    subscriptions: {

        setup({ dispatch, history }) {
            history.listen(({
                pathname
            }) => {

                dispatch({
                    type: 'getInitialData'
                });

                dispatch({
                    type: 'appendPublicAttrsToCtrlList'
                });
            });
        }

    },

    reducers: {

        getInitialData(state) {
            state.controllers = initialData.vdctrl.controllers;
            state.specialAttrList = initialData.vdctrl.specialAttrList;
            state.publicAttrs = initialData.vdctrl.publicAttrs;
            return {...state};
        },

        appendPublicAttrsToCtrlList(state) {

            const push = (controllersList) => {
                controllersList.map((item, index) => {
                    const controllers = item.content;

                    const rec = (controllers) => {
                        controllers.map((ctrl, j) => {
                            ctrl = ctrl.details || ctrl;
                            if (ctrl.children) {
                                rec(ctrl.children);
                            }
                            for (var i = 0; i < state.publicAttrs.length; i++ ) {
                                const attrs = state.publicAttrs[i];
                                if (ctrl.attrs.length <= 3) {
                                    ctrl.attrs.push(attrs);
                                }
                            };
                        });
                    }
                    rec(controllers);
                });
            }

            push(state.controllers);

            console.log('appendPublicAttrsToCtrlList', state.controllers, state.publicAttrs);

            return {...state};
        },

        handleCurrentSymbolKey(state, {payload: key}) {
            state.currentSymbolKey = key;
            return {...state};
        },
        handleSymbolNameChange(state, {payload: value}) {
            state.symbolName = value;
            return {...state};
        },
        handleAddSymbol(state, {payload: activeCtrl}) {

            if (!methods.checkName(state.symbols, state.symbolName)) {
                openNotificationWithIcon('info', '控件名已被占用');
            } else {
                var addController = {
                    name: localStorage.symbolName,
                    key: randomString(8, 10),
                    controllers: [activeCtrl]
                }
                state.popoverVisible = false;
                state.symbolName = '';
                state.symbols.push(addController);
            }
            return {...state};
        },
        handlePopoverVisbile(state, {payload: value}) {

            state.popoverVisible = value;
            return {...state};
        },
        handleEditPopoverVisbile(state, {payload: value}) {

            state.editPopoverVisible = value;
            return {...state};
        },
        handleUpdateVisible(state, {payload: value}) {

            state.keyValeUpdateVisible = value;
            return {...state};
        },
        handleCreateVisible(state, {payload: value}) {

            state.keyValeCreateVisible = value;
            return {...state};
        },
        editSymbol(state) {

            if (!methods.checkName(state.symbols, state.symbolName)) {
                openNotificationWithIcon('info', '控件名已被占用');
            } else {
                var index = methods.getSymbolIndexByKey(state.symbols,
                    state.currentSymbolKey);

                if (index == undefined) {
                    openNotificationWithIcon('error', '修改错误,请重试');
                } else {
                    state.symbols[index].name = state.symbolName;
                }
            }
            state.symbolName = '';
            state.currentSymbolKey = '';
            state.editPopoverVisible = false;
            return {...state};
        },
        deleteSymbol(state, { payload: key}) {

            var index = methods.getSymbolIndexByKey(state.symbols, key);
            if (index == undefined) {
                openNotificationWithIcon('error', '删除失败,请重试');
            } else {
                state.symbols.splice(index, 1);
            }
            return {...state};
        }
    },

    effects: {

        * addSymbol(payload, {call, put, select}) {
            var activeCtrl = yield select(state => state.vdCtrlTree.activeCtrl);
            yield put({
                type: "handleAddSymbol",
                payload: {
                    activeCtrl
                }
            });
        }

    }

}
