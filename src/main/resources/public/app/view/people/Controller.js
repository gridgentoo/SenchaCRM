/**
 * SenchaCRM.view.main.MainController
 */
Ext.define('SenchaCRM.view.people.Controller', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.people',

    requires: [
        'SenchaCRM.model.Person'
    ],

    /**
     * @param button
     */
    onAddButtonClick: function (button) {
        var panel = Ext.widget('people-detail');

        var created = Ext.create('SenchaCRM.model.Person');
        panel.getViewModel().setData({
            person: created
        });

        panel.show(button);
    },

    /**
     */
    onSaveFormButtonClick: function () {
        var me = this,
            window = Ext.first('people-detail'),
            record = me.getViewModel().getData().person;

        var fields = [
            me.lookup('firstname'),
            me.lookup('lastname')
        ];
        var results = Ext.Array.map(fields, function (f) {
            return f.validate();
        });
        if (Ext.Array.contains(results, false)) {
            Ext.Msg.alert('SenchaCRM', '入力値が不正です。');
            return;
        }

        var store = Ext.getStore('People');
        store.add(record);

        if (store.getModifiedRecords().length === 0 &&
            store.getRemovedRecords().length === 0) {
            Ext.Msg.alert('SenchaCRM', '変更がありません。');
            return;
        }

        window.mask('処理中...');
        store.sync({
            success: function () {
                Ext.Msg.alert('SenchaCRM', '保存しました', function () {
                    window.destroy();
                    store.load();
                });
            }
        });
    },

    /**
     */
    onSaveGridButtonClick: function () {
        var view = this.getView(),
            store = Ext.getStore('People');

        Ext.Msg.confirm('SenchaCRM', '保存しますか？', function (btn) {
            if (btn === 'yes') {
                if (store.getModifiedRecords().length === 0 &&
                    store.getRemovedRecords().length === 0) {
                    Ext.Msg.alert('SenchaCRM', '変更がありません。');
                    return;
                }

                view.mask('処理中...');
                store.sync({
                    success: function () {
                        view.unmask();
                        Ext.Msg.alert('SenchaCRM', '保存しました', function () {
                            store.load();
                        });
                    }
                });
            }
        });
    },

    /**
     * @param grid
     * @param index
     */
    onDeleteButtonClick: function (grid, index) {
        grid.getStore().removeAt(index);
    },

    /**
     * @param grid
     * @param index
     */
    onDetailButtonClick: function (grid, index, num, option, e) {
        var panel = Ext.widget('people-detail');

        var person = grid.getStore().getAt(index);
        panel.getViewModel().setData({
            person: person
        });

        panel.show(e.event.srcElement);
    },

    /**
     * @param {Ext.dataview.DataView} component
     * @param {Number} index
     * @param {Ext.Element/Ext.dataview.component.DataItem} target
     * @param {Ext.data.Model} record
     * @param {Ext.event.Event} e
     */
    onListItemTap: function (component, index, target, record, e) {
        var me = this,
            page = me.lookup('user');

        me.getViewModel().setData({
            person: record
        });

        page.animateActiveItem(1, {
            type: 'slide',
            direction: 'left'
        });
    },

    /**
     * @param {Ext.Button} component
     * @param {Ext.EventObject} e
     */
    onTapBackButton: function (component, e) {
        this.doBack();
    },

    doBack: function () {
        var page = this.lookup('user');

        page.animateActiveItem(0, {
            type: 'slide',
            direction: 'right'
        });

        Ext.defer(function () {
            page.down('people-detail').getScrollable().scrollTo(0, 0);
        }, 500);
    },

    /**
     * @param {Ext.Button} component
     * @param {Ext.EventObject} e
     */
    onTapSaveButton: function (component, e) {
        var me = this,
            view = me.getView();

        var store = Ext.getStore('People');

        if (store.getModifiedRecords().length === 0 &&
            store.getRemovedRecords().length === 0) {
            Ext.Msg.alert('SenchaCRM', '変更がありません。');
            return;
        }

        view.setMasked({
            xtype: 'loadmask',
            message: '処理中..'
        });

        store.sync({
            success: function () {
                view.unmask();
                me.doBack();
            }
        });
    }

});